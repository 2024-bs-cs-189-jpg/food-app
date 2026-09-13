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
    img: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=800&auto=format&fit=crop" },
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


// =========================================================
// ANIMATIONS.JS
// Scroll-reveal (Intersection Observer) + animated counters
// =========================================================

// ---------------------------------------------------------
// SCROLL REVEAL
// Any element with class "reveal" fades/slides into view
// the first time it crosses the viewport threshold
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // -------------------------------------------------------
  // COUNTER ANIMATION
  // Numbers in .stat-number count up once their section
  // enters the viewport (used on home + about statistics)
  // -------------------------------------------------------
  const counters = document.querySelectorAll("[data-count-to]");
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }
});

function animateCounter(el) {
  const target = parseFloat(el.getAttribute("data-count-to"));
  const isDecimal = target % 1 !== 0;
  const duration = 1400;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current = target * eased;
    el.textContent = isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
  }
  requestAnimationFrame(tick);
}

// ---------------------------------------------------------
// COUNTDOWN TIMER
// Used on offers.html for limited-time deals. Counts down
// to a fixed offset from page load (48 hours) for demo use.
// ---------------------------------------------------------
function initCountdown(elId, hoursFromNow = 48) {
  const el = document.getElementById(elId);
  if (!el) return;
  const target = new Date().getTime() + hoursFromNow * 60 * 60 * 1000;

  function update() {
    const now = new Date().getTime();
    const diff = Math.max(target - now, 0);

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    el.querySelector(".cd-hours").textContent = String(h).padStart(2, "0");
    el.querySelector(".cd-minutes").textContent = String(m).padStart(2, "0");
    el.querySelector(".cd-seconds").textContent = String(s).padStart(2, "0");

    if (diff <= 0) clearInterval(timerId);
  }
  update();
  const timerId = setInterval(update, 1000);
}


// =========================================================
// CART.JS
// Handles adding/removing food items, updating quantities,
// calculating totals and persisting the cart with localStorage
// so it survives navigation between pages.
// =========================================================

const CART_KEY = "savorco_cart";
const DELIVERY_FEE = 3.5;
const DISCOUNT_RATE = 0.0; // set by a valid promo code, see checkout/offers

// ---------------------------------------------------------
// STORAGE HELPERS
// ---------------------------------------------------------
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  refreshCartBadge();
}

// ---------------------------------------------------------
// CART OPERATIONS
// ---------------------------------------------------------
function addToCart(foodId, qty = 1) {
  const item = FOOD_ITEMS.find((f) => f.id === foodId);
  if (!item) return;
  const cart = getCart();
  const existing = cart.find((c) => c.id === foodId);
  if (existing) existing.qty += qty;
  else cart.push({ id: item.id, name: item.name, price: item.price, img: item.img, qty });
  saveCart(cart);
  if (typeof showToast === "function") showToast(`${item.name} added to cart`, "success");
  if (document.body.dataset.page === "cart") renderCartPage();
}

function removeFromCart(foodId) {
  let cart = getCart();
  cart = cart.filter((c) => c.id !== foodId);
  saveCart(cart);
  if (document.body.dataset.page === "cart") renderCartPage();
}

function changeQty(foodId, delta) {
  const cart = getCart();
  const item = cart.find((c) => c.id === foodId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(foodId);
    return;
  }
  saveCart(cart);
  if (document.body.dataset.page === "cart") renderCartPage();
}

function clearCart() {
  saveCart([]);
  if (document.body.dataset.page === "cart") renderCartPage();
}

function cartCount() {
  return getCart().reduce((sum, c) => sum + c.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, c) => sum + c.price * c.qty, 0);
}

// ---------------------------------------------------------
// NAVBAR CART BADGE
// Kept in sync on every page load and every cart change
// ---------------------------------------------------------
function refreshCartBadge() {
  document.querySelectorAll(".js-cart-count").forEach((el) => {
    const count = cartCount();
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

// ---------------------------------------------------------
// CART PAGE RENDERING (cart.html)
// ---------------------------------------------------------
function renderCartPage() {
  const listEl = document.getElementById("cart-items-list");
  const emptyEl = document.getElementById("cart-empty-state");
  if (!listEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    listEl.innerHTML = "";
    if (emptyEl) emptyEl.classList.remove("d-none");
    updateSummary();
    return;
  }
  if (emptyEl) emptyEl.classList.add("d-none");

  listEl.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item-row reveal up in-view">
      <img src="${item.img}" alt="${item.name}" class="cart-item-img">
      <div class="flex-grow-1">
        <h6 class="mb-1">${item.name}</h6>
        <div class="text-muted small mb-2">${formatPrice(item.price)} each</div>
        <div class="qty-control">
          <button onclick="changeQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="text-end">
        <div class="fw-bold mb-2">${formatPrice(item.price * item.qty)}</div>
        <button class="remove-item-btn" onclick="removeFromCart('${item.id}')" aria-label="Remove item">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>`
    )
    .join("");

  updateSummary();
}

function updateSummary() {
  const subtotal = cartSubtotal();
  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
  const discount = subtotal * DISCOUNT_RATE;
  const total = subtotal + delivery - discount;

  document.querySelectorAll(".js-subtotal").forEach((el) => (el.textContent = formatPrice(subtotal)));
  document.querySelectorAll(".js-delivery").forEach((el) => (el.textContent = formatPrice(delivery)));
  document.querySelectorAll(".js-discount").forEach((el) => (el.textContent = "-" + formatPrice(discount)));
  document.querySelectorAll(".js-total").forEach((el) => (el.textContent = formatPrice(total)));

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) checkoutBtn.disabled = subtotal <= 0;
}

// ---------------------------------------------------------
// CHECKOUT ORDER SUMMARY (checkout.html)
// ---------------------------------------------------------
function renderCheckoutSummary() {
  const listEl = document.getElementById("checkout-items-list");
  if (!listEl) return;
  const cart = getCart();
  if (cart.length === 0) {
    listEl.innerHTML = `<p class="text-muted small mb-0">Your cart is empty.</p>`;
  } else {
    listEl.innerHTML = cart
      .map(
        (item) => `
      <div class="d-flex justify-content-between small mb-2">
        <span>${item.qty} × ${item.name}</span>
        <span>${formatPrice(item.price * item.qty)}</span>
      </div>`
      )
      .join("");
  }
  updateSummary();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "cart") renderCartPage();
  if (document.body.dataset.page === "checkout") renderCheckoutSummary();
});


// =========================================================
// MENU.JS
// Renders food cards, handles search, category filtering
// and the food details modal (menu.html, and food grids
// reused on index.html / offers.html where applicable)
// =========================================================

let activeCategory = "all";
let activeSearch = "";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("food-grid");
  if (!grid) return;

  renderFoodGrid();

  // -------------------------------------------------------
  // CATEGORY FILTER PILLS
  // -------------------------------------------------------
  document.querySelectorAll(".category-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".category-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.dataset.category;
      renderFoodGrid();
    });
  });

  // -------------------------------------------------------
  // SEARCH INPUT (dynamic filtering as the user types)
  // -------------------------------------------------------
  const searchInput = document.getElementById("food-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeSearch = e.target.value.trim().toLowerCase();
      renderFoodGrid();
    });
  }
});

function renderFoodGrid() {
  const grid = document.getElementById("food-grid");
  const emptyEl = document.getElementById("menu-empty-state");
  if (!grid) return;

  const filtered = FOOD_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = !activeSearch || item.name.toLowerCase().includes(activeSearch);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = "";
    if (emptyEl) emptyEl.classList.remove("d-none");
    return;
  }
  if (emptyEl) emptyEl.classList.add("d-none");

  const favorites = getFavorites();

  grid.innerHTML = filtered
    .map(
      (item) => `
    <div class="col-sm-6 col-lg-4 reveal up in-view">
      <div class="food-card">
        <div class="food-card-img-wrap">
          <span class="food-cat-badge">${item.category}</span>
          <button class="food-fav-btn ${favorites.includes(item.id) ? "active" : ""}"
                  onclick="toggleFavorite('${item.id}', this)" aria-label="Add to favorites">
            <i class="fa-solid fa-heart"></i>
          </button>
          <img src="${item.img}" alt="${item.name}" loading="lazy">
        </div>
        <div class="food-card-body">
          <h3 class="food-card-title h6">${item.name}</h3>
          <p class="food-card-desc">${item.desc}</p>
          <div class="food-card-rating">
            <i class="fa-solid fa-star"></i> ${item.rating} <span>(${item.reviews})</span>
          </div>
          <div class="food-card-footer">
            <span class="food-price">${formatPrice(item.price)}</span>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-brand" style="padding:0.5rem 0.8rem;" onclick="openFoodModal('${item.id}')">Details</button>
              <button class="btn-add-cart" onclick="addToCart('${item.id}')">Add +</button>
            </div>
          </div>
        </div>
      </div>
    </div>`
    )
    .join("");
}

// ---------------------------------------------------------
// FAVORITES (heart button) — persisted in localStorage
// ---------------------------------------------------------
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("savorco_favorites")) || [];
  } catch (e) {
    return [];
  }
}

function toggleFavorite(foodId, btnEl) {
  let favs = getFavorites();
  if (favs.includes(foodId)) favs = favs.filter((f) => f !== foodId);
  else favs.push(foodId);
  localStorage.setItem("savorco_favorites", JSON.stringify(favs));
  if (btnEl) btnEl.classList.toggle("active");
}

// ---------------------------------------------------------
// FOOD DETAILS MODAL
// Populates the shared Bootstrap modal markup with the
// selected item's full details, ingredients and quantity
// ---------------------------------------------------------
let modalQty = 1;

function openFoodModal(foodId) {
  const item = FOOD_ITEMS.find((f) => f.id === foodId);
  if (!item) return;
  modalQty = 1;

  document.getElementById("foodModalImg").src = item.img;
  document.getElementById("foodModalImg").alt = item.name;
  document.getElementById("foodModalName").textContent = item.name;
  document.getElementById("foodModalDesc").textContent = item.desc;
  document.getElementById("foodModalRating").innerHTML =
    `<i class="fa-solid fa-star"></i> ${item.rating} <span class="text-muted">(${item.reviews} reviews)</span>`;
  document.getElementById("foodModalPrice").textContent = formatPrice(item.price);
  document.getElementById("foodModalIngredients").innerHTML = item.ingredients
    .map((ing) => `<span class="ingredient-tag">${ing}</span>`)
    .join("");
  document.getElementById("foodModalQty").textContent = modalQty;

  const addBtn = document.getElementById("foodModalAddBtn");
  addBtn.onclick = () => {
    addToCart(item.id, modalQty);
    const modalEl = document.getElementById("foodDetailsModal");
    bootstrap.Modal.getInstance(modalEl)?.hide();
  };

  const modal = new bootstrap.Modal(document.getElementById("foodDetailsModal"));
  modal.show();
}

function changeModalQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  document.getElementById("foodModalQty").textContent = modalQty;
}
