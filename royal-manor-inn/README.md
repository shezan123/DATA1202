# The Royal Manor Inn — website revamp

A redesigned one-page site for The Royal Manor Inn, the 1832 country manor bed & breakfast at 242 Ricardo Street, Niagara-on-the-Lake.

It's plain HTML, CSS and JS. There's no build step and nothing to install.

## Run it

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## What's in it

**Look.** The colours and fonts are inspired by tabergfalls.com. The palette is deep forest greens (`#151a14`, `#272f25`, `#2f392c`), warm cream and linen (`#faf6f0`, `#ebe3d3`), and a gold-copper accent (`#d3a976`, `#bd7441`). Headings are in Playfair Display, with italics for emphasis. Body text is Montserrat, and quotes are Cormorant Garamond. Each room keeps a small dot in its own wall colour.

**Motion.** The animation is inspired by hotelparticulier.com and written in plain JavaScript, with no libraries:
- An opening curtain with a gold loading line, then the hero photo settles from a slight zoom while the headline rises into place line by line.
- A header with Menu, logo and Reserve. It turns solid cream once you scroll past the hero and hides while you scroll down.
- A full-screen menu that wipes down. Its links appear one after another, and the photo on the left changes as you hover each one.
- A circular "Est. 1832" emblem that turns as you scroll.
- In the rooms section, hovering or tapping a room name crossfades the background to that room's photo and swaps in its details.
- Photos zoom in slowly as they scroll through the screen.
- A photo strip you can drag, which keeps gliding with momentum after you let go. It drifts slowly on its own, and a round gold "Drag" cursor appears over it.
- Text fades up into place in short sequences as you scroll.
- All motion turns off when the visitor's device asks for reduced motion.

**Content and booking.** The text and photos come from theroyalmanorinn.com. The photos are resized, and their camera metadata (including GPS location) is removed. Booking sends guests to the inn's existing Cloudbeds engine (`hotels.cloudbeds.com/reservation/MyKpEl`) with the dates and guest count passed in the link. The two date pickers (one in the hero, one in the booking section) stay in sync. "Reserve this room" picks that room in the booking form, and the page reminds the guest to choose it on the Cloudbeds page.

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
