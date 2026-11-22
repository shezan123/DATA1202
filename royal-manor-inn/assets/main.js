// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll
const revealEls = document.querySelectorAll('.section-head, .split > *, .room, .explore li, .policies div');
revealEls.forEach((el) => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// Booking form: dates + validation.
// No backend yet — on submit this opens the guest's email app with the request filled in.
// Swap INN_EMAIL for the real address, or point the form at Formspree / a booking engine.
const INN_EMAIL = 'hello@example.com';
const form = document.getElementById('booking-form');
const status = form.querySelector('.form-status');
const checkin = form.elements.checkin;
const checkout = form.elements.checkout;

const iso = (d) => d.toISOString().slice(0, 10);
const today = new Date();
checkin.min = iso(today);
checkin.addEventListener('change', () => {
  if (!checkin.value) return;
  const next = new Date(checkin.value);
  next.setDate(next.getDate() + 1);
  checkout.min = iso(next);
  if (!checkout.value || checkout.value <= checkin.value) checkout.value = iso(next);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  status.className = 'form-status';
  const f = form.elements;
  if (!f.checkin.value || !f.checkout.value) return fail('Please choose your check-in and check-out dates.');
  if (f.checkout.value <= f.checkin.value) return fail('Check-out must be after check-in.');
  if (!f.name.value.trim()) return fail('Please add your name.');
  if (!f.email.checkValidity() || !f.email.value) return fail('Please add a valid email address.');

  const body = [
    `Name: ${f.name.value}`,
    `Email: ${f.email.value}`,
    `Dates: ${f.checkin.value} to ${f.checkout.value}`,
    `Guests: ${f.guests.value}`,
    `Room: ${f.room.value}`,
    '',
    f.notes.value,
  ].join('\n');
  window.location.href = `mailto:${INN_EMAIL}?subject=${encodeURIComponent('Room request — ' + f.checkin.value)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Opening your email app to send the request…';
  status.classList.add('ok');
});

function fail(msg) {
  status.textContent = msg;
  status.classList.add('error');
}
