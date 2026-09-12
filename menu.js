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
