const DB_KEY = "novaWaveDB";
const ADMIN_KEY = "NEBULA";
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
const navButtons = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view");
const categoryGrid = document.getElementById("category-grid");
const sortSelect = document.getElementById("sort-select");
const searchInput = document.getElementById("search-input");
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
const authSubmit = document.getElementById("auth-submit");
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
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
}

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
  productIdInput.value = product.id;
  productNameInput.value = product.name;
  productCategoryInput.value = product.category;
  productPriceInput.value = product.price;
  productDescriptionInput.value = product.description;
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
    name: productNameInput.value.trim(),
    category: productCategoryInput.value.trim(),
    price: Number(productPriceInput.value),
    description: productDescriptionInput.value.trim(),
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
});
