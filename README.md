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
Main Features
9 fully connected HTML pages sharing one consistent design system
"Sunset Coral" color theme — warm peach-to-coral palette with a deep burgundy for contrast
Dark mode — moon/sun toggle button in the navbar on every page, preference saved in localStorage and applied instantly with no flash on page load
Custom scrollbar styling — themed scrollbar for modern browsers
Broken-image fallback — if any food/hero image fails to load, it is automatically replaced with a themed icon placeholder
Responsive Bootstrap 5 navbar with mobile hamburger menu, sticky + scroll-aware styling
Scroll-reveal animations using Intersection Observer
Animated statistic counters on Home & About pages
Functional frontend shopping cart with localStorage persistence across pages
Menu search + category filtering + Bootstrap modal food details
Favorite/heart button with persistent favorites
Offers page with a live countdown timer and promo codes
Contact form, FAQ accordion, and stylized map section
Checkout flow with payment method selector and order confirmation
Toast notifications for cart, checkout, and contact actions
Loading screen shown briefly on every page load
Technologies Used
HTML5 — semantic markup
CSS3 — custom properties / design tokens
Bootstrap 5.3 — via CDN
Font Awesome 6 — via CDN for icons
Google Fonts — Fraunces (headings) + Manrope (body)
Vanilla JavaScript (ES6) — no frameworks, no build step
Browser localStorage — for cart and favorites persistence
How the Cart Works
All food items are stored in a single array, FOOD_ITEMS, defined in site.js.
addToCart(id, qty) in site.js adds an item or increases its quantity.
Cart data is saved to localStorage under the key savorco_cart.
Every page that includes site.js reads from the same localStorage key.
Items added on menu.html remain available when opening cart.html or checkout.html.
The navbar cart badge (.js-cart-count) is automatically refreshed whenever the cart changes.
cart.html and checkout.html render item lists and totals directly from localStorage.
Quantity +/− buttons and the remove button update the cart instantly.
Placing an order on checkout.html clears the cart and displays an order-confirmation screen.
How to Customize Food Items

Open site.js and edit the FOOD_ITEMS array near the top of the file.

Each item looks like:

{
  id: "p1",
  name: "Margherita Supreme",
  category: "pizza",
  price: 12.5,
  rating: 4.8,
  reviews: 214,
  desc: "Short description shown on the card.",
  ingredients: ["Sourdough", "Tomato", "Mozzarella"],
  img: "https://your-image-url.jpg"
}
id must be unique — it is used by the cart and favorites.
category must match one of the filter pills on menu.html (pizza, burgers, pasta, chicken, desserts, drinks).
Add or remove food items freely.
menu.html, the homepage Featured Dishes section, and the food modal all read from the same FOOD_ITEMS array.
Food data only needs to be edited in one place: site.js.
How to Change Colors

All colors are defined as CSS custom properties at the top of style.css.

The current theme is "Sunset Coral", based on the palette:

#FEEAC9 → #FFCDC9 → #FDACAC → #FD7979

Example:

:root {
  --deep-green: #5A2A2E;   /* deep burgundy */
  --fresh-green: #E2625F;  /* medium coral */
  --cream: #FFF8F3;        /* page background */
  --beige: #FDE7CB;        /* section backgrounds and borders */
  --gold: #FD7979;         /* bright coral accent */
}

Change the hex values in style.css and the colors will update throughout the website.

The variable names were kept from the original theme on purpose, so changing the hex values is enough — no other CSS has to be changed.

Dark Mode

Dark mode overrides the same variable set inside the:

[data-theme="dark"] {
  ...
}

block in style.css.

The theme is toggled by the moon/sun button in the navbar.

The JavaScript function initThemeToggle() in site.js handles the theme switching and saves the selected theme in localStorage using the key:

savorco_theme

A small inline script at the top of every page's <head> applies the saved theme before the page loads to prevent a flash of the wrong theme.

Scrollbar

The scrollbar styling is defined near the bottom of style.css.

It includes custom scrollbar rules for modern browsers and automatically adapts to dark mode.

How to Add New Pages
Copy an existing page such as contact.html as a starting template.
Update the <title> and the active class on the matching navbar link.
Set a unique data-page="your-page" attribute on <body> if the page needs page-specific JavaScript logic.
Add a link to the new page in the navbar and footer across all pages so navigation stays consistent.
Keep the same JavaScript include order at the bottom of each page:
Bootstrap JS → site.js
Notes
This is a frontend-only project.
Forms do not submit to a real server.
Checkout and contact actions are simulated using toast notifications.
Checkout displays an order-confirmation screen after placing an order.
Food images may use external image URLs.
Local images can be stored in the images/ folder.
If you use local images, update the corresponding img field in site.js.
License

This project is created for educational and demonstration purposes.
