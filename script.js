let products = [
  { id: 1, name: "蘋果", quantity: "6包", price: 100, image: "images/product1.jpg" },
  { id: 2, name: "調味料", quantity: "300g", price: 50, image: "images/product1.jpg" },
  { id: 3, name: "泡麵", quantity: "6包", price: 100, image: "images/product1.jpg" },
  { id: 4, name: "泡麵", quantity: "6包", price: 100, image: "images/product1.jpg" },
];
let cart = [];

// 從 localStorage 載入購物車資料
function loadCartFromStorage() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
  updateCartCount();
}

// 將購物車資料儲存到 localStorage
function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("視窗寬度:", window.innerWidth);
  // 載入購物車資料
  loadCartFromStorage();
  // 檢查管理員是否已登入
  if (localStorage.getItem("adminLoggedIn")) {
    showAdminOrdersPage();
  } else {
    // 初次載入時顯示產品頁面
    renderProducts();
    showMenuPage();
  }
  initializeApp();

  // 綁定管理員登入表單
  const adminLoginForm = document.getElementById("adminログイン-form");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("admin-username").value;
      const password = document.getElementById("admin-password").value;

      try {
        const response = await fetch("https://your-line-webhook-app-4d2cb4d3dfa4.herokuapp.com/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "登入失敗");
        localStorage.setItem("adminLoggedIn", "true");
        showAdminOrdersPage();
      } catch (err) {
        alert(`管理員登入失敗：${err.message}`);
      }
    });
  } else {
    console.error("找不到 admin-login-form 元素");
  }
});

function initializeApp() {
  liff.init({ liffId: "2007147358-gA92Lq1a" })
    .then(() => {
      console.log("LIFF 初始化成功");
      // 檢查是否已登入，如果未登入則強制登入
      if (!liff.isLoggedIn()) {
        console.log("用戶未登入，調用 liff.login()");
        liff.login();
        return;
      }
      console.log("用戶已登入，渲染產品頁面");
      // 確保在 LIFF 登入後重新渲染產品頁面，但不影響 header-container
      renderProducts();
      showMenuPage();
    })
    .catch(err => {
      console.error("LIFF 初始化失敗：", err);
      alert("無法初始化應用，請稍後再試！");
      renderProducts();
      showMenuPage();
    });
}

function renderProducts() {
  console.log("開始渲染產品列表");
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) {
    console.error("找不到 product-grid 元素");
    return;
  }
  productGrid.innerHTML = "";
  productGrid.classList.add("row");

  products.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-3 mb-3";

    const card = document.createElement("div");
    card.className = "product-card card h-100 shadow-sm";

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.className = "loading card-img-top";
    img.onload = () => { img.classList.remove("loading"); img.classList.add("loaded"); };
    img.onerror = () => { console.error(`圖片載入失敗: ${product.image}`); img.src = "images/product1.jpg"; };
    imageContainer.appendChild(img);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-column";

    const name = document.createElement("div");
    name.className = "product-name card-title text-center";
    name.textContent = product.name;

    const spec = document.createElement("div");
    spec.className = "product-spec card-text text-muted text-center";
    spec.textContent = product.quantity;

    const price = document.createElement("div");
    price.className = "price card-text text-danger text-center fw-bold";
    price.textContent = `NT$${product.price}`;

    const quantitySelector = document.createElement("div");
    quantitySelector.className = "quantity-selector d-flex justify-content-center align-items-center my-2";

    const minusBtn = document.createElement("button");
    minusBtn.className = "btn btn-outline-secondary btn-sm";
    minusBtn.textContent = "-";
    minusBtn.onclick = () => changeQuantity(product.id, -1);

    const quantityInput = document.createElement("input");
    quantityInput.type = "text";
    quantityInput.id = `quantity-${product.id}`;
    quantityInput.value = "1";
    quantityInput.readOnly = true;
    quantityInput.className = "form-control form-control-sm mx-2 text-center";
    quantityInput.style.width = "50px";

    const plusBtn = document.createElement("button");
    plusBtn.className = "btn btn-outline-secondary btn-sm";
    plusBtn.textContent = "+";
    plusBtn.onclick = () => changeQuantity(product.id, 1);

    quantitySelector.append(minusBtn, quantityInput, plusBtn);

    const addBtn = document.createElement("button");
    addBtn.className = "btn btn-warning add-to-cart mt-auto w-100";
    addBtn.textContent = "加入購物車";
    addBtn.onclick = () => addToCart(product.id);

    cardBody.append(name, spec, price, quantitySelector, addBtn);
    card.append(imageContainer, cardBody);
    col.appendChild(card);
    productGrid.appendChild(col);
  });
  console.log("產品列表渲染完成");

  // 檢查 header-container 是否仍然存在
  const headerContainer = document.querySelector(".header-container");
  if (headerContainer) {
    console.log("header-container 存在，檢查 cart icon");
    const cartIcon = headerContainer.querySelector(".cart-icon");
    if (cartIcon) {
      console.log("cart icon 存在");
      cartIcon.style.display = "block"; // 確保顯示
    } else {
      console.error("cart icon 不存在");
    }
  } else {
    console.error("header-container 不存在");
  }
}

function changeQuantity(productId, change) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  if (!quantityInput) {
    console.error(`找不到 quantity-${productId} 元素`);
    return;
  }
  let quantity = parseInt(quantityInput.value);
  quantity = Math.max(1, quantity + change);
  quantityInput.value = quantity;
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    alert("找不到該產品！");
    return;
  }
  const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
  const cartItem = { id: product.id, name: product.name, price: product.price, quantity };

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push(cartItem);
  }

  updateCartCount();
  saveCartToStorage(); // 儲存購物車資料

  const modalMessage = document.getElementById("cartModalMessage");
  if (modalMessage) {
    modalMessage.textContent = `${product.name} 已加入購物車！`;
    const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
    cartModal.show();
  } else {
    console.error("找不到 cartModalMessage 元素");
  }
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  } else {
    console.error("找不到 cart-count 元素");
  }
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  if (!cartItems) {
    console.error("找不到 cart-items 元素");
    return;
  }
  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item d-flex justify-content-between align-items-center p-2 border-bottom";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = item.name;
    nameSpan.className = "flex-2";

    const quantitySpan = document.createElement("span");
    quantitySpan.textContent = `數量: ${item.quantity}`;
    quantitySpan.className = "flex-1 text-center";

    const priceSpan = document.createElement("span");
    priceSpan.textContent = `NT$${item.price * item.quantity}`;
    priceSpan.className = "flex-1 text-end fw-bold";

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger btn-sm";
    removeBtn.textContent = "移除";
    removeBtn.onclick = () => removeFromCart(index);

    itemDiv.append(nameSpan, quantitySpan, priceSpan, removeBtn);
    cartItems.appendChild(itemDiv);
  });

  // 計算並顯示總金額
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiv = document.createElement("div");
  totalDiv.className = "total-amount";
  totalDiv.textContent = `總金額: NT$${totalAmount}`;
  cartItems.appendChild(totalDiv);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  saveCartToStorage(); // 儲存購物車資料
  renderCart();
}

function showMenuPage() {
  console.log("顯示產品頁面");
  const menuPage = document.getElementById("menu-page");
  const cartPage = document.getElementById("cart-page");
  const thankYouPage = document.getElementById("thank-you-page");
  const adminLoginPage = document.getElementById("admin-login-page");
  const adminOrdersPage = document.getElementById("admin-orders-page");

  if (menuPage) menuPage.style.display = "block";
  if (cartPage) cartPage.style.display = "none";
  if (thankYouPage) thankYouPage.style.display = "none";
  if (adminLoginPage) adminLoginPage.style.display = "none";
  if (adminOrdersPage) adminOrdersPage.style.display = "none";

  // 動態創建「產品列表」按鈕
  const headerTitle = document.getElementById("header-title");
  if (headerTitle) {
    headerTitle.innerHTML = ""; // 清空容器
    const titleButton = document.createElement("button");
    titleButton.textContent = "產品列表";
    headerTitle.appendChild(titleButton);

    // 使用 DOM 事件監聽器綁定點擊事件
    titleButton.addEventListener("click", function () {
      console.log("點擊產品列表按鈕，進入管理員登入頁面");
      showAdminLoginPage();
    });
  } else {
    console.error("找不到 header-title 元素");
  }

  // 確保 header-container 內的 cart icon 可見
  const headerContainer = document.querySelector(".header-container");
  if (headerContainer) {
    const cartIcon = headerContainer.querySelector(".cart-icon");
    if (cartIcon) {
      cartIcon.style.display = "block";
      console.log("cart icon 已設為可見");
    } else {
      console.error("找不到 cart icon");
    }
  } else {
    console.error("找不到 header-container");
  }
}

async function showCartPage() {
  if (cart.length === 0) {
    alert("購物車是空的！");
    return;
  }

  try {
    // 檢查是否在 LINE 客戶端中
    if (!liff.isInClient()) {
      throw new Error("請在 LINE 應用中打開此頁面！");
    }

    // 檢查是否已登入
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    // 檢查是否為好友
    const friendship = await liff.getFriendship();
    if (!friendship.friendFlag) {
      // 如果不是好友，顯示加好友提示
      const addFriendModal = new bootstrap.Modal(document.getElementById("addFriendModal"));
      addFriendModal.show();
      return; // 中斷進入購物車
    }

    // 如果是好友，進入購物車頁面
    const menuPage = document.getElementById("menu-page");
    const cartPage = document.getElementById("cart-page");
    const thankYouPage = document.getElementById("thank-you-page");
    const adminLoginPage = document.getElementById("admin-login-page");
    const adminOrdersPage = document.getElementById("admin-orders-page");

    if (menuPage) menuPage.style.display = "none";
    if (cartPage) cartPage.style.display = "block";
    if (thankYouPage) thankYouPage.style.display = "none";
    if (adminLoginPage) adminLoginPage.style.display = "none";
    if (adminOrdersPage) adminOrdersPage.style.display = "none";
    renderCart();
  } catch (err) {
    console.error("檢查好友狀態失敗:", err);
    alert(`錯誤：${err.message}。請稍後再試！`);
  }
}

function showThankYouPage() {
  const menuPage = document.getElementById("menu-page");
  const cartPage = document.getElementById("cart-page");
  const thankYouPage = document.getElementById("thank-you-page");
  const adminLoginPage = document.getElementById("admin-login-page");
  const adminOrdersPage = document.getElementById("admin-orders-page");

  if (menuPage) menuPage.style.display = "none";
  if (cartPage) cartPage.style.display = "none";
  if (thankYouPage) thankYouPage.style.display = "block";
  if (adminLoginPage) adminLoginPage.style.display = "none";
  if (adminOrdersPage) adminOrdersPage.style.display = "none";
  // 自動關閉 LIFF 應用
  setTimeout(() => {
    closeLIFF();
  }, 2000); // 2 秒後自動關閉
}

function showAdminLoginPage() {
  const menuPage = document.getElementById("menu-page");
  const cartPage = document.getElementById("cart-page");
  const thankYouPage = document.getElementById("thank-you-page");
  const adminLoginPage = document.getElementById("admin-login-page");
  const adminOrdersPage = document.getElementById("admin-orders-page");

  if (menuPage) menuPage.style.display = "none";
  if (cartPage) cartPage.style.display = "none";
  if (thankYouPage) thankYouPage.style.display = "none";
  if (adminLoginPage) adminLoginPage.style.display = "block";
  if (adminOrdersPage) adminOrdersPage.style.display = "none";
}

async function showAdminOrdersPage() {
  const menuPage = document.getElementById("menu-page");
  const cartPage = document.getElementById("cart-page");
  const thankYouPage = document.getElementById("thank-you-page");
  const adminLoginPage = document.getElementById("admin-login-page");
  const adminOrdersPage = document.getElementById("admin-orders-page");

  if (menuPage) menuPage.style.display = "none";
  if (cartPage) cartPage.style.display = "none";
  if (thankYouPage) thankYouPage.style.display = "none";
  if (adminLoginPage) adminLoginPage.style.display = "none";
  if (adminOrdersPage) adminOrdersPage.style.display = "block";
  await loadOrders();
}

function validateForm() {
  const recipient = document.getElementById("recipient")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const location = document.getElementById("location")?.value.trim();

  if (!recipient || !phone || !location) {
    return false;
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    alert("請輸入有效的電話號碼（10 位數字）！");
    return false;
  }

  return true;
}

function showLoading() {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) loadingElement.style.display = "block";
}

function hideLoading() {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) loadingElement.style.display = "none";
}

async function submitOrder() {
  if (cart.length === 0) {
    alert("購物車是空的！");
    return;
  }

  if (!validateForm()) {
    alert("請正確填寫所有必填欄位！");
    return;
  }

  showLoading();
  const submitButton = document.querySelector(".submit-order");
  if (submitButton) submitButton.disabled = true;

  try {
    // 檢查是否在 LINE 客戶端中
    if (!liff.isInClient()) {
      throw new Error("請在 LINE 應用中打開此頁面！");
    }

    // 檢查是否已登入
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    // 生成訂單編號
    const now = new Date();
    const yearPrefix = "AAD"; // 114年對應 AAD
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const randomCode = Math.floor(1000 + Math.random() * 9000); // 4 位亂碼
    const orderNumber = `${yearPrefix}-${hours}${minutes}${randomCode}`; // 例如 AAD-17300001

    // 提交訂單
    const userProfile = await liff.getProfile();
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderData = {
      userId: userProfile.userId,
      lineName: userProfile.displayName, // 顧客 LINE 名稱
      orderDetails: cart.map(item => `${item.name} x${item.quantity} NT$${item.price * item.quantity}`).join("\n"),
      totalAmount,
      orderNumber,
      recipient: document.getElementById("recipient").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      location: document.getElementById("location").value.trim(),
      notes: document.getElementById("notes").value,
      itemCount: cart.length, // 品項數量
      paymentStatus: "未付款", // 預設付款狀態
      orderDate: now.toISOString(), // 訂單日期
    };

    const response = await fetch("https://your-line-webhook-app-4d2cb4d3dfa4.herokuapp.com/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "訂單提交失敗");

    console.log("訂單提交成功:", result);
    cart = [];
    updateCartCount();
    saveCartToStorage(); // 清空購物車並儲存
    showThankYouPage();
  } catch (err) {
    console.error("訂單提交失敗:", err);
    alert(`訂單提交失敗：${err.message}。請稍後再試！`);
  } finally {
    hideLoading();
    if (submitButton) submitButton.disabled = false;
  }
}

// 加好友函數
function addFriend() {
  // 替換為你的 LINE 官方帳號加好友連結
  const officialAccountLink = "https://line.me/R/ti/p/@your-official-account-id";
  liff.openWindow({
    url: officialAccountLink,
    external: true,
  });
  // 關閉 LIFF 應用
  setTimeout(() => {
    closeLIFF();
  }, 1000); // 1 秒後關閉
}

// 關閉 LIFF 應用
function closeLIFF() {
  liff.closeWindow();
}

// 載入訂單
async function loadOrders() {
  try {
    const response = await fetch("https://your-line-webhook-app-4d2cb4d3dfa4.herokuapp.com/orders");
    const orders = await response.json();
    const table = document.getElementById("orders-table");
    if (table) {
      $(table).bootstrapTable("destroy").bootstrapTable({
        data: orders.map(order => ({
          select: "",
          orderDate: new Date(order.orderDate).toLocaleString("zh-TW", { dateStyle: "short", timeStyle: "short" }),
          orderNumber: order.orderNumber,
          lineName: order.lineName,
          recipient: order.recipient,
          totalAmount: `NT$${order.totalAmount}`,
          itemCount: order.itemCount,
          paymentStatus: order.paymentStatus,
        })),
      });
    } else {
      console.error("找不到 orders-table 元素");
    }
  } catch (err) {
    alert(`載入訂單失敗：${err.message}`);
  }
}

// 管理員登出
function adminLogout() {
  localStorage.removeItem("adminLoggedIn");
  showMenuPage();
}