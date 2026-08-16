# SoCal Realtor Homepage

A high-converting single-page marketing site for a Southern California real estate
agent (Marieth Martin — SoCal Realtor, eHomeTeam). Static HTML/CSS/JS, no build
step, no dependencies, no framework.

## Run it

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Sections

| Section | What it does |
| --- | --- |
| **Hero** | Full-bleed sunset backdrop, value-proposition headline, dual CTA |
| **Search bar** | Overlay filter card on the hero: location, beds, baths, min/max price. Filters the listing grid live and scrolls to results |
| **Trust strip** | Animated count-up stats |
| **Featured Listings** | Six responsive cards with badges, save/heart toggles, spec rows, removable filter chips and an empty state |
| **Neighborhood expertise** | Local-authority copy plus six market tiles; clicking a tile filters listings to that city |
| **Testimonials** | Carousel with autoplay, prev/next, dots, arrow-key nav, touch swipe, and pause on hover/focus |
| **Contact** | Validated inquiry form beside direct contact links |
| **Sticky CTA footer** | Slides up past the hero, hides over the contact section so it never covers the form it points at |

## Files

```
index.html                 markup + listing data (data-city / data-beds / data-baths / data-price)
assets/css/styles.css      design tokens, layout, responsive rules
assets/js/main.js          filtering, carousel, sticky CTA, reveals, form validation
assets/img/*.svg           placeholder photography + favicon
```

## Before launch — replace these placeholders

The build is production-ready structurally, but the following stand-ins must be
swapped for real data:

1. **Contact details** — `(909) 555-0142` and `marieth@ehomesteam.com` are
   placeholders (marked with a `TODO` comment in `index.html`). They appear in the
   contact section and the sticky CTA.
2. **DRE license number** — the footer carries `DRE #00000000`. California requires
   the real license number on agent advertising.
3. **Listings** — the six properties, prices, addresses and remarks are illustrative.
   Replace the `<article class="card">` blocks, or wire the grid to an IDX/MLS feed.
   Keep the `data-city`, `data-beds`, `data-baths` and `data-price` attributes: the
   filter reads them directly.
4. **Testimonials** — client names and quotes are illustrative. Use real reviews with
   written permission.
5. **Neighborhood medians and days-on-market** — illustrative figures; refresh from
   current MLS data.
6. **Photography** — the SVGs in `assets/img/` are stylized placeholders. Drop in real
   listing photos (4:3, roughly 1600×1200) and update the `<img src>` values.
7. **Form backend** — `#contactForm` validates client-side and shows a success message,
   but posts nowhere. Point it at your CRM, Formspree, Netlify Forms, or an endpoint of
   your choice.

The Calendly link (`calendly.com/marieth-ehomesteam/30min`) and Instagram handle
(`@mariethrealtor`) come from the agent's public profile and are already live.

## Notes

- **Responsive** at 390px through 1440px+ with no horizontal overflow.
- **Accessible**: skip link, labelled controls, `aria-live` result counts, keyboard-
  operable carousel, visible focus rings, `prefers-reduced-motion` honored (autoplay
  and reveal animations disable).
- **No-JS fallback**: all six listings, both CTAs, and every link work without
  JavaScript — only filtering and the carousel require it.
- Verified in Chromium at desktop and mobile viewports: filtering, chips, empty state,
  carousel, sticky CTA and form validation all behave, with a clean console.
