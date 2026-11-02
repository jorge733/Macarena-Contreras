// ---------- Datos ----------
// Todo el contenido vive en content.js y se edita desde el panel /admin.
const C = window.CONTENT;

// ---------- Utilidades ----------
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clp = n => Number(n).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const get = path => path.split(".").reduce((o, k) => o?.[k], C) ?? "";
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// Formato mínimo para los textos del panel: **negrita**, párrafos separados por una línea en blanco y listas con "- ".
const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
const md = s => String(s ?? "").trim().split(/\n\s*\n/).filter(Boolean).map(b => {
  const lines = b.split("\n").map(l => l.trim()).filter(Boolean);
  const items = lines.filter(l => l.startsWith("- "));
  if (items.length && items.length === lines.length) return `<ul>${items.map(l => `<li>${inline(l.slice(2))}</li>`).join("")}</ul>`;
  return `<p>${lines.map(inline).join("<br>")}</p>`;
}).join("");

// ---------- WhatsApp ----------
// wa.me solo acepta dígitos: si en el panel se escribió «+56 9 …», se limpian los espacios y el «+».
// Mientras no haya número, los botones llevan a Contacto.
const waNumber = String(C.general.whatsapp || "").replace(/\D/g, "");
const waLink = (text = "") => waNumber ? `https://wa.me/${waNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}` : "#contacto";
const setWa = (a, text) => { a.href = waLink(text); if (waNumber) { a.target = "_blank"; a.rel = "noopener"; } else a.removeAttribute("target"); };
$$("a.wa").forEach(a => setWa(a, "Hola Maca! Vi tu página y quería hacerte una consulta."));

// ---------- Textos fijos de cada sección ----------
$$("[data-t]").forEach(el => (el.textContent = get(el.dataset.t)));
$$("[data-md]").forEach(el => (el.innerHTML = inline(get(el.dataset.md))));
$("#heroImg").src = C.hero.image;
$("#aboutImg").src = C.sobre.image;
$("#aboutText").innerHTML = md(C.sobre.text);
$("#year").textContent = new Date().getFullYear();

// ---------- Menú (celular) ----------
const nav = $("#nav"), menuBtn = $("#menuBtn");
const setMenu = open => { nav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", open); menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú"); };
menuBtn.onclick = () => setMenu(!nav.classList.contains("open"));
$("#menu").addEventListener("click", e => e.target.closest("a") && setMenu(false));
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive: true });

// ---------- Trabajos ----------
const cats = C.trabajos.categories?.length ? C.trabajos.categories : [{ id: "", name: "" }];
const catOf = w => cats.some(c => c.id === w.category) ? w.category : cats[0].id;
const items = C.trabajos.items;
const work = id => items.find(w => w.id === id);
const coverOf = w => w.imgs?.[0] || "";
const priceText = w => w.price ? clp(w.price) : "Precio a consultar";
const badge = w => w.availability === "inmediata"
  ? `<span class="badge now">Entrega inmediata</span>`
  : `<span class="badge">A pedido · ${esc(C.general.production)}</span>`;
const wantText = (w, fabric) => `Hola Maca! Me interesa «${w.name}»${fabric ? ` en la tela «${fabric}»` : ""}, que vi en tu página.`;

const card = (w, i) => `
  <a class="card" href="#trabajo/${encodeURIComponent(w.id)}">
    <div class="card-img">${coverOf(w) ? `<img ${i > 3 ? 'loading="lazy" ' : ""}src="${esc(coverOf(w))}" alt="${esc(w.name)}">` : ""}</div>
    <div class="card-body">
      <h3>${esc(w.name)}</h3>
      <p class="price">${priceText(w)}</p>
      ${badge(w)}
    </div>
  </a>`;

// Colecciones en el inicio: la foto del primer trabajo de cada una. Las colecciones vacías no aparecen.
const groups = cats.map(c => ({ ...c, items: items.filter(w => catOf(w) === c.id) })).filter(g => g.items.length);
$("#collections").innerHTML = groups.map(g => `
  <a class="collection" href="#trabajos/${encodeURIComponent(g.id)}">
    <div class="card-img">${coverOf(g.items[0]) ? `<img loading="lazy" src="${esc(coverOf(g.items[0]))}" alt="">` : ""}</div>
    <h3>${esc(g.name)}</h3>
    <p class="muted">${esc(g.desc)}</p>
    <span class="link">Ver ${g.items.length} ${g.items.length === 1 ? "trabajo" : "trabajos"} →</span>
  </a>`).join("");

// Filtro por colección: vive en la URL (#trabajos/lectores) para que se pueda compartir.
function renderWorks(filter) {
  const shown = filter ? items.filter(w => catOf(w) === filter) : items;
  $("#chips").innerHTML = groups.length > 1 ? [{ id: "", name: "Todos" }, ...groups].map(g => `
    <a class="chip" href="#trabajos${g.id ? "/" + encodeURIComponent(g.id) : ""}"${g.id === filter ? ' aria-current="true"' : ""}>${esc(g.name)}</a>`).join("") : "";
  $("#works").innerHTML = shown.length ? shown.map(card).join("") : `<p class="muted">Pronto subiré trabajos aquí.</p>`;
}

// ---------- Ficha de un trabajo ----------
const fabrics = C.telas.items;
function renderWork(w) {
  const n = w.imgs.length, avail = fabrics.filter(f => f.available && f.img);
  $("#workView").innerHTML = `
  <article class="work" data-id="${esc(w.id)}">
    <div class="gallery">
      <figure class="viewer">${n ? `<img src="${esc(w.imgs[0])}" alt="${esc(w.name)}">` : ""}
        ${n > 1 ? `<button type="button" class="arrow prev" data-step="-1" aria-label="Foto anterior">‹</button>
        <button type="button" class="arrow next" data-step="1" aria-label="Foto siguiente">›</button>` : ""}
      </figure>
      ${n > 1 ? `<div class="thumbs">${w.imgs.map((src, i) => `<button type="button" data-i="${i}" aria-label="Ver foto ${i + 1} de ${n}"${i ? "" : ' aria-current="true"'}><img loading="lazy" src="${esc(src)}" alt=""></button>`).join("")}</div>` : ""}
    </div>
    <div class="info">
      <p class="eyebrow">${esc(cats.find(c => c.id === catOf(w))?.name)}</p>
      <h1>${esc(w.name)}</h1>
      <p class="price">${priceText(w)}${w.price ? ` <span class="small muted">precio de referencia</span>` : ""}</p>
      ${badge(w)}
      ${String(w.desc || "").trim() ? `<div class="prose">${md(w.desc)}</div>` : ""}
      ${avail.length ? `<fieldset class="pick-fabric"><legend>¿En qué tela lo quieres? <span class="muted">(opcional)</span></legend>
        ${avail.map(f => `<label title="${esc(f.name)}"><input type="radio" name="fabric" value="${esc(f.name)}"><img src="${esc(f.img)}" alt=""><span>${esc(f.name)}</span></label>`).join("")}
      </fieldset>` : ""}
      <a class="btn full wa-want">Lo quiero</a>
      <p class="small muted">Te abre WhatsApp con el mensaje listo. Ahí te confirmo precio y plazo.</p>
    </div>
  </article>`;
  setWa($(".wa-want"), wantText(w));
}
const wv = $("#workView");
// Elegir una tela cambia el mensaje de WhatsApp; volver a tocarla la quita.
wv.addEventListener("click", e => {
  const r = e.target.closest(".pick-fabric input");
  if (r && r.dataset.was === "1") { r.checked = false; }
  $$(".pick-fabric input", wv).forEach(x => (x.dataset.was = x.checked ? "1" : ""));
  if (r) setWa($(".wa-want", wv), wantText(work($(".work").dataset.id), $(".pick-fabric input:checked", wv)?.value));
  const t = e.target.closest(".thumbs [data-i]"), s = e.target.closest("[data-step]");
  if (t) showPhoto(Number(t.dataset.i));
  if (s) showPhoto(Number($(".work").dataset.i || 0) + Number(s.dataset.step));
});
function showPhoto(i) {
  const el = $(".work"), w = work(el.dataset.id), n = w.imgs.length;
  i = (i + n) % n; el.dataset.i = i;
  const img = $(".viewer img", el);
  img.src = w.imgs[i];
  if (!calm) img.animate([{ opacity: .2, transform: "scale(1.03)" }, { opacity: 1, transform: "none" }], { duration: 400, easing: "ease-out" });
  $$(".thumbs button", el).forEach((b, j) => j === i ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current"));
}
let touchX = null;
wv.addEventListener("touchstart", e => { if (e.target.closest(".viewer")) touchX = e.touches[0].clientX; }, { passive: true });
wv.addEventListener("touchend", e => {
  if (touchX == null || !$(".work .thumbs")) return;
  const dx = e.changedTouches[0].clientX - touchX; touchX = null;
  if (Math.abs(dx) > 40) showPhoto(Number($(".work").dataset.i || 0) + (dx < 0 ? 1 : -1));
});

// ---------- Telas ----------
$("#fabrics").innerHTML = fabrics.length ? fabrics.map(f => `
  <div class="fabric${f.available ? "" : " out"}">
    <div class="swatch">${f.img ? `<img loading="lazy" src="${esc(f.img)}" alt="Tela ${esc(f.name)}">` : ""}${f.available ? "" : `<span class="badge">Agotada</span>`}</div>
    <h3>${esc(f.name)}</h3>
    ${f.available ? `<a class="link wa-fabric" data-name="${esc(f.name)}">Consultar por esta tela →</a>` : ""}
  </div>`).join("") : `<p class="muted">Pronto subiré las telas disponibles.</p>`;
$$(".wa-fabric").forEach(a => setWa(a, `Hola Maca! Me gusta la tela «${a.dataset.name}». ¿Qué me puedes hacer con ella?`));

// ---------- Upcycling ----------
// Piezas únicas hechas con tela de prendas rescatadas: una foto, precio y un «Lo quiero»; las vendidas quedan en gris.
const upItems = C.upcycling?.items || [];
$("#upcyclingItems").innerHTML = upItems.length ? upItems.map((u, i) => `
  <div class="card up${u.sold ? " out" : ""}">
    <div class="card-img">${u.img ? `<img ${i > 3 ? 'loading="lazy" ' : ""}src="${esc(u.img)}" alt="${esc(u.name)}">` : ""}</div>
    <div class="card-body">
      <h3>${esc(u.name)}</h3>
      <p class="price">${priceText(u)}</p>
      ${u.sold ? `<span class="badge">Vendida</span>` : `<span class="badge now">Pieza única</span>`}
      ${String(u.desc || "").trim() ? `<div class="prose small muted">${md(u.desc)}</div>` : ""}
      ${u.sold ? "" : `<a class="link wa-up" data-name="${esc(u.name)}">Lo quiero →</a>`}
    </div>
  </div>`).join("") : `<p class="muted">Pronto subiré piezas únicas aquí.</p>`;
$$(".wa-up").forEach(a => setWa(a, `Hola Maca! Me interesa la pieza upcycling «${a.dataset.name}», que vi en tu página. ¿Todavía está disponible?`));

// ---------- Cómo comprar ----------
const stepsHtml = C.comprar.steps.map((s, i) => `<li><span>${i + 1}</span><h3>${esc(s.title)}</h3><p>${inline(s.text)}</p></li>`).join("");
$("#steps").innerHTML = stepsHtml;
$("#homeSteps").innerHTML = stepsHtml;
$("#facts").innerHTML = C.comprar.facts.map(f => `<div class="fact"><h3>${esc(f.title)}</h3>${md(f.text)}</div>`).join("");
$("#faq").innerHTML = C.comprar.faq.map(f => `<details><summary>${esc(f.q)}</summary>${md(f.a)}</details>`).join("");

// ---------- Contacto ----------
const ig = String(C.general.instagram || "").replace(/^@/, "").trim();
$("#contactList").innerHTML = [
  waNumber && `<li><span>WhatsApp</span><a href="${waLink()}" target="_blank" rel="noopener">+${esc(waNumber.replace(/^(56)(9)(\d{4})(\d{4})$/, "$1 $2 $3 $4"))}</a></li>`,
  ig && `<li><span>Instagram</span><a href="https://www.instagram.com/${encodeURIComponent(ig)}/" target="_blank" rel="noopener">@${esc(ig)}</a></li>`,
  C.general.email && `<li><span>Correo</span><a href="mailto:${esc(C.general.email)}">${esc(C.general.email)}</a></li>`,
].filter(Boolean).join("");
// Sin número, el botón flotante no tiene adónde llevar.
$(".wa-float").hidden = !waNumber;

// ---------- Animaciones ----------
// Los bloques aparecen suavemente al entrar en pantalla; los que entran juntos (tarjetas, pasos, telas…) van en cascada.
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const seen = !calm && "IntersectionObserver" in window && new IntersectionObserver(es => es.filter(e => e.isIntersecting).forEach((e, i) => {
  e.target.style.setProperty("--d", `${Math.min(i, 8) * 80}ms`);
  e.target.classList.add("in");
  seen.unobserve(e.target);
}), { rootMargin: "0px 0px -6% 0px" });
const revealSel = ".block-head, .collection, .steps li, .card, .fabric, .fact, .faq-title, .faq details, .about > *, .contact-list li, .chips, .center, .gallery, .info";
const reveal = root => seen && $$(revealSel, root).filter(el => !("reveal" in el.dataset)).forEach(el => { el.dataset.reveal = ""; seen.observe(el); });

// ---------- Secciones: una a la vez, según el #ancla de la URL ----------
// La ficha de cada trabajo vive en #trabajo/<id> y el filtro en #trabajos/<colección>; en el menú queda marcado «Trabajos».
const sections = $$("#main > section");
const baseTitle = document.title;
function route() {
  const [id, sub = ""] = location.hash.slice(1).split("/");
  const key = decodeURIComponent(sub);
  const w = id === "trabajo" && work(key);
  if (id === "trabajo" && !w) return history.replaceState(null, "", "#trabajos"), route();
  const page = sections.find(s => s.id === id) || sections[0];
  if (w) renderWork(w);
  if (page.id === "trabajos") renderWorks(groups.some(g => g.id === key) ? key : "");
  const menuId = w ? "trabajos" : page.id;
  sections.forEach(s => (s.hidden = s !== page));
  $$("#menu a").forEach(a => {
    const on = a.hash === "#" + menuId;
    a.classList.toggle("active", on);
    on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
  });
  document.title = page === sections[0] ? baseTitle : `${w ? w.name : page.dataset.title || $(`#menu a[href="#${page.id}"]`).textContent} · Es de Tela`;
  // Cambiar de filtro no salta arriba: la persona sigue viendo los botones.
  if (!(page.id === "trabajos" && document.body.dataset.page === "trabajos")) {
    scrollTo({ top: 0, behavior: "instant" });
    if (!calm) page.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, easing: "ease-out" });
  }
  reveal(page);
  document.body.dataset.page = page.id;
}
addEventListener("hashchange", route);
route();
