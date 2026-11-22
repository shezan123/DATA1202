# The Royal Manor Inn — website revamp

A redesigned one-page site for The Royal Manor Inn, a historic 1832 bed & breakfast at 242 Ricardo Street, Niagara-on-the-Lake.

Plain HTML, CSS and JS. There's no build step and nothing to install.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html          page content and sections
assets/styles.css   design tokens, layout, responsive rules
assets/main.js      mobile nav, scroll reveal, booking form
```

## What still needs real content

The live site was unreachable while this was built. Facts come from public booking listings: the 1832 build date, the James Crooks history, breakfast from 9:00 to 9:30, check-in from 4 to 6 PM, noon checkout, free parking, no pets, no elevator. Please check them and fill in the rest:

- [ ] **Photos.** Striped boxes mark each photo slot. The hero is an SVG illustration of a house. Replace it with a real exterior shot.
- [ ] **Rooms.** The room names, beds and descriptions are placeholders. The listings disagree on whether there are 3 or 5 rooms.
- [ ] **Rates.** None are shown yet.
- [ ] **Contact.** Add the phone number and email in `index.html`, and set `INN_EMAIL` in `assets/main.js`.
- [ ] **Booking.** The form opens the guest's email app with the request filled in. Connect it to a booking engine or a form service if you want bookings to land somewhere directly.
- [ ] **Reviews.** Real guest testimonials can go in a new section. Use only reviews you have permission to quote.

## Deploy

Any static host works: GitHub Pages, Netlify or Cloudflare Pages.
