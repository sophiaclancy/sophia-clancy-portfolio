var __TWEAKS_STYLE=`
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;function useTweaks(o){const[e,n]=React.useState(o),a=React.useCallback((t,s)=>{const r=typeof t=="object"&&t!==null?t:{[t]:s};n(l=>({...l,...r})),window.parent.postMessage({type:"__edit_mode_set_keys",edits:r},"*"),window.dispatchEvent(new CustomEvent("tweakchange",{detail:r}))},[]);return[e,a]}function TweaksPanel({title:o="Tweaks",children:e}){const[n,a]=React.useState(!1),t=React.useRef(null),s=React.useRef({x:16,y:16}),r=16,l=React.useCallback(()=>{const i=t.current;if(!i)return;const w=i.offsetWidth,d=i.offsetHeight,b=Math.max(r,window.innerWidth-w-r),g=Math.max(r,window.innerHeight-d-r);s.current={x:Math.min(b,Math.max(r,s.current.x)),y:Math.min(g,Math.max(r,s.current.y))},i.style.right=s.current.x+"px",i.style.bottom=s.current.y+"px"},[]);React.useEffect(()=>{if(!n)return;if(l(),typeof ResizeObserver=="undefined")return window.addEventListener("resize",l),()=>window.removeEventListener("resize",l);const i=new ResizeObserver(l);return i.observe(document.documentElement),()=>i.disconnect()},[n,l]),React.useEffect(()=>{const i=w=>{var d;const b=(d=w==null?void 0:w.data)==null?void 0:d.type;b==="__activate_edit_mode"?a(!0):b==="__deactivate_edit_mode"&&a(!1)};return window.addEventListener("message",i),window.parent.postMessage({type:"__edit_mode_available"},"*"),()=>window.removeEventListener("message",i)},[]);const u=()=>{a(!1),window.parent.postMessage({type:"__edit_mode_dismissed"},"*")},x=i=>{const w=t.current;if(!w)return;const d=w.getBoundingClientRect(),b=i.clientX,g=i.clientY,f=window.innerWidth-d.right,k=window.innerHeight-d.bottom,c=m=>{s.current={x:f-(m.clientX-b),y:k-(m.clientY-g)},l()},p=()=>{window.removeEventListener("mousemove",c),window.removeEventListener("mouseup",p)};window.addEventListener("mousemove",c),window.addEventListener("mouseup",p)};return React.useEffect(()=>(document.documentElement.setAttribute("data-om-starter","tweaks-panel"),()=>document.documentElement.removeAttribute("data-om-starter")),[]),n?React.createElement(React.Fragment,null,React.createElement("style",null,__TWEAKS_STYLE),React.createElement("div",{ref:t,className:"twk-panel","data-omelette-chrome":"",style:{right:s.current.x,bottom:s.current.y}},React.createElement("div",{className:"twk-hd",onMouseDown:x},React.createElement("b",null,o),React.createElement("button",{className:"twk-x","aria-label":"Close tweaks",onMouseDown:i=>i.stopPropagation(),onClick:u},"✕")),React.createElement("div",{className:"twk-body"},e))):null}function TweakSection({label:o,children:e}){return React.createElement(React.Fragment,null,React.createElement("div",{className:"twk-sect"},o),e)}function TweakRow({label:o,value:e,children:n,inline:a=!1}){return React.createElement("div",{className:a?"twk-row twk-row-h":"twk-row"},React.createElement("div",{className:"twk-lbl"},React.createElement("span",null,o),e!=null&&React.createElement("span",{className:"twk-val"},e)),n)}function TweakSlider({label:o,value:e,min:n=0,max:a=100,step:t=1,unit:s="",onChange:r}){return React.createElement(TweakRow,{label:o,value:`${e}${s}`},React.createElement("input",{type:"range",className:"twk-slider",min:n,max:a,step:t,value:e,onChange:l=>r(Number(l.target.value))}))}function TweakToggle({label:o,value:e,onChange:n}){return React.createElement("div",{className:"twk-row twk-row-h"},React.createElement("div",{className:"twk-lbl"},React.createElement("span",null,o)),React.createElement("button",{type:"button",className:"twk-toggle","data-on":e?"1":"0",role:"switch","aria-checked":!!e,onClick:()=>n(!e)},React.createElement("i",null)))}function TweakRadio({label:o,value:e,options:n,onChange:a}){var t;const s=React.useRef(null),[r,l]=React.useState(!1),u=React.useRef(e);u.current=e;const x=c=>String(typeof c=="object"?c.label:c).length;if(!(n.reduce((c,p)=>Math.max(c,x(p)),0)<=((t={2:16,3:10}[n.length])!=null?t:0))){const c=p=>{const m=n.find(h=>String(typeof h=="object"?h.value:h)===p);return m===void 0?p:typeof m=="object"?m.value:m};return React.createElement(TweakSelect,{label:o,value:e,options:n,onChange:p=>a(c(p))})}const d=n.map(c=>typeof c=="object"?c:{value:c,label:c}),b=Math.max(0,d.findIndex(c=>c.value===e)),g=d.length,f=c=>{const p=s.current.getBoundingClientRect(),m=p.width-4,h=Math.floor((c-p.left-2)/m*g);return d[Math.max(0,Math.min(g-1,h))].value},k=c=>{l(!0);const p=f(c.clientX);p!==u.current&&a(p);const m=R=>{if(!s.current)return;const v=f(R.clientX);v!==u.current&&a(v)},h=()=>{l(!1),window.removeEventListener("pointermove",m),window.removeEventListener("pointerup",h)};window.addEventListener("pointermove",m),window.addEventListener("pointerup",h)};return React.createElement(TweakRow,{label:o},React.createElement("div",{ref:s,role:"radiogroup",onPointerDown:k,className:r?"twk-seg dragging":"twk-seg"},React.createElement("div",{className:"twk-seg-thumb",style:{left:`calc(2px + ${b} * (100% - 4px) / ${g})`,width:`calc((100% - 4px) / ${g})`}}),d.map(c=>React.createElement("button",{key:c.value,type:"button",role:"radio","aria-checked":c.value===e},c.label))))}function TweakSelect({label:o,value:e,options:n,onChange:a}){return React.createElement(TweakRow,{label:o},React.createElement("select",{className:"twk-field",value:e,onChange:t=>a(t.target.value)},n.map(t=>{const s=typeof t=="object"?t.value:t,r=typeof t=="object"?t.label:t;return React.createElement("option",{key:s,value:s},r)})))}function TweakText({label:o,value:e,placeholder:n,onChange:a}){return React.createElement(TweakRow,{label:o},React.createElement("input",{className:"twk-field",type:"text",value:e,placeholder:n,onChange:t=>a(t.target.value)}))}function TweakNumber({label:o,value:e,min:n,max:a,step:t=1,unit:s="",onChange:r}){const l=i=>n!=null&&i<n?n:a!=null&&i>a?a:i,u=React.useRef({x:0,val:0}),x=i=>{i.preventDefault(),u.current={x:i.clientX,val:e};const w=(String(t).split(".")[1]||"").length,d=g=>{const f=g.clientX-u.current.x,k=u.current.val+f*t,c=Math.round(k/t)*t;r(l(Number(c.toFixed(w))))},b=()=>{window.removeEventListener("pointermove",d),window.removeEventListener("pointerup",b)};window.addEventListener("pointermove",d),window.addEventListener("pointerup",b)};return React.createElement("div",{className:"twk-num"},React.createElement("span",{className:"twk-num-lbl",onPointerDown:x},o),React.createElement("input",{type:"number",value:e,min:n,max:a,step:t,onChange:i=>r(l(Number(i.target.value)))}),s&&React.createElement("span",{className:"twk-num-unit"},s))}function __twkIsLight(o){const e=String(o).replace("#",""),n=e.length===3?e.replace(/./g,l=>l+l):e.padEnd(6,"0"),a=parseInt(n.slice(0,6),16);if(Number.isNaN(a))return!0;const t=a>>16&255,s=a>>8&255,r=a&255;return t*299+s*587+r*114>148e3}var __TwkCheck=({light:o})=>React.createElement("svg",{viewBox:"0 0 14 14","aria-hidden":"true"},React.createElement("path",{d:"M3 7.2 5.8 10 11 4.2",fill:"none",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",stroke:o?"rgba(0,0,0,.78)":"#fff"}));function TweakColor({label:o,value:e,options:n,onChange:a}){if(!n||!n.length)return React.createElement("div",{className:"twk-row twk-row-h"},React.createElement("div",{className:"twk-lbl"},React.createElement("span",null,o)),React.createElement("input",{type:"color",className:"twk-swatch",value:e,onChange:r=>a(r.target.value)}));const t=r=>String(JSON.stringify(r)).toLowerCase(),s=t(e);return React.createElement(TweakRow,{label:o},React.createElement("div",{className:"twk-chips",role:"radiogroup"},n.map((r,l)=>{const u=Array.isArray(r)?r:[r],[x,...i]=u,w=i.slice(0,4),d=t(r)===s;return React.createElement("button",{key:l,type:"button",className:"twk-chip",role:"radio","aria-checked":d,"data-on":d?"1":"0","aria-label":u.join(", "),title:u.join(" · "),style:{background:x},onClick:()=>a(r)},w.length>0&&React.createElement("span",null,w.map((b,g)=>React.createElement("i",{key:g,style:{background:b}}))),d&&React.createElement(__TwkCheck,{light:__twkIsLight(x)}))})))}function TweakButton({label:o,onClick:e,secondary:n=!1}){return React.createElement("button",{type:"button",className:n?"twk-btn secondary":"twk-btn",onClick:e},o)}Object.assign(window,{useTweaks,TweaksPanel,TweakSection,TweakRow,TweakSlider,TweakToggle,TweakRadio,TweakSelect,TweakText,TweakNumber,TweakColor,TweakButton});
