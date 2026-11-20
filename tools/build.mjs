// tools/build.mjs — makes the exported site fast without changing how it looks.
//
// Run after every Claude Design export:   cd tools && npm i && npm run build
//
// What it does (idempotent; safe to re-run):
//   1. Images: large PNG/JPGs in assets/ get an optimized .webp sibling (max 2000px wide).
//   2. Scripts: every .jsx is precompiled (no in-browser Babel), every local .js/.css minified,
//      all written to _build/ with content-hash query strings. Asset paths point at the .webp files.
//   3. HTML: drops Babel + unused font CSS, swaps React dev for vendored production builds,
//      mounts React synchronously (no blank first frame), and adds cross-page view transitions
//      plus prerender-on-hover so navigating feels instant.
// Source files (.jsx/.js/.css/images) are never modified; only *.html, _build/, and *.webp are written.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = "_build";
const MANIFEST = path.join(ROOT, "tools", "build-manifest.json");
const IMG_MIN_BYTES = 100 * 1024;
const IMG_MAX_W = 2000;
const IMG_SKIP = /(^|\/)(og-image|apple-touch-icon|favicon[^/]*)\.(png|jpe?g)$/i;
const IMG_LOSSLESS = /pixel|sprite/i;
const DROP_LINKS = [/db\.onlinewebfonts\.com/, /family=Bricolage\+Grotesque/, /family=Libre\+Caslon/];

const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
const abs = (r) => path.join(ROOT, r);
const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 10);
const read = (r) => fs.readFileSync(abs(r), "utf8");
const write = (r, s) => { fs.mkdirSync(path.dirname(abs(r)), { recursive: true }); fs.writeFileSync(abs(r), s); };

const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : { images: {}, outputs: {} };

// ---------- 1. images ----------
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

async function optimizeImages() {
  const map = {};
  for (const file of walk(abs("assets"))) {
    const r = rel(file);
    if (!/\.(png|jpe?g)$/i.test(r) || IMG_SKIP.test(r)) continue;
    const st = fs.statSync(file);
    if (st.size < IMG_MIN_BYTES) continue;
    const outR = r.replace(/\.(png|jpe?g)$/i, ".webp");
    const prev = manifest.images[r];
    if (prev && prev.src === `${st.size}:${st.mtimeMs}` && fs.existsSync(abs(outR))) {
      if (prev.used) map[r] = outR;
      continue;
    }
    if (fs.existsSync(abs(outR)) && !prev) { console.warn(`skip ${r}: ${outR} already exists and isn't ours`); continue; }
    const lossless = IMG_LOSSLESS.test(r);
    let img = sharp(file).rotate();
    const meta = await img.metadata();
    if (!lossless && meta.width > IMG_MAX_W) img = img.resize({ width: IMG_MAX_W, withoutEnlargement: true });
    const buf = await img.webp(lossless ? { lossless: true, effort: 6 } : { quality: 80, alphaQuality: 90, effort: 5 }).toBuffer();
    const used = buf.length < st.size * 0.8;
    if (used) { fs.writeFileSync(abs(outR), buf); map[r] = outR; }
    else if (fs.existsSync(abs(outR))) fs.unlinkSync(abs(outR));
    manifest.images[r] = { src: `${st.size}:${st.mtimeMs}`, used, out: outR, from: st.size, to: buf.length };
    console.log(`${used ? "webp" : "keep"} ${r}  ${(st.size / 1024) | 0}KB -> ${(buf.length / 1024) | 0}KB`);
  }
  return map;
}

// longest paths first so "a/b-crop.png" never gets clobbered by "a/b.png"-style overlaps
function makeAssetRewriter(map) {
  const pairs = Object.entries(map).sort((a, b) => b[0].length - a[0].length);
  return (text) => {
    for (const [from, to] of pairs) {
      if (text.includes(from)) text = text.split(from).join(to);
      const enc = encodeURI(from);
      if (enc !== from && text.includes(enc)) text = text.split(enc).join(encodeURI(to));
    }
    return text;
  };
}

// ---------- 2. scripts + styles ----------
// In-browser Babel ran each file as a classic script with const/let/class lowered to var,
// so top-level names were shared across files and visible on window. Keep that contract.
function hoistTopLevel(code) {
  return code
    .replace(/^(?:const|let)\s/gm, "var ")
    .replace(/^class\s+([A-Za-z_$][\w$]*)/gm, "var $1 = class $1");
}

async function compileScript(code, loader) {
  const a = await esbuild.transform(code, { loader, jsx: "transform", target: "es2019", charset: "utf8" });
  const b = await esbuild.transform(hoistTopLevel(a.code), { loader: "js", minify: true, target: "es2019", charset: "utf8" });
  return b.code;
}

function rebaseCssUrls(css, srcR, outR) {
  const srcDir = path.posix.dirname(srcR), outDir = path.posix.dirname(outR);
  // quoted alternatives swallow whole data: URIs, so url(%23id) refs inside inline SVGs are left alone
  return css.replace(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^'")\s]+))\s*\)/g, (m, dq, sq, bare) => {
    const u = dq ?? sq ?? bare, q = dq != null ? '"' : sq != null ? "'" : "";
    if (/^(data:|https?:|\/|#|%23)/i.test(u)) return m;
    const target = path.posix.normalize(path.posix.join(srcDir, u));
    return `url(${q}${path.posix.relative(outDir, target)}${q})`;
  });
}

const built = new Map(); // source rel -> output rel?v=hash
async function buildFile(srcR, rewrite) {
  if (built.has(srcR)) return built.get(srcR);
  const ext = path.extname(srcR).toLowerCase();
  const outR = `${OUT}/${srcR.replace(/\.jsx$/i, ".js")}`;
  let src = rewrite(read(srcR)), out;
  if (ext === ".css") {
    // @import'ed web-font CSS -> self-hosted copy (relative to the built file)
    for (const [m, , u] of [...src.matchAll(/@import\s+(?:url\(\s*)?(['"]?)(https:\/\/[^'")\s]+)\1\s*\)?\s*;/g)]) {
      if (!FONT_HOSTS.test(u)) continue;
      const ref = await selfHostFontCss(u);
      src = src.replace(m, () => `@import url("${path.posix.relative(path.posix.dirname(srcR), ref)}");`);
    }
    out = (await esbuild.transform(rebaseCssUrls(src, srcR, outR), { loader: "css", minify: true, charset: "utf8" })).code;
  } else {
    out = await compileScript(src, ext === ".jsx" ? "jsx" : "js");
  }
  write(outR, out);
  manifest.outputs[outR] = srcR;
  const ref = `${outR}?v=${hash(out)}`;
  built.set(srcR, ref);
  return ref;
}

// a src/href in HTML -> source file rel path (handles already-built pages)
function resolveLocal(ref) {
  let p = decodeURI(ref.split("?")[0].split("#")[0]).replace(/^\.\//, "");
  if (p.startsWith(`${OUT}/`)) p = manifest.outputs[p] || null;
  return p && fs.existsSync(abs(p)) ? p : null;
}

// ---------- fonts: self-host Google Fonts / Fontshare CSS (no third-party connection before first paint) ----------
const FONT_HOSTS = /^https:\/\/(fonts\.googleapis\.com|api\.fontshare\.com)\//;
const FONT_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";
async function selfHostFontCss(url) {
  const key = hash(url), cssR = `vendor/fonts/${key}.css`;
  (manifest.fonts ||= {})[cssR] = url;
  if (fs.existsSync(abs(cssR))) return `${cssR}?v=${hash(read(cssR))}`;
  const res = await fetch(url.replace(/&amp;/g, "&"), { headers: { "User-Agent": FONT_UA } });
  if (!res.ok) throw new Error(`font css ${res.status} ${url}`);
  let css = await res.text();
  for (const [m, , u] of [...css.matchAll(/url\(\s*(['"]?)((?:https:)?\/\/[^'")]+)\1\s*\)/g)]) {
    const full = u.startsWith("//") ? `https:${u}` : u;
    const ext = (full.match(/\.(woff2?|ttf|otf)(?=$|\?)/) || [, "woff2"])[1];
    const fR = `vendor/fonts/${hash(full)}.${ext}`;
    if (!fs.existsSync(abs(fR))) {
      const f = await fetch(full, { headers: { "User-Agent": FONT_UA } });
      if (!f.ok) throw new Error(`font ${f.status} ${u}`);
      fs.mkdirSync(path.dirname(abs(fR)), { recursive: true });
      fs.writeFileSync(abs(fR), Buffer.from(await f.arrayBuffer()));
    }
    css = css.split(m).join(`url(${path.posix.basename(fR)})`);
  }
  css = css.replace(/font-display:\s*(auto|block|fallback|optional)/g, "font-display:swap");
  write(cssR, (await esbuild.transform(css, { loader: "css", minify: true })).code);
  return `${cssR}?v=${hash(read(cssR))}`;
}

// ---------- 3. html ----------
const REACT = {
  "react.development.js": "vendor/react.production.min.js",
  "react.production.min.js": "vendor/react.production.min.js",
  "react-dom.development.js": "vendor/react-dom.production.min.js",
  "react-dom.production.min.js": "vendor/react-dom.production.min.js",
};

// Mount synchronously so the first painted frame already has content (no flash, clean view transition).
const SYNC_MOUNT = `<script id="perf-sync-mount">(function(){var D=window.ReactDOM;if(!D||!D.flushSync||D.__sync)return;var c=D.createRoot;D.createRoot=function(e,o){var r=c.call(D,e,o),f=r.render.bind(r);r.render=function(x){D.flushSync(function(){f(x)})};return r};D.__sync=1})();</script>`;

const PERF_HEAD = `<style id="perf-vt">
@view-transition{navigation:auto}
::view-transition-group(root){animation-duration:.32s;animation-timing-function:cubic-bezier(.2,.8,.2,1)}
::view-transition-old(root){animation:vt-out .18s cubic-bezier(.4,0,1,1) both}
::view-transition-new(root){animation:vt-in .32s cubic-bezier(.2,.8,.2,1) both}
@keyframes vt-out{to{opacity:0}}
@keyframes vt-in{from{opacity:0;transform:translateY(6px)}}
.sb{view-transition-name:sb}
::view-transition-group(sb),::view-transition-old(sb),::view-transition-new(sb){animation:none}
@media (prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}
</style>
<script type="speculationrules" id="perf-spec">{"prerender":[{"where":{"and":[{"href_matches":"/*"},{"not":{"selector_matches":"[target=_blank], [download]"}}]},"eagerness":"moderate"}],"prefetch":[{"where":{"and":[{"href_matches":"/*"},{"not":{"selector_matches":"[target=_blank], [download]"}}]},"eagerness":"eager"}]}</script>`;

// Local <img> tags get their real width/height (and async decoding) so the browser reserves
// space before the file arrives: lazy images no longer push the text down while you scroll (CLS).
const sizeCache = new Map();
async function addImageSizes(html) {
  for (const [m] of [...html.matchAll(/<img\b[^>]*>/g)]) {
    if (/\swidth=/.test(m)) continue;
    const src = (m.match(/\ssrc="([^"]+)"/) || [])[1];
    if (!src || /^(https?:|data:)/.test(src)) continue;
    const r = decodeURIComponent(src.split("?")[0]);
    if (!fs.existsSync(abs(r))) continue;
    if (!sizeCache.has(r)) {
      try { const { width, height } = await sharp(abs(r)).metadata(); sizeCache.set(r, width && height ? [width, height] : null); }
      catch { sizeCache.set(r, null); }
    }
    const wh = sizeCache.get(r);
    if (!wh) continue;
    let tag = m.replace(/^<img\b/, `<img width="${wh[0]}" height="${wh[1]}"`);
    if (!/\sdecoding=/.test(tag)) tag = tag.replace(/^<img\b/, '<img decoding="async"');
    html = html.replace(m, () => tag);
  }
  return html;
}

async function buildHtml(file, rewrite) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;

  // drop Babel and unused font stylesheets
  html = html.replace(/[ \t]*<script[^>]*src="[^"]*@babel\/standalone[^"]*"[^>]*><\/script>\n?/g, "");
  html = html.replace(/[ \t]*<link[^>]*href="([^"]+)"[^>]*>\n?/g, (m, href) => (DROP_LINKS.some((re) => re.test(href)) ? "" : m));

  // external + local <script src>
  const tags = [...html.matchAll(/<script([^>]*?)\ssrc="([^"]+)"([^>]*)><\/script>/g)];
  for (const [m, pre, src, post] of tags) {
    const attrs = (pre + post).replace(/\s(type="text\/babel"|integrity="[^"]*"|crossorigin(="[^"]*")?)/g, "");
    const base = src.split("?")[0].split("/").pop();
    if (/^https?:/.test(src)) {
      if (REACT[base] && /react/.test(src)) html = html.replace(m, () => `<script${attrs} src="${REACT[base]}"></script>`);
      continue;
    }
    if (src.startsWith("vendor/")) continue;
    const srcR = resolveLocal(src);
    if (!srcR) { console.warn(`  ${rel(file)}: missing script ${src}`); continue; }
    const ref = await buildFile(srcR, rewrite);
    html = html.replace(m, () => `<script${attrs} src="${ref}"></script>`);
  }

  // inline <script type="text/babel"> blocks
  for (const [m, body] of [...html.matchAll(/<script type="text\/babel">([\s\S]*?)<\/script>/g)]) {
    const js = (await compileScript(rewrite(body), "jsx")).replace(/<\/script/gi, "<\\/script");
    html = html.replace(m, () => `<script>${js}</script>`);
  }

  // web-font CSS -> self-hosted copy; preconnects to those hosts are no longer needed
  html = html.replace(/[ \t]*<link[^>]*rel="preconnect"[^>]*href="https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|api\.fontshare\.com)"[^>]*>\n?/g, "");
  for (const [m, href] of [...html.matchAll(/<link[^>]*href="([^"]+)"[^>]*rel="stylesheet"[^>]*>|<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)].map(([m, a, b]) => [m, a || b])) {
    const orig = FONT_HOSTS.test(href) ? href : (manifest.fonts || {})[href.split("?")[0]];
    if (!orig) continue;
    const ref = await selfHostFontCss(orig);
    html = html.replace(m, () => `<link rel="stylesheet" href="${ref}" />`);
  }

  // local stylesheets
  for (const [m, href] of [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)]) {
    if (/^https?:/.test(href) || href.startsWith("vendor/")) continue;
    const srcR = resolveLocal(href);
    if (!srcR) continue;
    const ref = await buildFile(srcR, rewrite);
    html = html.replace(m, () => m.replace(href, ref));
  }

  // React sync mount right after react-dom
  if (html.includes("vendor/react-dom.production.min.js") && !html.includes('id="perf-sync-mount"')) {
    html = html.replace(/(<script[^>]*src="vendor\/react-dom\.production\.min\.js"[^>]*><\/script>)/, (t) => `${t}\n${SYNC_MOUNT}`);
  }

  // transitions + prerender (skip redirect stubs and embeds that don't navigate)
  const isRedirect = /http-equiv="refresh"/.test(html);
  html = html.replace(/<style id="perf-vt">[\s\S]*?<\/style>\n?<script type="speculationrules" id="perf-spec">[\s\S]*?<\/script>\n?/, "");
  if (!isRedirect) html = html.replace("</head>", () => `${PERF_HEAD}\n</head>`);

  html = rewrite(html);
  if (/<body[^>]*class="[^"]*\bcb\b/.test(html)) html = await addImageSizes(html); // case studies only: their CSS keeps height:auto
  if (html !== before) { fs.writeFileSync(file, html); console.log(`html ${rel(file)}`); }
}

// ---------- run ----------
const map = await optimizeImages();
const rewrite = makeAssetRewriter(map);
for (const f of fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"))) await buildHtml(abs(f), rewrite);

// remove stale outputs
for (const outR of Object.keys(manifest.outputs)) {
  if (![...built.values()].some((v) => v.startsWith(outR + "?"))) {
    if (fs.existsSync(abs(outR))) fs.unlinkSync(abs(outR));
    delete manifest.outputs[outR];
  }
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
const saved = Object.values(manifest.images).filter((i) => i.used).reduce((s, i) => s + i.from - i.to, 0);
console.log(`done: ${built.size} files built, images save ${(saved / 1048576).toFixed(1)}MB`);
