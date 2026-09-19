# All Care Cleaning Services — Website

A static marketing website for All Care Cleaning Services ("Where Clean Meets Care"), built to match the brand's navy/blue logo.

## Structure

- `index.html` — full single-page site: hero, services, why-us, process, pricing, testimonials, contact form, footer
- `css/styles.css` — styling and responsive layout
- `js/script.js` — mobile nav toggle, back-to-top button, contact form validation
- `assets/logo.svg` — recreated brand mark

## Running locally

```
cd all-care-cleaning-services
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Customizing

Update the placeholder phone number, email, address, and service area text in `index.html` (header, hero card, and contact section) with the client's real business details. The contact form currently shows a success message on submit; wire it to a real backend or form service (e.g. Formspree, Netlify Forms) to actually deliver submissions.
