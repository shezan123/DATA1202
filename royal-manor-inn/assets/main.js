// ---- Booking engine -------------------------------------------------------
// The inn already uses Cloudbeds. Dates and guests are passed in the URL hash
// so the booking page opens with the search pre-filled.
const CLOUDBEDS_URL = 'https://hotels.cloudbeds.com/reservation/MyKpEl';

function bookingUrl({ checkin, checkout, adults }) {
  const params = new URLSearchParams({ checkin, checkout, adults: String(adults || 2) });
  return `${CLOUDBEDS_URL}#${params.toString()}`;
}

// ---- Helpers --------------------------------------------------------------
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const nightsBetween = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
const pretty = (s) => parse(s).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

const today = iso(new Date());
const forms = [...document.querySelectorAll('[data-booking]')];

// Keep both forms (hero + booking section) in sync
function syncAll(source) {
  const { checkin, checkout, adults } = source.elements;
  forms.forEach((f) => {
    if (f === source) return;
    f.elements.checkin.value = checkin.value;
    f.elements.checkout.value = checkout.value;
    f.elements.adults.value = adults.value;
    updateLimits(f);
    updateSummary(f);
  });
}

function updateLimits(form) {
  const { checkin, checkout } = form.elements;
  checkin.min = today;
  checkout.min = checkin.value ? addDays(checkin.value, 1) : addDays(today, 1);
}

function updateSummary(form) {
  const box = form.querySelector('.stay-summary');
  if (!box) return;
  const { checkin, checkout } = form.elements;
  const ok = checkin.value && checkout.value && checkout.value > checkin.value;
  box.querySelector('[data-nights]').textContent = ok ? nightsBetween(checkin.value, checkout.value) : '-';
  box.querySelector('[data-arrive]').textContent = checkin.value ? pretty(checkin.value) : '-';
  box.querySelector('[data-depart]').textContent = checkout.value ? pretty(checkout.value) : '-';
}

forms.forEach((form) => {
  const { checkin, checkout } = form.elements;
  const msg = form.querySelector('.form-msg');
  updateLimits(form);

  checkin.addEventListener('change', () => {
    if (checkin.value && (!checkout.value || checkout.value <= checkin.value)) {
      checkout.value = addDays(checkin.value, 2); // 2-night default
    }
    updateLimits(form); updateSummary(form); syncAll(form); msg.textContent = '';
  });
  checkout.addEventListener('change', () => { updateSummary(form); syncAll(form); msg.textContent = ''; });
  form.elements.adults.addEventListener('change', () => syncAll(form));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!checkin.value || !checkout.value) { msg.textContent = 'Please choose your check-in and check-out dates.'; return; }
    if (checkin.value < today) { msg.textContent = 'Check-in can’t be in the past.'; return; }
    if (checkout.value <= checkin.value) { msg.textContent = 'Check-out must be after check-in.'; return; }
    msg.textContent = '';
    window.open(bookingUrl({ checkin: checkin.value, checkout: checkout.value, adults: form.elements.adults.value }), '_blank', 'noopener');
  });
});

// Room choice: Cloudbeds shows every room on the next page, so remind the guest which one they picked
const roomSel = document.querySelector('.booking-card select[name=room]');
const roomHint = document.querySelector('.room-hint');
function showRoomHint() {
  roomHint.hidden = !roomSel.value;
  roomHint.textContent = roomSel.value ? `On the next page, choose “${roomSel.value}” from the list of available rooms.` : '';
}
roomSel.addEventListener('change', showRoomHint);

// "Book this room" buttons: preselect room and jump to the booking card
document.querySelectorAll('[data-room]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = document.querySelector('.booking-card');
    card.elements.room.value = btn.dataset.room;
    showRoomHint();
    document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => card.elements.checkin.focus({ preventScroll: true }), 600);
  });
});

// ---- Navigation -----------------------------------------------------------
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
});

// Hide floating mobile "Book" button while the booking section is on screen
const mobileBook = document.querySelector('.mobile-book');
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => mobileBook.classList.toggle('hide', entry.isIntersecting), { threshold: 0.15 })
    .observe(document.getElementById('book'));
}

// ---- Gallery lightbox -----------------------------------------------------
const lb = document.querySelector('.lightbox');
if (lb && typeof lb.showModal === 'function') {
  const lbImg = lb.querySelector('img');
  document.querySelectorAll('.g').forEach((g) => g.addEventListener('click', () => {
    lbImg.src = g.dataset.full; lbImg.alt = g.querySelector('img').alt; lb.showModal();
  }));
  lb.addEventListener('click', (e) => { if (e.target !== lbImg) lb.close(); });
}

// ---- Misc -----------------------------------------------------------------
document.getElementById('year').textContent = new Date().getFullYear();

const revealEls = document.querySelectorAll('.section-head, .story > *, .room, .g, .ex, .faq details, .breakfast-inner > *, .book-inner > *, .contact > *');
revealEls.forEach((el) => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.1 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}
