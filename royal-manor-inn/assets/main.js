// Motion inspired by hotelparticulier.com: opening curtain, masked headline rise,
// scroll-scrubbed image zoom, rotating emblem, hover-to-reveal room list,
// draggable gallery with inertia and a custom cursor, full-screen menu.
// Plain JS, no libraries.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Curtain / page ready ---------- */
function ready() {
  document.body.classList.add('is-ready');
  setTimeout(() => document.body.classList.remove('is-loading'), reduceMotion ? 0 : 900);
}
if (reduceMotion) ready();
else window.addEventListener('load', () => setTimeout(ready, 900));
setTimeout(ready, 3500); // never block the page if an image is slow

/* ---------- Header: solid after hero, hide on scroll down ---------- */
const header = $('.site-header');
let lastY = 0;
function onScrollHeader() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > window.innerHeight * 0.75);
  header.classList.toggle('hidden', y > lastY && y > window.innerHeight && !document.body.classList.contains('menu-open'));
  lastY = y;
}

/* ---------- Full-screen menu ---------- */
const menuBtn = $('.menu-btn');
const menu = $('#menu');
const menuImgs = $$('[data-menu-img]');
function showMenuImg(key) { menuImgs.forEach((i) => i.classList.toggle('is-visible', i.dataset.menuImg === key)); }
function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-hidden', String(!open));
  $('.menu-label').textContent = open ? 'Close' : 'Menu';
  if (open) showMenuImg('rooms');
}
menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
$$('.menu-nav a').forEach((a) => {
  a.addEventListener('mouseenter', () => showMenuImg(a.dataset.menu));
  a.addEventListener('focus', () => showMenuImg(a.dataset.menu));
  a.addEventListener('click', () => setMenu(false));
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* ---------- Scroll reveal (staggered) ---------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) : null;

// stagger siblings that reveal together
$$('.reveal').forEach((el) => {
  const sibs = $$(':scope > .reveal', el.parentElement);
  el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 6) * 0.1}s`);
  io ? io.observe(el) : el.classList.add('in');
});

/* ---------- Scroll-scrubbed effects (zoom + emblem rotation), smoothed ---------- */
const zooms = $$('.zoom').map((el) => ({ el, img: $('img', el), cur: 1 }));
const ring = $('[data-rotate]');
let ringCur = 0;
const lerp = (a, b, t) => a + (b - a) * t;

function tick() {
  const vh = window.innerHeight;
  zooms.forEach((z) => {
    const r = z.el.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) return;
    // progress 0 when entering at bottom, 1 when leaving at top
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    const target = 1 + 0.12 * p;
    z.cur = lerp(z.cur, target, 0.08);
    z.img.style.setProperty('--z', z.cur.toFixed(4));
  });
  if (ring) {
    const r = ring.getBoundingClientRect();
    const target = ((vh - r.top) / (vh + r.height)) * 290;
    ringCur = lerp(ringCur, target, 0.08);
    ring.style.transform = `rotate(${ringCur.toFixed(2)}deg)`;
  }
  requestAnimationFrame(tick);
}
if (!reduceMotion) requestAnimationFrame(tick);

/* ---------- Rooms: hover list swaps the background ---------- */
const ROOMS = {
  'The Clarence': { meta: 'Suite · King bed · Garden & Fort George views', text: 'A historic haven of opulent comfort, with a 180° view of the garden and Fort George. Perfect for celebrating special moments.' },
  'The Windsor': { meta: 'Ground floor · Queen bed · Open-concept shower', text: 'Bathed in deep purple, a regal retreat that blends tradition and modernity, with a unique open-concept shower.' },
  'The York': { meta: '220 sq ft · Queen bed · Niagara River view', text: 'Our most spacious queen room, painted sage green and facing the Niagara River, Fort George and the Pumphouse Art Gallery.' },
  'The Kent': { meta: '180 sq ft · Queen bed · Reading nook', text: 'A cozy blue sanctuary with a reading nook and a large bathroom under cathedral ceilings, overlooking the neighbouring park.' },
  'The Sussex': { meta: '200 sq ft · Queen bed · Morning sun', text: 'Painted in soft yellows and lit by the morning sun, overlooking two ancient willows and the Niagara River.' },
  'The Cornwall': { meta: '190 sq ft · Queen bed · Forest view', text: 'Wrapped in calming taupe, with a bright, spacious bathroom under cathedral ceilings and a view of the forest bordering Fort George.' },
};
const suites = $('.suites');
const bgs = $$('.suites-bg');
const detail = $('.suites-detail');
const sdMeta = $('[data-sd="meta"]');
const sdText = $('[data-sd="text"]');
const sdBook = $('[data-sd="book"]');
let activeRoom = null;
let swapTimer;

function activateRoom(name) {
  if (activeRoom === name) return;
  activeRoom = name;
  $$('.suites-list button').forEach((b) => b.classList.toggle('is-active', b.dataset.room === name));
  bgs.forEach((bg) => bg.classList.toggle('is-visible', bg.dataset.bg === name));
  detail.classList.add('swap');
  clearTimeout(swapTimer);
  swapTimer = setTimeout(() => {
    sdMeta.textContent = ROOMS[name].meta;
    sdText.textContent = ROOMS[name].text;
    sdBook.hidden = false;
    sdBook.dataset.room = name;
    detail.classList.remove('swap');
  }, 260);
}
$$('.suites-list button').forEach((b, i) => {
  b.classList.add('reveal-item');
  b.style.transitionDelay = `${0.1 + i * 0.08}s`;
  if (finePointer) b.addEventListener('mouseenter', () => activateRoom(b.dataset.room));
  b.addEventListener('focus', () => activateRoom(b.dataset.room));
  b.addEventListener('click', () => activateRoom(b.dataset.room));
});
if (io) {
  const sio = new IntersectionObserver(([en]) => { if (en.isIntersecting) { suites.classList.add('in'); sio.disconnect(); } }, { threshold: 0.3 });
  sio.observe(suites);
} else suites.classList.add('in');

/* ---------- Draggable gallery with inertia + auto drift ---------- */
(() => {
  const vp = $('.dg-viewport');
  const track = $('.dg-track');
  const cursor = $('.drag-cursor');
  if (!vp) return;
  let x = 0, v = 0, dir = -1, dragging = false, startX = 0, startPos = 0, lastX = 0, lastT = 0, hovering = false;
  const bounds = () => Math.min(0, vp.clientWidth - track.scrollWidth);

  vp.addEventListener('pointerdown', (e) => {
    dragging = true; startX = lastX = e.clientX; startPos = x; v = 0; lastT = performance.now();
    vp.setPointerCapture(e.pointerId); cursor.classList.add('is-down');
  });
  vp.addEventListener('pointermove', (e) => {
    if (finePointer) { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; }
    if (!dragging) return;
    const now = performance.now();
    x = startPos + (e.clientX - startX);
    v = (e.clientX - lastX) / Math.max(1, now - lastT) * 16;
    lastX = e.clientX; lastT = now;
  });
  const release = () => { dragging = false; cursor.classList.remove('is-down'); };
  vp.addEventListener('pointerup', release);
  vp.addEventListener('pointercancel', release);
  if (finePointer) {
    vp.addEventListener('pointerenter', (e) => { hovering = true; cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; cursor.classList.add('is-visible'); });
    vp.addEventListener('pointerleave', () => { hovering = false; cursor.classList.remove('is-visible'); release(); });
  } else {
    vp.style.cursor = 'grab';
  }

  function loop() {
    const min = bounds();
    if (!dragging) {
      x += v; v *= 0.94;                                   // inertia
      if (!hovering && Math.abs(v) < 0.2 && !reduceMotion) x += 0.35 * dir; // slow auto drift
      if (x <= min) { x = lerp(x, min, 0.12); v = 0; dir = 1; }   // bounce back at the ends
      if (x >= 0) { x = lerp(x, 0, 0.15); v = 0; dir = -1; }
    }
    track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* ---------- Booking (Cloudbeds) ---------- */
const CLOUDBEDS_URL = 'https://hotels.cloudbeds.com/reservation/MyKpEl';
const bookingUrl = ({ checkin, checkout, adults }) =>
  `${CLOUDBEDS_URL}#${new URLSearchParams({ checkin, checkout, adults: String(adults || 2) })}`;

const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const nightsBetween = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
const pretty = (s) => parse(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const today = iso(new Date());
const forms = $$('[data-booking]');

function updateLimits(f) {
  f.elements.checkin.min = today;
  f.elements.checkout.min = f.elements.checkin.value ? addDays(f.elements.checkin.value, 1) : addDays(today, 1);
}
function updateSummary(f) {
  const box = $('.stay-summary', f);
  if (!box) return;
  const { checkin: ci, checkout: co } = f.elements;
  const ok = ci.value && co.value && co.value > ci.value;
  $('[data-nights]', box).textContent = ok ? nightsBetween(ci.value, co.value) : '-';
  $('[data-arrive]', box).textContent = ci.value ? pretty(ci.value) : '-';
  $('[data-depart]', box).textContent = co.value ? pretty(co.value) : '-';
}
function syncAll(src) {
  forms.forEach((f) => {
    if (f === src) return;
    ['checkin', 'checkout', 'adults'].forEach((n) => { f.elements[n].value = src.elements[n].value; });
    updateLimits(f); updateSummary(f);
  });
}

forms.forEach((form) => {
  const { checkin, checkout } = form.elements;
  const msg = $('.form-msg', form);
  updateLimits(form);
  checkin.addEventListener('change', () => {
    if (checkin.value && (!checkout.value || checkout.value <= checkin.value)) checkout.value = addDays(checkin.value, 2);
    updateLimits(form); updateSummary(form); syncAll(form); msg.textContent = '';
  });
  checkout.addEventListener('change', () => { updateSummary(form); syncAll(form); msg.textContent = ''; });
  form.elements.adults.addEventListener('change', () => syncAll(form));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!checkin.value || !checkout.value) { msg.textContent = 'Please choose your arrival and departure dates.'; return; }
    if (checkin.value < today) { msg.textContent = 'Arrival can’t be in the past.'; return; }
    if (checkout.value <= checkin.value) { msg.textContent = 'Departure must be after arrival.'; return; }
    msg.textContent = '';
    window.open(bookingUrl({ checkin: checkin.value, checkout: checkout.value, adults: form.elements.adults.value }), '_blank', 'noopener');
  });
});

// Room choice → reminder (Cloudbeds lists every room on the next page)
const card = $('.booking-card');
const roomHint = $('.room-hint');
function showRoomHint() {
  const r = card.elements.room.value;
  roomHint.hidden = !r;
  roomHint.textContent = r ? `On the next page, choose “${r}” from the available rooms.` : '';
}
card.elements.room.addEventListener('change', showRoomHint);
sdBook.addEventListener('click', () => {
  card.elements.room.value = sdBook.dataset.room;
  showRoomHint();
  $('#book').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  setTimeout(() => card.elements.checkin.focus({ preventScroll: true }), 900);
});

/* ---------- Misc ---------- */
$('#year').textContent = new Date().getFullYear();
const mobileBook = $('.mobile-book');
let bookVisible = false;
const updateMobileBook = () => mobileBook.classList.toggle('hide', bookVisible || window.scrollY < window.innerHeight * 0.6);
if (io) new IntersectionObserver(([en]) => { bookVisible = en.isIntersecting; updateMobileBook(); }, { threshold: 0, rootMargin: '0px 0px -10% 0px' }).observe($('#book'));
window.addEventListener('scroll', () => { onScrollHeader(); updateMobileBook(); }, { passive: true });
onScrollHeader();
updateMobileBook();

/* ---------- Neighbourhood pop-outs ----------
   One shared <dialog>; content is read from the hidden .ex-detail in each card
   (so it stays in the HTML for search engines). Bottom sheet on phones. */
(() => {
  const modal = $('.ex-modal');
  const cards = $$('.ex-card');
  if (!cards.length) return;
  if (!modal || typeof modal.showModal !== 'function') {
    // No <dialog> support: show the details inline instead
    $$('.ex-detail').forEach((d) => { d.hidden = false; });
    return;
  }
  const body = $('.exm-body', modal);
  const title = $('#exm-title');
  const num = $('.exm-n', modal);
  const dist = $('.exm-dist', modal);
  const count = $('.exm-count', modal);
  const map = $('.exm-map', modal);
  const sheet = $('.exm-sheet', modal);
  let index = 0;
  let opener = null;

  function render(i, dir = 0) {
    index = (i + cards.length) % cards.length;
    const card = cards[index];
    const detail = card.parentElement.querySelector('.ex-detail');
    title.textContent = $('h3', card).textContent;
    num.textContent = $('.n', card).textContent;
    dist.textContent = $('b', card).textContent;
    body.replaceChildren(...[...detail.children].filter((el) => !el.matches('.exd-map')).map((el) => el.cloneNode(true)));
    map.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent($('.exd-map', detail).dataset.q)}`;
    count.textContent = `${index + 1} / ${cards.length}`;
    if (dir) {
      body.style.setProperty('--dir', `${dir * 16}px`);
      body.classList.toggle('swap', false); void body.offsetWidth; body.classList.add('swap');
    }
    sheet.scrollTop = 0;
  }

  function open(i, from) {
    opener = from;
    render(i);
    document.documentElement.classList.add('modal-open');
    modal.showModal();
  }
  function finish() {
    modal.classList.toggle('closing', false);
    if (modal.open) modal.close();
  }
  function close() {
    if (!modal.open || modal.classList.contains('closing')) return;
    if (reduceMotion) { finish(); return; }
    modal.classList.add('closing');
    setTimeout(finish, 280);
  }
  modal.addEventListener('close', () => {
    document.documentElement.classList.toggle('modal-open', false);
    if (opener) opener.focus({ preventScroll: true });
  });

  cards.forEach((c, i) => c.addEventListener('click', () => open(i, c)));
  $('.exm-close', modal).addEventListener('click', close);
  $('.exm-prev', modal).addEventListener('click', () => render(index - 1, -1));
  $('.exm-next', modal).addEventListener('click', () => render(index + 1, 1));
  $('.exm-book', modal).addEventListener('click', () => { opener = null; finish(); });
  modal.addEventListener('cancel', (e) => { e.preventDefault(); close(); });       // Esc animates out
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });  // backdrop click
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') render(index + 1, 1);
    if (e.key === 'ArrowLeft') render(index - 1, -1);
  });

  // Swipe down on the sheet to close (phones), only when scrolled to the top
  let y0 = null;
  sheet.addEventListener('touchstart', (e) => { y0 = sheet.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
  sheet.addEventListener('touchmove', (e) => {
    if (y0 === null) return;
    const dy = e.touches[0].clientY - y0;
    if (dy > 0) sheet.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  sheet.addEventListener('touchend', (e) => {
    if (y0 === null) return;
    const dy = e.changedTouches[0].clientY - y0;
    sheet.style.transform = '';
    if (dy > 90) close();
    y0 = null;
  });
})();
