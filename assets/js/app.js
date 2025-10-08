codex/create-e-commerce-website-with-advanced-features-aiees3
const API_BASE = (() => {
  if (window.NOVAWAVE_API) return `${window.NOVAWAVE_API.replace(/\/$/, "")}`;
  if (window.location.origin.startsWith("http")) {
    return `${window.location.origin}/api`;
  }
  return "http://localhost:8000/api";
})();

const STORAGE_TOKEN = "novaWaveToken";
const STORAGE_CART = "novaWaveCart";


const DB_KEY = "novaWaveDB";
const ADMIN_KEY = "NEBULA";
main
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
codex/create-e-commerce-website-with-advanced-features-aiees3
const categoryGrid = document.getElementById("category-grid");
const sortSelect = document.getElementById("sort-select");
const searchInput = document.getElementById("search-input");
const navButtons = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view");

const navButtons = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view");
const categoryGrid = document.getElementById("category-grid");
const sortSelect = document.getElementById("sort-select");
const searchInput = document.getElementById("search-input");
main
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
codex/create-e-commerce-website-with-advanced-features-aiees3

const authSubmit = document.getElementById("auth-submit");
main
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
codex/create-e-commerce-website-with-advanced-features-aiees3

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

const cartCountUpdate = (count) => cartBtn.setAttribute("data-count", count);

const defaultData = {
  users: [
    {
      id: crypto.randomUUID(),
      name: "Nova Admin",
      email: "admin@novawave.vn",
      password: btoa("admin123"),
      role: "admin",
      createdAt: Date.now(),
    },
  ],
  products: [
    {
      id: crypto.randomUUID(),
      name: "AeroPulse Tai nghe AR",
      category: "Công nghệ",
      price: 2599000,
      description: "Tai nghe không dây phủ AR, cách âm chủ động và tương tác cảm biến chuyển động.",
      image:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
      popularity: 98,
      createdAt: Date.now() - 86400000,
    },
    {
      id: crypto.randomUUID(),
      name: "LunaFibre Áo khoác phản quang",
      category: "Thời trang",
      price: 1899000,
      description: "Chất liệu nano giữ nhiệt, đổi màu theo ánh sáng và hiển thị thông báo thông minh.",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      popularity: 88,
      createdAt: Date.now() - 172800000,
    },
    {
      id: crypto.randomUUID(),
      name: "NebulaBoard Bàn phím hologram",
      category: "Thiết bị",
      price: 3299000,
      description: "Bàn phím cảm ứng không khung với hiệu ứng hologram và phản hồi haptic",
      image:
        "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?auto=format&fit=crop&w=800&q=80",
      popularity: 95,
      createdAt: Date.now() - 43200000,
    },
    {
      id: crypto.randomUUID(),
      name: "FluxStep Giày tự điều chỉnh",
      category: "Thời trang",
      price: 1499000,
      description: "Giày sneaker với đệm khí thông minh và cảm biến phân tích bước chân realtime.",
      image:
        "https://images.unsplash.com/photo-1542293787938-4d2226df1672?auto=format&fit=crop&w=800&q=80",
      popularity: 82,
      createdAt: Date.now() - 10800000,
    },
    {
      id: crypto.randomUUID(),
      name: "HelioBrew Máy pha cà phê AI",
      category: "Gia dụng",
      price: 2799000,
      description: "Pha chế theo khẩu vị cá nhân bằng phân tích hương vị và nhiệt độ chính xác.",
      image:
        "https://images.unsplash.com/photo-1507914372361-74f3f90d4d1a?auto=format&fit=crop&w=800&q=80",
      popularity: 91,
      createdAt: Date.now() - 64000000,
    },
  ],
  orders: [],
  cart: [],
  session: null,
  featureToggles: {
    hologramCards: true,
    waveMotion: true,
    glowHighlights: true,
    autoRecommendations: true,
  },
  payment: {
    status: "online",
    announcement: "Thanh toán PayPal giảm 10% hôm nay!",
  },
};

function loadDB() {
  try {
    const data = JSON.parse(localStorage.getItem(DB_KEY));
    if (!data) throw new Error("No data");
    return data;
  } catch (error) {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
    return structuredClone(defaultData);
  }
}

let db = loadDB();

function persist() {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function formatCurrency(value) {
  return value.toLocaleString("vi-VN", {
main
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
}

codex/create-e-commerce-website-with-advanced-features-aiees3
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

function setView(viewId) {
  views.forEach((view) => view.classList.toggle("active", view.id === viewId));
  navButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.view === viewId));
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => setView(btn.dataset.view));
});

function renderCategories() {
  const categories = db.products.reduce((acc, product) => {
    const entry = acc.get(product.category) ?? { name: product.category, count: 0 };
    entry.count += 1;
    acc.set(product.category, entry);
    return acc;
  }, new Map());

  categoryGrid.innerHTML = "";
  for (const { name, count } of categories.values()) {
    const card = document.createElement("article");
    card.className = "category-card";
    card.innerHTML = `
      <h4>${name}</h4>
      <p>${count} sản phẩm đang hoạt động · Đồng bộ thời gian thực</p>
    `;
    card.addEventListener("click", () => {
      searchInput.value = name;
      renderProducts();
      setView("market");
      productGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    categoryGrid.append(card);
  }
}

function sortProducts(products) {
  const value = sortSelect.value;
  const sorted = [...products];
  switch (value) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sorted.sort((a, b) => b.createdAt - a.createdAt);
      break;
    default:
      sorted.sort((a, b) => b.popularity - a.popularity);
  }
  return sorted;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = db.products.filter((product) => {
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  const products = sortProducts(filtered);
  productGrid.innerHTML = "";

  if (!products.length) {
    productGrid.innerHTML = `<p>Không tìm thấy sản phẩm phù hợp.</p>`;
    return;
  }

  products.forEach((product) => {
    const card = productCardTemplate.content.firstElementChild.cloneNode(true);
    const imageEl = card.querySelector(".product-image");
    const titleEl = card.querySelector(".product-title");
    const descEl = card.querySelector(".product-description");
    const categoryEl = card.querySelector(".product-category");
    const priceEl = card.querySelector(".product-price");
    const addCartBtn = card.querySelector(".add-cart-btn");
    const editBtn = card.querySelector(".edit-btn");

    imageEl.src = product.image;
    imageEl.alt = product.name;
    titleEl.textContent = product.name;
    descEl.textContent = product.description;
    categoryEl.textContent = product.category;
    priceEl.textContent = formatCurrency(product.price);

    addCartBtn.addEventListener("click", () => addToCart(product.id));

    if (currentUser?.role === "admin") {
      editBtn.hidden = false;
      editBtn.addEventListener("click", () => populateProductForm(product));
    }

    productGrid.append(card);
  });
}

function addToCart(productId) {
  const existing = db.cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    db.cart.push({ productId, quantity: 1 });
  }
  persist();
  updateCartUI();
  cartDrawer.classList.add("open");
}

function updateCartUI() {
  cartItemsEl.innerHTML = "";
  let subtotal = 0;
  db.cart.forEach((item) => {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product) return;

    const cartItem = cartItemTemplate.content.firstElementChild.cloneNode(true);
    cartItem.querySelector(".item-title").textContent = product.name;
    cartItem.querySelector(".item-meta").textContent = `${item.quantity} x ${formatCurrency(
      product.price
    )}`;
    cartItem.querySelector(".item-quantity").textContent = item.quantity;
    cartItem.querySelector(".item-price").textContent = formatCurrency(product.price * item.quantity);

    cartItem.querySelector(".decrease").addEventListener("click", () => updateQuantity(product.id, -1));
    cartItem.querySelector(".increase").addEventListener("click", () => updateQuantity(product.id, 1));

    cartItemsEl.append(cartItem);
    subtotal += product.price * item.quantity;
  });

  cartSubtotalEl.textContent = formatCurrency(subtotal);
  cartTotalEl.textContent = formatCurrency(subtotal);
  cartCountUpdate(db.cart.reduce((sum, item) => sum + item.quantity, 0));

  if (!db.cart.length) {
    cartItemsEl.innerHTML = `<p>Giỏ hàng đang trống. Hãy thêm sản phẩm để bắt đầu hành trình mua sắm.</p>`;
  }
}

function updateQuantity(productId, delta) {
  const item = db.cart.find((cartItem) => cartItem.productId === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    db.cart = db.cart.filter((cartItem) => cartItem.productId !== productId);
  }
  persist();
  updateCartUI();
}

function addOrder(order) {
  db.orders.unshift(order);
  persist();
  renderOrders();
}

function renderOrders() {
  orderTimeline.innerHTML = "";
  if (!db.session) {
    orderTimeline.innerHTML = `<p>Đăng nhập để đồng bộ và xem lịch sử giao dịch.</p>`;
    return;
  }

  const userOrders = db.orders.filter((order) => order.userId === db.session.userId);
  if (!userOrders.length) {
    orderTimeline.innerHTML = `<p>Bạn chưa có giao dịch nào. Bắt đầu ngay hôm nay!</p>`;
    return;
  }

  userOrders.forEach((order) => {
    const entry = orderTemplate.content.firstElementChild.cloneNode(true);
    entry.querySelector(".order-id").textContent = `Đơn #${order.id.slice(0, 6).toUpperCase()}`;
    entry.querySelector(".order-date").textContent = new Date(order.createdAt).toLocaleString("vi-VN");
    entry.querySelector(".order-body").textContent = order.items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");
    entry.querySelector(".order-total").textContent = formatCurrency(order.total);
    entry.querySelector(".order-method").textContent = `Thanh toán: ${order.paymentMethod}`;
    entry.querySelector(".order-status").textContent = order.status;
    orderTimeline.append(entry);
  });
}

function clearAuthForm() {
  authForm.reset();
  authMessage.textContent = "";
}

let authMode = "login";
let currentUser = db.session
  ? db.users.find((user) => user.id === db.session.userId) ?? null
  : null;

function updateAuthUI() {
  currentUser = db.session ? db.users.find((user) => user.id === db.session.userId) ?? null : null;
  if (currentUser) {
    userPill.hidden = false;
    userNameEl.textContent = currentUser.name || currentUser.email;
    loginBtn.hidden = true;
    registerBtn.hidden = true;
    adminNavBtn.hidden = currentUser.role !== "admin";
  } else {
    userPill.hidden = true;
    loginBtn.hidden = false;
    registerBtn.hidden = false;
    adminNavBtn.hidden = true;
  }
  renderProducts();
  renderOrders();
}

function switchAuthMode(mode) {
  authMode = mode;
  authTitle.textContent = mode === "login" ? "Đăng nhập" : "Đăng ký";
  registerOnly.style.display = mode === "register" ? "grid" : "none";
  authSubmit.textContent = mode === "login" ? "Đăng nhập" : "Tạo tài khoản";
  clearAuthForm();
  authModal.showModal();
}

loginBtn.addEventListener("click", () => switchAuthMode("login"));
registerBtn.addEventListener("click", () => switchAuthMode("register"));

logoutBtn.addEventListener("click", () => {
  db.session = null;
  persist();
  updateAuthUI();
  setView("market");
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = authEmail.value.trim().toLowerCase();
  const password = authPassword.value;

  if (authMode === "login") {
    const user = db.users.find((u) => u.email === email && u.password === btoa(password));
    if (!user) {
      authMessage.textContent = "Thông tin đăng nhập không hợp lệ.";
      return;
    }
    db.session = { userId: user.id, lastLogin: Date.now() };
    persist();
    updateAuthUI();
    authModal.close();
  } else {
    if (!authName.value.trim()) {
      authMessage.textContent = "Vui lòng nhập họ tên.";
      return;
    }
    if (db.users.some((user) => user.email === email)) {
      authMessage.textContent = "Email đã tồn tại.";
      return;
    }
    const role = authAdminKey.value.trim() === ADMIN_KEY ? "admin" : "user";
    const newUser = {
      id: crypto.randomUUID(),
      name: authName.value.trim(),
      email,
      password: btoa(password),
      role,
      createdAt: Date.now(),
    };
    db.users.push(newUser);
    db.session = { userId: newUser.id, lastLogin: Date.now() };
    persist();
    updateAuthUI();
    authModal.close();
  }
});

authModal.addEventListener("close", clearAuthForm);

function populateProductForm(product) {
main
  productIdInput.value = product.id;
  productNameInput.value = product.name;
  productCategoryInput.value = product.category;
  productPriceInput.value = product.price;
  productDescriptionInput.value = product.description;
codex/create-e-commerce-website-with-advanced-features-aiees3
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

  productImageInput.value = product.image;
  setView("admin");
  productNameInput.focus();
}

productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentUser || currentUser.role !== "admin") {
    alert("Chỉ admin mới có thể chỉnh sửa sản phẩm.");
    return;
  }
  const id = productIdInput.value || crypto.randomUUID();
  const product = {
    id,
main
    name: productNameInput.value.trim(),
    category: productCategoryInput.value.trim(),
    price: Number(productPriceInput.value),
    description: productDescriptionInput.value.trim(),
codex/create-e-commerce-website-with-advanced-features-aiees3
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

    image: productImageInput.value.trim(),
    popularity: productIdInput.value ? db.products.find((p) => p.id === id)?.popularity ?? 50 : 50,
    createdAt: productIdInput.value
      ? db.products.find((p) => p.id === id)?.createdAt ?? Date.now()
      : Date.now(),
  };

  const existingIndex = db.products.findIndex((p) => p.id === id);
  if (existingIndex >= 0) {
    db.products[existingIndex] = product;
  } else {
    db.products.push(product);
  }
  persist();
  renderProducts();
  renderCategories();
  productForm.reset();
  productIdInput.value = "";
});

resetProductBtn.addEventListener("click", () => {
  productForm.reset();
  productIdInput.value = "";
});

function renderToggles() {
  featureTogglesEl.innerHTML = "";
  Object.entries(db.featureToggles).forEach(([key, value]) => {
    const item = document.createElement("div");
    item.className = "toggle-item";
    item.innerHTML = `
      <label>
        <strong>${toggleLabels[key]}</strong>
        <span>${toggleDescriptions[key]}</span>
      </label>
      <label class="switch">
        <input type="checkbox" ${value ? "checked" : ""} data-key="${key}" />
        <span class="slider"></span>
      </label>
    `;
    featureTogglesEl.append(item);
  });

  featureTogglesEl.querySelectorAll("input[type=checkbox]").forEach((input) => {
    input.addEventListener("change", () => {
      const key = input.dataset.key;
      db.featureToggles[key] = input.checked;
      persist();
      applyFeatureToggles();
    });
  });
}

const toggleLabels = {
  hologramCards: "Hologram card",
  waveMotion: "Hiệu ứng làn sóng",
  glowHighlights: "Viền ánh sáng",
  autoRecommendations: "Đề xuất tức thời",
};

const toggleDescriptions = {
  hologramCards: "Hiệu ứng hologram 3D cho thẻ sản phẩm",
  waveMotion: "Chuyển động mượt mà cho các thao tác nhấp",
  glowHighlights: "Viền phát sáng khi di chuột",
  autoRecommendations: "Tự động gợi ý sản phẩm theo hành vi",
};

function applyFeatureToggles() {
  document.body.classList.toggle("no-wave", !db.featureToggles.waveMotion);
  document.body.classList.toggle("no-glow", !db.featureToggles.glowHighlights);
  productGrid.classList.toggle("hologram-off", !db.featureToggles.hologramCards);
}

paymentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentUser || currentUser.role !== "admin") {
    alert("Chỉ admin mới có thể thay đổi cấu hình thanh toán.");
    return;
  }
  db.payment.status = paymentStatusSelect.value;
  db.payment.announcement = paymentAnnouncementInput.value.trim();
  persist();
  renderPaymentStatus();
});

function renderPaymentStatus() {
  paymentStatusSelect.value = db.payment.status;
  paymentAnnouncementInput.value = db.payment.announcement;
  const statusMap = {
    online: "Mọi cổng thanh toán PayPal, Visa, chuyển khoản và tiền mặt đang hoạt động ổn định.",
    maintenance: "Hệ thống đang bảo trì. Một số phương thức có thể tạm dừng trong giây lát.",
  };
  paymentIntegrationEl.innerHTML = `
    <strong>Trạng thái: ${db.payment.status === "online" ? "Online" : "Bảo trì"}</strong>
    <p>${statusMap[db.payment.status]}</p>
    ${db.payment.announcement ? `<p>• ${db.payment.announcement}</p>` : ""}
    <p>Kết nối chặt chẽ với PayPal, Visa/Mastercard, chuyển khoản ngân hàng và COD.</p>
  `;
}

function handleCheckout() {
  if (!db.session) {
    alert("Vui lòng đăng nhập để thanh toán.");
    return;
  }
  if (!db.cart.length) {
    alert("Giỏ hàng rỗng");
    return;
  }
  const paymentMethod = document.querySelector("input[name=payment-method]:checked").value;
  const items = db.cart.map((item) => {
    const product = db.products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      quantity: item.quantity,
      name: product?.name ?? "Sản phẩm",
      price: product?.price ?? 0,
    };
  });
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const newOrder = {
    id: crypto.randomUUID(),
    userId: db.session.userId,
    items,
    total,
    paymentMethod,
    status: "Đang xử lý AI",
    createdAt: Date.now(),
  };
  addOrder(newOrder);
  db.cart = [];
  persist();
  updateCartUI();
  cartDrawer.classList.remove("open");
  alert("Đơn hàng của bạn đã được ghi nhận và đồng bộ cục bộ.");
}

checkoutBtn.addEventListener("click", handleCheckout);

cartBtn.addEventListener("click", () => cartDrawer.classList.add("open"));
closeCartBtn.addEventListener("click", () => cartDrawer.classList.remove("open"));

heroScrollButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.scroll;
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  });
});

function updateLiveStats() {
  const totalUsers = db.users.length;
  const totalOrders = db.orders.length;
  const totalVolume = db.orders.reduce((sum, order) => sum + order.total, 0);
  const highlightProduct = db.products[Math.floor(Math.random() * db.products.length)];
  liveStatsEl.innerHTML = `
    <span>🌐 ${totalUsers} tài khoản được đồng bộ bảo mật.</span>
    <span>🛒 ${totalOrders} giao dịch đã hoàn thành.</span>
    <span>💸 Doanh thu: ${formatCurrency(totalVolume)}</span>
    <span>✨ Nổi bật: ${highlightProduct?.name ?? "Đang tải"}</span>
  `;
}

function updateOrbitingCard() {
  const product = db.products[Math.floor(Math.random() * db.products.length)];
  if (!product) return;
  orbitingCard.innerHTML = `
    <h5>Đề xuất AI</h5>
    <strong>${product.name}</strong>
    <p>${product.description}</p>
    <span>${formatCurrency(product.price)}</span>
  `;
}

setInterval(updateLiveStats, 6000);
setInterval(updateOrbitingCard, 5000);

searchInput.addEventListener("input", () => {
  renderProducts();
});

sortSelect.addEventListener("change", () => {
  renderProducts();
});

function ensureAdminNavVisibility() {
  if (currentUser?.role === "admin") {
    adminNavBtn.hidden = false;
  } else {
    adminNavBtn.hidden = true;
    if (document.getElementById("admin").classList.contains("active")) {
      setView("market");
    }
  }
}

adminNavBtn.addEventListener("click", () => {
  if (currentUser?.role === "admin") {
    setView("admin");
  }
});

function init() {
  renderCategories();
  renderProducts();
  updateCartUI();
  renderOrders();
  renderToggles();
  renderPaymentStatus();
  updateAuthUI();
  updateLiveStats();
  updateOrbitingCard();
  ensureAdminNavVisibility();
}

init();

window.addEventListener("storage", (event) => {
  if (event.key === DB_KEY) {
    db = loadDB();
    updateAuthUI();
    updateCartUI();
    renderCategories();
    renderProducts();
    renderOrders();
    renderToggles();
    renderPaymentStatus();
    updateLiveStats();
  }
});

window.addEventListener("click", (event) => {
  if (!db.featureToggles.waveMotion) return;
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;
  document.body.append(ripple);
  setTimeout(() => ripple.remove(), 800);
main
});
