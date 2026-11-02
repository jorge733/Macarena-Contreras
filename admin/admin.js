// ---------- Qué se puede editar ----------
// Cada pestaña corresponde a una parte de content.js; los campos se dibujan a partir de esta descripción.
const MD = "Usa **negrita**, deja una línea en blanco para separar párrafos y empieza una línea con «- » para hacer una lista.";
const head = [
  { k: "eyebrow", label: "Etiqueta pequeña" },
  { k: "title", label: "Título" },
];
const TABS = [
  { key: "trabajos", title: "Trabajos", fields: [
    { k: "items", label: "Trabajos", type: "list", noun: "trabajo", name: w => w.name, top: true,
      hint: "Se muestran en este orden. El primero de cada colección es la foto de esa colección en el inicio.",
      blank: () => ({ id: "t" + Date.now().toString(36), name: "Nuevo trabajo", category: content.trabajos.categories[0]?.id || "", availability: "pedido", price: null, imgs: [], desc: "" }),
      fields: [
        { k: "name", label: "Nombre" },
        { k: "category", label: "Colección", type: "select", options: () => content.trabajos.categories.map(c => [c.id, c.name || "(sin nombre)"]) },
        { k: "availability", label: "Disponibilidad", type: "select", options: [
            ["pedido", "A pedido (lo hago cuando me lo encargan)"],
            ["inmediata", "Entrega inmediata (ya está hecho)"]] },
        { k: "price", label: "Precio de referencia (CLP)", type: "price", hint: "Déjalo vacío para mostrar «Precio a consultar»." },
        { k: "imgs", label: "Fotos", type: "gallery", hint: "La primera es la principal. Usa las flechas para ordenarlas." },
        { k: "desc", label: "Descripción", type: "textarea", hint: MD },
      ] },
    { k: "categories", label: "Colecciones", type: "list", noun: "colección", name: c => c.name, row: true,
      hint: "Los trabajos se agrupan en estas colecciones, en este orden. Una colección sin trabajos no aparece.",
      blank: () => ({ id: "c" + Date.now().toString(36), name: "Nueva colección", desc: "" }),
      fields: [{ k: "name", label: "Nombre" }, { k: "desc", label: "Descripción corta" }] },
    ...head,
    { k: "intro", label: "Introducción", type: "textarea", hint: "Usa **negrita** para destacar." },
  ] },
  { key: "telas", title: "Telas", fields: [
    { k: "items", label: "Telas", type: "list", noun: "tela", name: f => f.name, row: true, top: true,
      hint: "Las telas disponibles también se pueden elegir en la ficha de cada trabajo. Una tela agotada se ve en gris y no se puede elegir.",
      blank: () => ({ id: "f" + Date.now().toString(36), name: "Nueva tela", img: "", available: true }),
      fields: [
        { k: "img", label: "Foto de la tela", type: "image", hint: "Una foto de cerca: se muestra en un círculo." },
        { k: "name", label: "Nombre" },
        { k: "available", label: "Disponible", type: "check" },
      ] },
    ...head,
    { k: "intro", label: "Introducción", type: "textarea" },
  ] },
  { key: "general", title: "Datos de contacto", fields: [
    { k: "whatsapp", label: "Número de WhatsApp", hint: "Con el código de país, ej.: 56912345678. Es adonde llegan los botones «Lo quiero» y «Escríbeme»." },
    { k: "instagram", label: "Instagram (sin @)", hint: "Se muestra en Contacto. Déjalo vacío para no mostrarlo." },
    { k: "email", label: "Correo", hint: "Se muestra en Contacto. Déjalo vacío para no mostrarlo." },
    { k: "production", label: "Plazo de los trabajos a pedido", hint: "Se muestra en cada trabajo a pedido, ej.: «A pedido · 5 a 7 días hábiles»." },
  ] },
  { key: "hero", title: "Inicio", fields: [
    { k: "eyebrow", label: "Etiqueta pequeña" },
    { k: "title", label: "Título (primera línea)" },
    { k: "titleEm", label: "Título (segunda línea, en cursiva)" },
    { k: "lead", label: "Texto de bienvenida", type: "textarea" },
    { k: "button", label: "Texto del botón a los trabajos" },
    { k: "image", label: "Foto principal", type: "image" },
  ] },
  { key: "upcycling", title: "Upcycling", fields: [
    { k: "items", label: "Piezas únicas", type: "list", noun: "pieza", name: u => u.name, top: true,
      hint: "Cada pieza es única: cuando la vendas, marca «Vendida» (se ve en gris y sin botón) o elimínala.",
      blank: () => ({ id: "u" + Date.now().toString(36), name: "Nueva pieza", price: null, img: "", desc: "", sold: false }),
      fields: [
        { k: "img", label: "Foto", type: "image" },
        { k: "name", label: "Nombre" },
        { k: "price", label: "Precio (CLP)", type: "price", hint: "Déjalo vacío para mostrar «Precio a consultar»." },
        { k: "desc", label: "Descripción", type: "textarea", rows: 3, hint: MD },
        { k: "sold", label: "Vendida", type: "check" },
      ] },
    ...head,
    { k: "intro", label: "Introducción", type: "textarea", hint: "Usa **negrita** para destacar." },
  ] },
  { key: "comprar", title: "Cómo comprar", fields: [...head,
    { k: "intro", label: "Introducción", type: "textarea" },
    { k: "steps", label: "Pasos", type: "list", noun: "paso", name: s => s.title, row: true,
      hint: "También se muestran en el inicio.",
      blank: () => ({ title: "Nuevo paso", text: "" }),
      fields: [{ k: "title", label: "Título" }, { k: "text", label: "Texto", type: "textarea", rows: 3 }] },
    { k: "facts", label: "Plazo, envío y pago", type: "list", noun: "dato", name: f => f.title, row: true,
      blank: () => ({ title: "", text: "" }),
      fields: [{ k: "title", label: "Título" }, { k: "text", label: "Texto", type: "textarea", rows: 3, hint: MD }] },
    { k: "faq", label: "Preguntas frecuentes", type: "list", noun: "pregunta", name: f => f.q,
      blank: () => ({ q: "", a: "" }),
      fields: [{ k: "q", label: "Pregunta" }, { k: "a", label: "Respuesta", type: "textarea", rows: 3, hint: MD }] },
  ] },
  { key: "sobre", title: "Sobre mí", fields: [...head,
    { k: "text", label: "Texto", type: "textarea", rows: 8, hint: MD },
    { k: "image", label: "Foto", type: "image" },
  ] },
  { key: "contacto", title: "Contacto", fields: [...head,
    { k: "intro", label: "Texto", type: "textarea" },
    { k: "button", label: "Texto del botón de WhatsApp" },
  ] },
];

// ---------- Estado ----------
const $ = s => document.querySelector(s);
let password = "", content = null, baseSha = "", dirty = false, tab = TABS[0].key;
const uploads = {}; // ruta → { sha, preview } de fotos subidas que aún no se guardan

const h = (tag, props = {}, ...kids) => {
  const el = Object.assign(document.createElement(tag), props);
  el.append(...kids.flat().filter(k => k != null && k !== false));
  return el;
};

async function api(action, args = {}) {
  const r = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, password, ...args }) });
  const data = await r.json().catch(() => ({ error: `Error ${r.status} del servidor.` }));
  if (!r.ok) throw Object.assign(new Error(data.error || `Error ${r.status}`), { status: r.status });
  return data;
}

function setStatus(msg, kind = "") { const s = $("#status"); s.textContent = msg; s.className = `status ${kind}`; }
function touch() { dirty = true; $("#save").disabled = false; setStatus("Cambios sin guardar"); }

// ---------- Fotos ----------
// Se guardan en el repositorio (img/) junto con content.js.
const srcOf = path => uploads[path]?.preview || `/${path}`;

// Achica la foto en el navegador (máx. 1600 px, WebP) para que cargue rápido en el sitio.
async function compress(file) {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
  const canvas = h("canvas", { width: Math.round(img.width * scale), height: Math.round(img.height * scale) });
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise(res => canvas.toBlob(res, "image/webp", 0.82));
}

async function upload(file) {
  const blob = await compress(file);
  const data = await new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.readAsDataURL(blob); });
  const { sha } = await api("upload", { data });
  const path = `img/subida-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}.webp`;
  uploads[path] = { sha, preview: URL.createObjectURL(blob) };
  return path;
}

function picker(text, multiple, onPaths) {
  const input = h("input", { type: "file", accept: "image/*", multiple, hidden: true });
  const btn = h("button", { type: "button", className: "pick", textContent: text, onclick: () => input.click() });
  input.onchange = async () => {
    const files = [...input.files];
    if (!files.length) return;
    btn.classList.add("busy"); btn.textContent = "Subiendo…";
    try { onPaths(await Promise.all(files.map(upload))); }
    catch (e) { alert(`No se pudo subir: ${e.message}`); btn.classList.remove("busy"); btn.textContent = text; }
  };
  return [btn, input];
}

// ---------- Campos ----------
function field(f, obj, rerender) {
  const v = obj[f.k];
  const set = val => { obj[f.k] = val; touch(); };
  const hint = f.hint && h("span", { className: "hint", textContent: f.hint });

  switch (f.type) {
    case "textarea":
      return h("label", {}, f.label, h("textarea", { value: v ?? "", rows: f.rows || 4, oninput: e => set(e.target.value) }), hint);
    // Vacío = «Precio a consultar» (se guarda null).
    case "price":
      return h("label", {}, f.label, h("input", { type: "number", min: 0, step: 500, value: v ?? "", placeholder: "A consultar",
        oninput: e => set(e.target.value === "" ? null : Math.max(0, Math.round(Number(e.target.value)) || 0)) }), hint);
    case "check":
      return h("label", { className: "check" }, h("input", { type: "checkbox", checked: !!v, onchange: e => set(e.target.checked) }), f.label);
    case "select": {
      const options = typeof f.options === "function" ? f.options() : f.options;
      // Si el valor ya no existe (ej.: se borró la colección), queda elegida la primera opción, igual que en el sitio.
      const current = options.some(([value]) => value === v) ? v : options[0]?.[0];
      return h("label", {}, f.label, h("select", { onchange: e => set(e.target.value) },
        ...options.map(([value, text]) => h("option", { value, textContent: text, selected: value === current }))), hint);
    }
    case "image":
      return h("div", { className: "list" }, h("span", { className: "list-title", textContent: f.label }), hint,
        h("div", { className: "photos" },
          v ? h("div", { className: "photo" }, h("img", { src: srcOf(v), alt: "" })) : null,
          picker(v ? "Cambiar foto" : "+ Subir foto", false, ([p]) => { set(p); rerender(); })));
    case "gallery": {
      const move = (i, d) => { v.splice(i + d, 0, v.splice(i, 1)[0]); touch(); rerender(); };
      return h("div", { className: "list" }, h("span", { className: "list-title", textContent: f.label }), hint,
        h("div", { className: "photos" },
          v.map((p, i) => h("div", { className: "photo" }, h("img", { src: srcOf(p), alt: `Foto ${i + 1}` }),
            h("div", { className: "tools" },
              h("button", { type: "button", className: "icon", textContent: "←", title: "Mover antes", disabled: i === 0, onclick: () => move(i, -1) }),
              h("button", { type: "button", className: "icon del", textContent: "✕", title: "Quitar", onclick: () => { if (confirm("¿Quitar esta foto?")) { v.splice(i, 1); touch(); rerender(); } } }),
              h("button", { type: "button", className: "icon", textContent: "→", title: "Mover después", disabled: i === v.length - 1, onclick: () => move(i, 1) })))),
          picker("+ Agregar fotos", true, ps => { v.push(...ps); touch(); rerender(); })));
    }
    case "list": {
      const box = h("div", { className: "list" });
      const draw = () => box.replaceChildren(
        h("span", { className: "list-title", textContent: f.label }), hint,
        ...v.map((item, i) => {
          const move = d => { v.splice(i + d, 0, v.splice(i, 1)[0]); touch(); draw(); };
          const title = h("strong", { textContent: f.name(item) || "(sin nombre)" });
          const body = h("div", { className: f.row ? "row" : "list" });
          const drawBody = () => body.replaceChildren(...f.fields.map(sub => field(sub, item, drawBody)));
          drawBody();
          body.addEventListener("input", () => (title.textContent = f.name(item) || "…"));
          return h("div", { className: "item" },
            h("div", { className: "item-head" }, title,
              h("button", { type: "button", className: "icon", textContent: "↑", title: "Subir", disabled: i === 0, onclick: () => move(-1) }),
              h("button", { type: "button", className: "icon", textContent: "↓", title: "Bajar", disabled: i === v.length - 1, onclick: () => move(1) }),
              h("button", { type: "button", className: "icon del", textContent: "✕", title: `Eliminar ${f.noun}`,
                onclick: () => { if (confirm(`¿Eliminar ${f.noun} «${f.name(item) || "sin nombre"}»?`)) { v.splice(i, 1); touch(); draw(); } } })),
            body);
        }),
        h("button", { type: "button", className: "add", textContent: `+ Agregar ${f.noun}`, onclick: () => { f.top ? v.unshift(f.blank()) : v.push(f.blank()); touch(); draw(); } }));
      draw();
      return box;
    }
    default:
      return h("label", {}, f.label, h("input", { value: v ?? "", oninput: e => set(e.target.value) }), hint);
  }
}

function render() {
  $("#tabs").replaceChildren(...TABS.map(t => h("button", { type: "button", role: "tab", textContent: t.title, ariaSelected: String(t.key === tab),
    onclick: () => { tab = t.key; render(); scrollTo(0, 0); } })));
  const t = TABS.find(t => t.key === tab);
  const draw = () => $("#editor").replaceChildren(h("h2", { textContent: t.title }), ...t.fields.map(f => field(f, content[t.key], draw)));
  draw();
}

// ---------- Entrar, guardar, salir ----------
async function open(pw) {
  password = pw;
  const data = await api("load");
  content = data.content; baseSha = data.sha;
  sessionStorage.setItem("adminPw", pw);
  $("#login").hidden = true; $("#app").hidden = false;
  render();
}

$("#login").onsubmit = async e => {
  e.preventDefault();
  const btn = $("#login button"); btn.disabled = true; $("#loginError").textContent = "";
  try { await open(e.target.password.value); }
  catch (err) { $("#loginError").textContent = err.message; }
  btn.disabled = false;
};

$("#save").onclick = async () => {
  const btn = $("#save"); btn.disabled = true; setStatus("Guardando…");
  const json = JSON.stringify(content);
  const images = Object.entries(uploads).filter(([p]) => json.includes(p)).map(([path, u]) => ({ path, sha: u.sha }));
  try {
    const r = await api("save", { content, baseSha, images });
    baseSha = r.sha;
    dirty = false;
    setStatus("Guardado. El sitio se actualiza en 1 o 2 minutos.", "ok");
  } catch (e) { setStatus(e.message, "bad"); btn.disabled = false; }
};

$("#logout").onclick = () => {
  if (dirty && !confirm("Tienes cambios sin guardar. ¿Salir igual?")) return;
  dirty = false; sessionStorage.removeItem("adminPw"); location.reload();
};

addEventListener("beforeunload", e => { if (dirty) e.preventDefault(); });

// Si ya entraste en esta pestaña, no vuelve a pedir la contraseña.
const saved = sessionStorage.getItem("adminPw");
if (saved) open(saved).catch(() => sessionStorage.removeItem("adminPw"));
