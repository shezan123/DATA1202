# The Royal Manor Inn — website revamp

A redesigned one-page site for The Royal Manor Inn, the 1832 country manor bed & breakfast at 242 Ricardo Street, Niagara-on-the-Lake.

It's plain HTML, CSS and JS. There's no build step and nothing to install.

## Run it

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## What's in it

- **Colour scheme taken from the manor itself.** Navy from the clapboard, coral from the living room, and gold. Each room card uses that room's own wall colour: Clarence teal, Windsor purple, York sage, Kent blue, Sussex yellow, Cornwall taupe.
- **Real content and photos** from theroyalmanorinn.com: room descriptions, FAQ, policies and the inn's own photos. The photos are resized, and their camera metadata (including GPS location) is removed.
- **Booking through the inn's existing Cloudbeds engine** (`hotels.cloudbeds.com/reservation/MyKpEl`). There are two date pickers that stay in sync: a quick one at the top and a full booking card lower down. Guests choose dates, the number of guests and a room, see the number of nights, then click through to Cloudbeds. The dates and guest count are passed in the link, so the booking page opens with the search filled in. Cloudbeds can't preselect a room from a link, so the page reminds the guest which room they picked.
- A photo gallery that enlarges when clicked, a FAQ that opens and closes, a floating "Book" button on phones, and a "Get directions" link to Google Maps.

## Before going live

- [ ] Check that the Cloudbeds link opens with the dates filled in. If it doesn't, change `bookingUrl()` in `assets/main.js`.
- [ ] Add a photo of **The Sussex**. There's none on the current site yet.
- [ ] Confirm the walking times in the "Distances on foot" card.
- [ ] Optional: add guest reviews, quoted with permission.

## Hosting with GoDaddy (Airo / Websites + Marketing)

GoDaddy's Airo builder is a drag-and-drop editor. It **cannot host custom HTML and CSS sites** like this one. There are two ways to handle that:

1. **Keep the domain at GoDaddy and host this site elsewhere.** Netlify, Cloudflare Pages and GitHub Pages are all free. Then point the domain's DNS at the new host in GoDaddy's DNS settings. This keeps the design exactly as built.
2. **Rebuild it inside Airo**, using this site as the design reference: the colours, fonts (Fraunces and Inter), section order and copy. Airo's booking button can link to the same Cloudbeds URL.

Option 1 gives the best result. Option 2 keeps everything in one GoDaddy account.
