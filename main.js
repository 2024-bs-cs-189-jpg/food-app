// =========================================================
// MAIN.JS
// Site-wide behaviour: loading screen, navbar scroll state,
// mobile nav, cart badge sync, toast helper, form validation
// =========================================================

// ---------------------------------------------------------
// SHARED FOOD DATA
// Single source of truth for all food items used across
// index.html, menu.html, offers.html and the food modal.
// ---------------------------------------------------------
const FOOD_ITEMS = [
  { id: "p1", name: "Margherita Supreme", category: "pizza", price: 12.5, rating: 4.8, reviews: 214,
    desc: "Wood-fired sourdough base, San Marzano tomatoes, buffalo mozzarella and torn basil.",
    ingredients: ["Sourdough", "Tomato", "Mozzarella", "Basil", "Olive Oil"],
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop" },
  { id: "p2", name: "Truffle Mushroom Pizza", category: "pizza", price: 15.0, rating: 4.9, reviews: 168,
    desc: "Wild mushroom medley, truffle oil, fontina and rosemary on a crisp thin crust.",
    ingredients: ["Mushroom", "Truffle Oil", "Fontina", "Rosemary"],
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop" },
  { id: "b1", name: "Smokehouse Beef Burger", category: "burgers", price: 11.0, rating: 4.7, reviews: 302,
    desc: "Char-grilled beef patty, smoked cheddar, crispy onions and house BBQ sauce.",
    ingredients: ["Beef Patty", "Cheddar", "Brioche Bun", "BBQ Sauce", "Onion"],
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop" },
  { id: "b2", name: "Crispy Chicken Burger", category: "burgers", price: 9.5, rating: 4.6, reviews: 189,
    desc: "Buttermilk-fried chicken thigh, slaw and spicy aioli in a toasted bun.",
    ingredients: ["Chicken Thigh", "Slaw", "Spicy Aioli", "Bun"],
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop" },
  { id: "pa1", name: "Creamy Alfredo Pasta", category: "pasta", price: 13.0, rating: 4.7, reviews: 145,
    desc: "Fettuccine tossed in a silky parmesan cream sauce with cracked black pepper.",
    ingredients: ["Fettuccine", "Parmesan", "Cream", "Butter", "Black Pepper"],
    img: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800&auto=format&fit=crop" },
  { id: "dr1", name: "Fresh Mango Lassi", category: "drinks", price: 4.5, rating: 4.6, reviews: 87,
    desc: "Chilled yoghurt smoothie blended with ripe mango and a hint of cardamom.",
    ingredients: ["Mango", "Yoghurt", "Cardamom"],
    img: "https://images.unsplash.com/photo-1553530666-ba11a90bb0ae?q=80&w=800&auto=format&fit=crop" },
  { id: "pa2", name: "Spicy Arrabbiata", category: "pasta", price: 12.0, rating: 4.5, reviews: 98,
    desc: "Penne in a fiery tomato-chilli sauce with garlic, basil and grated pecorino.",
    ingredients: ["Penne", "Tomato", "Chilli", "Garlic", "Pecorino"],
    img: "https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?q=80&w=800&auto=format&fit=crop" },
  { id: "c1", name: "Herb Roasted Chicken", category: "chicken", price: 14.5, rating: 4.8, reviews: 176,
    desc: "Free-range chicken roasted with rosemary, thyme and garlic, served with jus.",
    ingredients: ["Chicken", "Rosemary", "Thyme", "Garlic", "Jus"],
    img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=800&auto=format&fit=crop" },
  { id: "c2", name: "Korean Fried Chicken", category: "chicken", price: 13.5, rating: 4.9, reviews: 254,
    desc: "Double-fried chicken glazed in a sweet-spicy gochujang sauce with sesame.",
    ingredients: ["Chicken", "Gochujang", "Sesame", "Scallion"],
    img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop" },
  { id: "d1", name: "Molten Chocolate Cake", category: "desserts", price: 7.0, rating: 4.9, reviews: 220,
    desc: "Warm chocolate cake with a molten centre, served with vanilla bean ice cream.",
    ingredients: ["Dark Chocolate", "Butter", "Egg", "Vanilla Ice Cream"],
    img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop" },
  { id: "d2", name: "New York Cheesecake", category: "desserts", price: 6.5, rating: 4.7, reviews: 156,
    desc: "Classic baked cheesecake on a buttery biscuit base with berry compote.",
    ingredients: ["Cream Cheese", "Biscuit", "Berry Compote"],
    img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop" },
  { id: "dr2", name: "Iced Citrus Green Tea", category: "drinks", price: 3.8, rating: 4.4, reviews: 63,
    desc: "House-brewed green tea over ice with fresh orange and mint.",
    ingredients: ["Green Tea", "Orange", "Mint"],
    img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop" }
];

document.addEventListener("DOMContentLoaded", () => {
  hideLoadingScreen();
  initNavbarScroll();
  initMobileNavAutoClose();
  refreshCartBadge();
  initThemeToggle();
});

// ---------------------------------------------------------
// DARK MODE
// Reads/writes the user's preference in localStorage so it
// persists across every page. The <html data-theme="..">
// attribute is also set as early as possible (inline script
// in each page's <head>) to avoid a flash of the wrong theme.
// ---------------------------------------------------------
const THEME_KEY = "savorco_theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function initThemeToggle() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(saved);

  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

// ---------------------------------------------------------
// LOADING SCREEN
// Removed shortly after DOM is ready so it never blocks
// ---------------------------------------------------------
function hideLoadingScreen() {
  const loader = document.getElementById("loading-screen");
  if (!loader) return;
  window.setTimeout(() => {
    loader.classList.add("hide");
  }, 450);
}

// ---------------------------------------------------------
// NAVBAR SCROLL STATE
// Adds a compact/shadowed style once the page is scrolled
// ---------------------------------------------------------
function initNavbarScroll() {
  const nav = document.querySelector(".site-navbar");
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Auto-collapse the Bootstrap navbar menu after a link tap on mobile
function initMobileNavAutoClose() {
  const collapseEl = document.getElementById("mainNavbar");
  if (!collapseEl || !window.bootstrap) return;
  collapseEl.querySelectorAll(".nav-link-custom").forEach((link) => {
    link.addEventListener("click", () => {
      const instance = bootstrap.Collapse.getInstance(collapseEl);
      if (instance && window.innerWidth < 992) instance.hide();
    });
  });
}

// ---------------------------------------------------------
// TOAST NOTIFICATIONS
// Reusable Bootstrap toast, injected once per page
// ---------------------------------------------------------
function showToast(message, variant = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    container.style.zIndex = 1080;
    document.body.appendChild(container);
  }
  const iconMap = { success: "fa-circle-check", error: "fa-circle-exclamation", info: "fa-circle-info" };
  const colorMap = { success: "#4C9A6A", error: "#C1543A", info: "#16362A" };
  const toastEl = document.createElement("div");
  toastEl.className = "toast toast-custom align-items-center border-0 mb-2";
  toastEl.style.background = colorMap[variant] || colorMap.success;
  toastEl.style.color = "#fff";
  toastEl.setAttribute("role", "alert");
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body"><i class="fa-solid ${iconMap[variant] || iconMap.success} me-2"></i>${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  container.appendChild(toastEl);
  const bsToast = new bootstrap.Toast(toastEl, { delay: 2600 });
  bsToast.show();
  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

// ---------------------------------------------------------
// FORM VALIDATION HELPERS
// Applies Bootstrap's built-in validation styling and
// a couple of custom checks (password match, terms)
// ---------------------------------------------------------
function attachFormValidation(formEl, extraCheck) {
  if (!formEl) return;
  formEl.addEventListener("submit", (e) => {
    let valid = formEl.checkValidity();
    if (extraCheck && !extraCheck()) valid = false;
    e.preventDefault(); // frontend-only project, no real submission
    formEl.classList.add("was-validated");
    if (valid) {
      const onValid = formEl.getAttribute("data-on-valid");
      if (onValid && typeof window[onValid] === "function") window[onValid]();
    }
  });
}

function formatPrice(n) {
  return `$${n.toFixed(2)}`;
}