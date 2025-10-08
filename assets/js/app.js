const API_BASE = (() => {
  if (window.NOVAWAVE_API) return `${window.NOVAWAVE_API.replace(/\/$/, "")}`;
  if (window.location.origin.startsWith("http")) {
    return `${window.location.origin}/api`;
  }
  return "http://localhost:8000/api";
})();

const STORAGE_TOKEN = "novaWaveToken";
const STORAGE_CART = "novaWaveCart";

const cartDrawer = document.getElementById("cart-drawer");
const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsEl = document.getElementById("cart-items");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartTotalEl = document.getElementById("cart-total");
const productGrid = document.getElementById("product-grid");
const productCardTemplate = document.getElementById("product-card-template");
const cartItemTemplate = document.getElementById("cart-item-template");
const orderTimeline = document.getElementById("order-timeline");
const orderTemplate = document.getElementById("order-entry-template");
const categoryGrid = document.getElementById("category-grid");
const sortSelect = document.getElementById("sort-select");
const searchInput = document.getElementById("search-input");
const navButtons = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");
const userPill = document.getElementById("user-pill");
const userNameEl = document.getElementById("user-name");
const adminNavBtn = document.getElementById("admin-nav");
const authModal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authName = document.getElementById("auth-name");
const authAdminKey = document.getElementById("auth-admin-key");
const authMessage = document.getElementById("auth-message");
const registerOnly = document.getElementById("register-only");
const productForm = document.getElementById("product-form");
const productIdInput = document.getElementById("product-id");
const productNameInput = document.getElementById("product-name");
const productCategoryInput = document.getElementById("product-category");
const productPriceInput = document.getElementById("product-price");
const productDescriptionInput = document.getElementById("product-description");
const productImageInput = document.getElementById("product-image");
const resetProductBtn = document.getElementById("reset-product");
const featureTogglesEl = document.getElementById("feature-toggles");
const paymentForm = document.getElementById("payment-form");
const paymentStatusSelect = document.getElementById("payment-status");
const paymentAnnouncementInput = document.getElementById("payment-announcement");
const paymentIntegrationEl = document.getElementById("payment-integration");
const checkoutBtn = document.getElementById("checkout-btn");
const liveStatsEl = document.getElementById("live-stats");
const orbitingCard = document.getElementById("orbiting-card");
const heroScrollButtons = document.querySelectorAll("[data-scroll]");

const state = {
  user: null,
  token: localStorage.getItem(STORAGE_TOKEN) || null,
  products: [],
  filteredProducts: [],
  categories: [],
  cart: loadCart(),
  settings: {
    features: {
      hologramCards: true,
      waveMotion: true,
      glowHighlights: true,
      autoRecommendations: true,
    },
    payment: {
      status: "online",
      announcement: "Thanh toán PayPal giảm 10% hôm nay!",
    },
  },
  metrics: null,
};

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_CART);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item.product_id === "number" && item.quantity > 0);
    }
  } catch (err) {
    console.warn("Không thể đọc giỏ hàng", err);
  }
  return [];
}

function persistCart() {
  localStorage.setItem(STORAGE_CART, JSON.stringify(state.cart));
}

function setToken(token) {
  state.token = token;
  if (token) {
    localStorage.setItem(STORAGE_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_TOKEN);
  }
}

async function api(path, options = {}) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };
  if (state.token) {
    config.headers.Authorization = `Bearer ${state.token}`;
  }
  const response = await fetch(`${API_BASE}${path}`, config);
  if (!response.ok) {
    let detail = "Đã xảy ra lỗi";
    try {
      const payload = await response.json();
      detail = payload.detail || JSON.stringify(payload);
    } catch (err) {
      detail = response.statusText;
    }
    throw new Error(detail);
  }
  if (response.status === 204) return null;
  return response.json();
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function setView(view) {
  views.forEach((panel) => {
    panel.classList.toggle("active", panel.id === view);
  });
  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
  if (view === "orders") {
    refreshOrders();
  }
  if (view === "admin" && state.user?.role === "admin") {
    refreshMetrics();
  }
}

function updateUserUI() {
  if (state.user) {
    userPill.hidden = false;
    userNameEl.textContent = state.user.name;
    loginBtn.hidden = true;
    registerBtn.hidden = true;
    logoutBtn.hidden = false;
    if (state.user.role === "admin") {
      adminNavBtn.hidden = false;
    } else {
      adminNavBtn.hidden = true;
    }
  } else {
    userPill.hidden = true;
    loginBtn.hidden = false;
    registerBtn.hidden = false;
    logoutBtn.hidden = true;
    adminNavBtn.hidden = true;
  }
}

function updateCartBadge() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBtn.setAttribute("data-count", totalItems);
}

function openCart() {
  cartDrawer.classList.add("open");
  renderCart();
}

function closeCart() {
  cartDrawer.classList.remove("open");
}

function findProductById(id) {
  return state.products.find((prod) => prod.id === id);
}

function addToCart(productId) {
  const existing = state.cart.find((item) => item.product_id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ product_id: productId, quantity: 1 });
  }
  persistCart();
  updateCartBadge();
  renderCart();
}

function updateCartQuantity(productId, delta) {
  const entry = state.cart.find((item) => item.product_id === productId);
  if (!entry) return;
  entry.quantity += delta;
  if (entry.quantity <= 0) {
    state.cart = state.cart.filter((item) => item.product_id !== productId);
  }
  persistCart();
  updateCartBadge();
  renderCart();
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let subtotal = 0;
  state.cart.forEach((entry) => {
    const product = findProductById(entry.product_id);
    if (!product) return;
    subtotal += product.price * entry.quantity;
    const node = cartItemTemplate.content.cloneNode(true);
    node.querySelector(".item-title").textContent = product.name;
    node.querySelector(".item-meta").textContent = `${product.category} • ${formatCurrency(product.price)}`;
    node.querySelector(".item-quantity").textContent = entry.quantity;
    node.querySelector(".item-price").textContent = formatCurrency(product.price * entry.quantity);
    node.querySelector(".decrease").addEventListener("click", () => updateCartQuantity(product.id, -1));
    node.querySelector(".increase").addEventListener("click", () => updateCartQuantity(product.id, 1));
    cartItemsEl.appendChild(node);
  });
  cartSubtotalEl.textContent = formatCurrency(subtotal);
  cartTotalEl.textContent = formatCurrency(subtotal);
}

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const sort = sortSelect.value;
  let products = [...state.products];
  if (term) {
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
  }
  switch (sort) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    default:
      products.sort((a, b) => b.popularity - a.popularity);
      break;
  }
  state.filteredProducts = products;
  renderProducts();
}

function renderProducts() {
  productGrid.innerHTML = "";
  state.filteredProducts.forEach((product) => {
    const node = productCardTemplate.content.cloneNode(true);
    const card = node.querySelector(".product-card");
    if (!state.settings.features.hologramCards) {
      card.classList.add("no-hologram");
    }
    node.querySelector(".product-image").src = product.image_url;
    node.querySelector(".product-image").alt = product.name;
    node.querySelector(".product-title").textContent = product.name;
    node.querySelector(".product-description").textContent = product.description;
    node.querySelector(".product-category").textContent = product.category;
    node.querySelector(".product-price").textContent = formatCurrency(product.price);
    node.querySelector(".add-cart-btn").addEventListener("click", () => addToCart(product.id));
    const editBtn = node.querySelector(".edit-btn");
    if (state.user?.role === "admin") {
      editBtn.hidden = false;
      editBtn.addEventListener("click", () => populateProductForm(product));
    }
    productGrid.appendChild(node);
  });
  updateOrbitingCard();
}

function updateOrbitingCard() {
  if (!orbitingCard) return;
  const product = state.filteredProducts[0];
  if (!product) {
    orbitingCard.innerHTML = "";
    return;
  }
  orbitingCard.innerHTML = `
    <div class="orbit-title">${product.name}</div>
    <div class="orbit-price">${formatCurrency(product.price)}</div>
  `;
}

function renderCategories() {
  categoryGrid.innerHTML = "";
  state.categories.forEach((entry) => {
    const div = document.createElement("div");
    div.className = "category-card";
    div.innerHTML = `
      <span class="category-name">${entry.category}</span>
      <span class="category-count">${entry.total} sản phẩm</span>
    `;
    div.addEventListener("click", () => {
      searchInput.value = entry.category;
      applyFilters();
      window.scrollTo({ top: document.getElementById("featured").offsetTop - 80, behavior: "smooth" });
    });
    categoryGrid.appendChild(div);
  });
}

function renderOrders(orders) {
  orderTimeline.innerHTML = "";
  orders.forEach((order) => {
    const node = orderTemplate.content.cloneNode(true);
    node.querySelector(".order-id").textContent = `Đơn #${order.id}`;
    node.querySelector(".order-date").textContent = formatDate(order.created_at);
    const body = node.querySelector(".order-body");
    order.items.forEach((item) => {
      const line = document.createElement("p");
      line.textContent = `${item.name} × ${item.quantity}`;
      body.appendChild(line);
    });
    if (order.customer_name) {
      const badge = document.createElement("span");
      badge.className = "order-customer";
      badge.textContent = `Khách hàng: ${order.customer_name}`;
      body.appendChild(badge);
    }
    node.querySelector(".order-total").textContent = formatCurrency(order.total);
    node.querySelector(".order-method").textContent = order.payment_method;
    node.querySelector(".order-status").textContent = order.status;
    orderTimeline.appendChild(node);
  });
}

function renderFeatureToggles() {
  if (!featureTogglesEl) return;
  featureTogglesEl.innerHTML = "";
  Object.entries(state.settings.features).forEach(([key, value]) => {
    const label = document.createElement("label");
    label.className = "toggle";
    label.innerHTML = `
      <span>${featureLabel(key)}</span>
      <input type="checkbox" ${value ? "checked" : ""} />
    `;
    const input = label.querySelector("input");
    if (state.user?.role !== "admin") {
      input.disabled = true;
    }
    input.addEventListener("change", async () => {
      if (state.user?.role !== "admin") {
        input.checked = !input.checked;
        return;
      }
      try {
        const toggles = { ...state.settings.features, [key]: input.checked };
        await api("/settings/features", {
          method: "PUT",
          body: JSON.stringify({ toggles }),
        });
        state.settings.features = toggles;
        applyFilters();
      } catch (err) {
        input.checked = !input.checked;
        showMessage(err.message);
      }
    });
    featureTogglesEl.appendChild(label);
  });
}

function featureLabel(key) {
  switch (key) {
    case "hologramCards":
      return "Thẻ hologram";
    case "waveMotion":
      return "Hiệu ứng sóng";
    case "glowHighlights":
      return "Viền phát sáng";
    case "autoRecommendations":
      return "Gợi ý tự động";
    default:
      return key;
  }
}

function updatePaymentPanel() {
  if (!paymentIntegrationEl) return;
  paymentStatusSelect.value = state.settings.payment.status;
  paymentAnnouncementInput.value = state.settings.payment.announcement;
  paymentIntegrationEl.innerHTML = `
    <div class="payment-status ${state.settings.payment.status}">
      <strong>Trạng thái:</strong> ${
        state.settings.payment.status === "online" ? "Đang hoạt động" : "Bảo trì"
      }
    </div>
    <p>${state.settings.payment.announcement}</p>
  `;
}

function showMessage(message, type = "error") {
  authMessage.textContent = message;
  authMessage.dataset.type = type;
  authMessage.hidden = false;
  setTimeout(() => {
    authMessage.textContent = "";
    authMessage.hidden = true;
  }, 4000);
}

async function bootstrap() {
  updateUserUI();
  updateCartBadge();
  if (state.token) {
    try {
      const { user } = await api("/auth/me");
      state.user = user;
    } catch (err) {
      setToken(null);
    }
  }
  updateUserUI();
  await Promise.all([refreshProducts(), refreshCategories(), refreshSettings()]);
  if (state.user?.role === "admin") {
    refreshMetrics();
  }
  applyFilters();
  if (state.user) {
    refreshOrders();
  }
  bindEvents();
  startLiveStats();
}

async function refreshProducts() {
  const data = await api("/products");
  state.products = data.products;
  applyFilters();
}

async function refreshCategories() {
  const data = await api("/categories");
  state.categories = data.categories;
  renderCategories();
}

async function refreshSettings() {
  try {
    const settings = await api("/settings");
    state.settings = {
      ...state.settings,
      ...settings,
    };
    renderFeatureToggles();
    updatePaymentPanel();
  } catch (err) {
    console.warn("Không thể tải cấu hình", err);
  }
}

async function refreshOrders() {
  if (!state.user) return;
  try {
    const data = await api("/orders");
    renderOrders(data.orders);
  } catch (err) {
    showMessage(err.message);
  }
}

async function refreshMetrics() {
  if (state.user?.role !== "admin") return;
  try {
    state.metrics = await api("/dashboard/metrics");
    updateLiveStats();
  } catch (err) {
    console.warn("Không thể tải metrics", err);
  }
}

function bindEvents() {
  sortSelect.addEventListener("change", applyFilters);
  searchInput.addEventListener("input", () => {
    window.requestAnimationFrame(applyFilters);
  });
  cartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  checkoutBtn.addEventListener("click", handleCheckout);
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.view));
  });
  heroScrollButtons.forEach((btn) => {
    const targetId = btn.dataset.scroll;
    btn.addEventListener("click", () => {
      const target = document.getElementById(targetId);
      if (target) {
        window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
      }
    });
  });
  loginBtn.addEventListener("click", () => openAuthModal(false));
  registerBtn.addEventListener("click", () => openAuthModal(true));
  logoutBtn.addEventListener("click", handleLogout);
  authForm.addEventListener("submit", handleAuthSubmit);
  resetProductBtn.addEventListener("click", (event) => {
    event.preventDefault();
    clearProductForm();
  });
  productForm.addEventListener("submit", handleProductSubmit);
  paymentForm.addEventListener("submit", handlePaymentSubmit);
}

function openAuthModal(isRegister) {
  authTitle.textContent = isRegister ? "Đăng ký" : "Đăng nhập";
  registerOnly.style.display = isRegister ? "grid" : "none";
  authForm.dataset.mode = isRegister ? "register" : "login";
  authMessage.textContent = "";
  authMessage.hidden = true;
  authModal.showModal();
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const payload = {
    email: authEmail.value.trim(),
    password: authPassword.value,
  };
  const isRegister = authForm.dataset.mode === "register";
  try {
    let data;
    if (isRegister) {
      data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          name: authName.value.trim(),
          admin_key: authAdminKey.value.trim() || undefined,
        }),
      });
    } else {
      data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    state.user = data.user;
    setToken(data.token);
    updateUserUI();
    authModal.close();
    authForm.reset();
    await refreshSettings();
    refreshOrders();
    if (state.user.role === "admin") {
      refreshMetrics();
    }
  } catch (err) {
    showMessage(err.message);
  }
}

async function handleLogout() {
  try {
    await api("/auth/logout", { method: "POST" });
  } catch (err) {
    console.warn("Không thể đăng xuất", err);
  }
  state.user = null;
  setToken(null);
  updateUserUI();
  renderFeatureToggles();
  setView("market");
}

function populateProductForm(product) {
  setView("admin");
  productIdInput.value = product.id;
  productNameInput.value = product.name;
  productCategoryInput.value = product.category;
  productPriceInput.value = product.price;
  productDescriptionInput.value = product.description;
  productImageInput.value = product.image_url;
}

function clearProductForm() {
  productIdInput.value = "";
  productForm.reset();
}

async function handleProductSubmit(event) {
  event.preventDefault();
  if (state.user?.role !== "admin") {
    showMessage("Bạn không có quyền quản trị");
    return;
  }
  const payload = {
    name: productNameInput.value.trim(),
    category: productCategoryInput.value.trim(),
    price: Number(productPriceInput.value),
    description: productDescriptionInput.value.trim(),
    image_url: productImageInput.value.trim(),
    popularity: 80,
  };
  try {
    if (productIdInput.value) {
      await api(`/products/${productIdInput.value}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await api("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    clearProductForm();
    await refreshProducts();
    await refreshCategories();
  } catch (err) {
    showMessage(err.message);
  }
}

async function handlePaymentSubmit(event) {
  event.preventDefault();
  if (state.user?.role !== "admin") {
    showMessage("Bạn không có quyền quản trị");
    return;
  }
  try {
    const payload = {
      status: paymentStatusSelect.value,
      announcement: paymentAnnouncementInput.value.trim(),
    };
    const { payment } = await api("/settings/payment", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    state.settings.payment = payment;
    updatePaymentPanel();
  } catch (err) {
    showMessage(err.message);
  }
}

async function handleCheckout() {
  if (!state.user) {
    openAuthModal(false);
    showMessage("Bạn cần đăng nhập để thanh toán", "info");
    return;
  }
  if (state.cart.length === 0) {
    showMessage("Giỏ hàng đang trống", "info");
    return;
  }
  const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
  try {
    const body = {
      items: state.cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      payment_method: paymentMethod,
    };
    await api("/orders", {
      method: "POST",
      body: JSON.stringify(body),
    });
    state.cart = [];
    persistCart();
    updateCartBadge();
    renderCart();
    closeCart();
    refreshOrders();
  } catch (err) {
    showMessage(err.message);
  }
}

function startLiveStats() {
  updateLiveStats();
  setInterval(updateLiveStats, 6000);
}

function updateLiveStats() {
  if (!liveStatsEl) return;
  const metrics = state.metrics;
  if (!metrics) {
    const totalProducts = state.products.length;
    const totalCategories = state.categories.length;
    liveStatsEl.innerHTML = `
      <div class="stat-chip">
        <strong>${totalProducts}</strong>
        <span>Sản phẩm đang sẵn sàng</span>
      </div>
      <div class="stat-chip">
        <strong>${totalCategories}</strong>
        <span>Danh mục linh hoạt</span>
      </div>
    `;
    return;
  }
  liveStatsEl.innerHTML = `
    <div class="stat-chip">
      <strong>${metrics.users}</strong>
      <span>Người dùng đã tham gia</span>
    </div>
    <div class="stat-chip">
      <strong>${metrics.products}</strong>
      <span>Sản phẩm đang hoạt động</span>
    </div>
    <div class="stat-chip">
      <strong>${metrics.orders}</strong>
      <span>Đơn hàng ghi nhận</span>
    </div>
    <div class="stat-chip">
      <strong>${formatCurrency(metrics.revenue)}</strong>
      <span>Doanh thu cục bộ</span>
    </div>
  `;
}

bootstrap().catch((err) => {
  console.error("Không thể khởi tạo ứng dụng", err);
});
