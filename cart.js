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
