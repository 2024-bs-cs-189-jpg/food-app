# Savor & Co. — Premium Food Website

A complete, multi-page, responsive restaurant/food-delivery website built with **HTML5, CSS3, vanilla JavaScript and Bootstrap 5**. No backend, no build tools required — just open and go.

## How to Run the Website

1. Unzip the project.
2. Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari) — **or**, for the smoothest experience (recommended so relative paths always resolve), serve the folder locally:
   - VS Code: install the "Live Server" extension, right-click `index.html` → **Open with Live Server**
   - Or run `python -m http.server 8000` inside the project folder and visit `http://localhost:8000`
3. Navigate the site using the navbar — Home, Menu, About, Offers, Contact, Cart.

No installation, API keys, or server-side setup is required.

## Project Structure

```text
food-website/
├── index.html          Home page
├── menu.html           Full menu with search + filter + modal
├── about.html          Our story, timeline, chefs, stats
├── offers.html         Deals, promo codes, countdown timer
├── contact.html        Contact form, map, FAQ accordion
├── cart.html           Shopping cart
├── checkout.html       Checkout form + order confirmation
├── style.css           All design tokens & component styles
├── site.js             All shared JavaScript behaviour combined
│                       including food data, navbar/loading screen,
│                       toasts, scroll reveal, counters, countdown,
│                       cart logic, and menu search/filter/modal
├── images/              Local image assets
│   └── mango-lassi.svg
└── README.md
