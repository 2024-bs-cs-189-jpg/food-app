# Savor & Co. — Premium Food Website

A complete, multi-page, responsive restaurant/food-delivery website built with **HTML5, CSS3, vanilla JavaScript and Bootstrap 5**. No backend, no build tools required — just open and go.

## How to Run the Website

1. Unzip the project.
2. Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari) — **or**, for the smoothest experience (recommended so relative paths always resolve), serve the folder locally:
   - VS Code: install the "Live Server" extension, right-click `index.html` → "Open with Live Server"
   - Or run `python -m http.server 8000` inside the project folder and visit `http://localhost:8000`
3. Navigate the site using the navbar — Home, Menu, About, Offers, Contact, Cart.

No installation, API keys, or server-side setup is required.

## Project Structure

```
food-website/
├── index.html          Home page
├── menu.html            Full menu with search + filter + modal
├── about.html            Our story, timeline, chefs, stats
├── offers.html          Deals, promo codes, countdown timer
├── contact.html          Contact form, map, FAQ accordion
├── cart.html              Shopping cart
├── checkout.html      Checkout form + order confirmation
├── css/
│   └── style.css          All design tokens & component styles
├── js/
│   └── site.js            All shared behaviour combined in one file:
│                          food data, navbar/loading screen/toasts, scroll
│                          reveal + counters + countdown, cart logic, and
│                          menu search/filter/modal
├── images/               (folder reserved for local image assets;
│                          the site currently uses Unsplash CDN images)
└── README.md
```

## Main Features

- 9 fully connected HTML pages sharing one consistent design system
- **"Sunset Coral" color theme** — warm peach-to-coral palette with a deep burgundy for contrast (see "How to Change Colors" below)
- **Dark mode** — moon/sun toggle button in the navbar on every page, preference saved in `localStorage` and applied instantly with no flash on page load
- **Custom scrollbar styling** — themed scrollbar (Chromium/Safari via `::-webkit-scrollbar`, Firefox via `scrollbar-color`), with a matching dark-mode variant
- **Broken-image fallback** — if any food/hero image fails to load, it's automatically swapped for a themed icon placeholder instead of leaving a blank gap
- Responsive Bootstrap 5 navbar with mobile hamburger menu, sticky + scroll-aware styling
- Scroll-reveal animations (Intersection Observer) across every page
- Animated statistic counters (Home & About)
- Functional frontend shopping cart with **localStorage** persistence across pages
- Menu search + category filtering + Bootstrap modal food details
- Favorite/heart button (persisted per item)
- Offers page with a live countdown timer and promo codes
- Contact form, FAQ accordion, and a stylized map section
- Checkout flow with payment method selector and an order-confirmation screen
- Toast notifications for cart/checkout/contact actions
- Loading screen shown briefly on every page load

## Technologies Used

- HTML5 (semantic markup)
- CSS3 (custom properties / design tokens, no preprocessor needed)
- Bootstrap 5.3 (via CDN)
- Font Awesome 6 (via CDN, for icons)
- Google Fonts — Fraunces (headings) + Manrope (body)
- Vanilla JavaScript (ES6) — no frameworks, no build step
- Browser `localStorage` for cart + favorites persistence

## How the Cart Works

- All food items live in a single array, `FOOD_ITEMS`, defined in `js/site.js`.
- `addToCart(id, qty)` in `js/site.js` adds an item (or increases its quantity) and saves the cart to `localStorage` under the key `savorco_cart`.
- Every page that includes `js/site.js` reads from the same `localStorage` key, so items added on `menu.html` are still present when you open `cart.html` or `checkout.html`.
- The navbar cart badge (`.js-cart-count`) is refreshed automatically whenever the cart changes.
- `cart.html` and `checkout.html` render item lists and totals live from `localStorage` — quantity +/− buttons and the remove button update everything instantly.
- Placing an order on `checkout.html` clears the cart and shows an order-confirmation screen.

## How to Customize Food Items

Open `js/site.js` and edit the `FOOD_ITEMS` array near the top of the file. Each item looks like:

```js
{ id: "p1", name: "Margherita Supreme", category: "pizza", price: 12.5, rating: 4.8, reviews: 214,
  desc: "Short description shown on the card.",
  ingredients: ["Sourdough", "Tomato", "Mozzarella"],
  img: "https://your-image-url.jpg" }
```

- `id` must be unique — it's used by the cart and favorites.
- `category` must match one of the filter pills on `menu.html` (`pizza`, `burgers`, `pasta`, `chicken`, `desserts`, `drinks`) or you can add a new pill in `menu.html` to match a new category.
- Add or remove items freely — `menu.html`, the homepage "Featured Dishes" strip, and the food modal all read from this same array, so you only edit food data in one place (inside `js/site.js`).

## How to Change Colors

All colors are defined as CSS custom properties at the top of `css/style.css` (currently the "Sunset Coral" theme, based on the palette #FEEAC9 → #FFCDC9 → #FDACAC → #FD7979):

```css
:root {
  --deep-green: #5A2A2E;   /* deep burgundy — headings, main CTA bg, footer bg */
  --fresh-green: #E2625F;  /* medium coral — links, ratings, active states */
  --cream: #FFF8F3;        /* page background */
  --beige: #FDE7CB;        /* section backgrounds, borders (the palette's peach tone) */
  --gold: #FD7979;         /* bright coral — primary accent, buttons, badges */
  ...
}
```

Change any value here and it updates across every page, since all components (buttons, cards, navbar, footer, badges) reference these variables instead of hard-coded colors. Variable *names* were kept from the original theme on purpose, so swapping hex values is all that's needed — no other CSS has to change.

### Dark Mode

Dark mode overrides the same variable set inside a `[data-theme="dark"] { ... }` block, further down in `css/style.css`, using the same coral family (bright coral accents on a near-black warm background) so it stays visually consistent with light mode. To adjust dark-mode colors, edit the hex values in that block. The theme is toggled by the moon/sun button in the navbar (`js/site.js` → `initThemeToggle()`), which flips `data-theme` on `<html>` and remembers the choice in `localStorage` under the key `savorco_theme`. A small inline script at the very top of every page's `<head>` re-applies the saved theme before the page paints (no flash of the wrong theme), and also registers the broken-image fallback listener as early as possible — before `js/site.js` loads — so even images that fail instantly are caught.

### Scrollbar

The scrollbar is themed near the bottom of `css/style.css` (`::-webkit-scrollbar` rules for Chrome/Edge/Safari, `scrollbar-color`/`scrollbar-width` for Firefox), and automatically adapts in dark mode.

## How to Add New Pages

1. Copy an existing page (e.g. `contact.html`) as a starting template — it already includes the loading screen, navbar and footer markup.
2. Update the `<title>` and the `active` class on the matching navbar link.
3. Set a unique `data-page="your-page"` attribute on `<body>` if the page needs page-specific JS logic (see how `cart.html` and `checkout.html` do this).
4. Add a link to the new page in the navbar (and footer, if relevant) across **all** pages so navigation stays consistent.
5. Keep the same `<script>` include order at the bottom: Bootstrap JS → `js/site.js`.

## Notes

- This is a **frontend-only** project — forms don't submit to a real server; checkout/contact actions are simulated with toast notifications and, on checkout, an order-confirmation screen.
- Food images are served from Unsplash's CDN for reliability; swap them for local files in `images/food/` if you prefer offline assets — just update the `img` field in `js/site.js`.
