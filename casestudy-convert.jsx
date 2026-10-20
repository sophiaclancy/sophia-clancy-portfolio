// casestudy-convert.jsx — converts legacy data.jsx projects into the CASE15 section format
(function () {
  window.CASE15 = window.CASE15 || {};
  const map = (b) => {
    switch (b.t) {
      case "text": return { t: "p", body: b.body };
      case "note": return { t: "note", text: b.text || b.body };
      case "media": return { t: "fig", label: b.label, caption: b.caption, ratio: b.ratio };
      case "list": return { t: "list", items: b.items };
      case "callout": return { t: "callout", label: b.label, text: b.text || b.body };
      case "img": return { t: "img", src: b.src, bg: b.bg, caption: b.caption };
      case "points": return { t: "cards", cols: b.cols, items: b.items };
      case "table": return { t: "table", head: b.head, rows: b.rows };
      case "subhead": return { t: "subhead", title: b.title, body: b.body };
      case "gallery": return { t: "gallery", cols: b.cols, items: b.items };
      default: return null;
    }
  };
  (window.PROJECTS || []).forEach((p) => {
    if (window.CASE15[p.id]) return;
    const secs = [];
    (p.blocks || []).forEach((b) => {
      if (b.t === "head") { secs.push({ id: b.id, nav: b.nav || b.eyebrow, eyebrow: b.eyebrow, title: b.title, body: b.body, blocks: [] }); return; }
      const m = map(b); if (!m) return;
      if (!secs.length) secs.push({ id: "overview", nav: "Overview", eyebrow: "Overview", title: p.headline, blocks: [] });
      secs[secs.length - 1].blocks.push(m);
    });
    if (!secs.length) return;
    if (!p.hero) {
      if (p.id === "p7") p.hero = "assets/thumbs/contexto.png";
      else { const im = (p.blocks || []).find((x) => x.t === "img" && x.src); if (im) { p.hero = im.src; p.heroBg = im.bg; } }
    }
    const tags = (p.subtitle || "").split(" \u00b7 ").map((x) => x.trim()).filter(Boolean);
    window.CASE15[p.id] = { tags: tags.length ? tags : [p.title], sections: secs };
  });
})();
