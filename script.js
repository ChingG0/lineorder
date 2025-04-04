// === 初始化模組 (Initialization Module) ===
let products = [
  { id: 1, name: "蘋果", quantity: "6包", price: 100, image: "images/product1.jpg" },
  { id: 2, name: "調味料", quantity: "300g", price: 50, image: "images/product1.jpg" },
  { id: 3, name: "泡麵", quantity: "6包", price: 100, image: "images/product1.jpg" },
  { id: 4, name: "泡麵", quantity: "6包", price: 100, image: "images/product1.jpg" },
];
let cart = []; // 初始為空，但會從 localStorage 載入

document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  // 從 localStorage 載入購物車資料
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount(); // 初始化時更新購物車數量
  }

  liff.init({ liffId: "2007147358-gA92Lq1a" })
    .then(() => {
      console.log("LIFF 初始化成功");
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

// === 產品載入模組 (Product Loader Module) ===
function renderProducts() {
  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = ""; // 清空現有內容
  productGrid.classList.add("row"); // Bootstrap Grid: 加入 row 類別

  products.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-3 mb-3"; // 2欄 (手機) / 4欄 (桌面)

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
}

// === 購物車模組 (Cart Module) ===
function changeQuantity(productId, change) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
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
  saveCartToStorage(); // 每次加入購物車時儲存

  const modalMessage = document.getElementById("cartModalMessage");
  modalMessage.textContent = `${product.name} 已加入購物車！`;
  const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
  cartModal.show();
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = totalItems;
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = ""; // 清空現有內容

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
    priceSpan.className = "flex-1 text-end fw-bold me-3"; // 添加 me-3 增加右邊距

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger btn-sm";
    removeBtn.textContent = "移除";
    removeBtn.onclick = () => removeFromCart(index);

    itemDiv.append(nameSpan, quantitySpan, priceSpan, removeBtn);
    cartItems.appendChild(itemDiv);
  });

  // 添加總金額
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiv = document.createElement("div");
  totalDiv.className = "cart-total d-flex justify-content-between p-2 fw-bold";
  totalDiv.innerHTML = `<span>總金額</span><span>NT$${totalAmount}</span>`;
  cartItems.appendChild(totalDiv);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  saveCartToStorage(); // 移除時儲存
  renderCart();
}

// === 持久化儲存購物車 ===
function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// === 頁面切換模組 (Page Switch Module) ===
function showMenuPage() {
  document.getElementById("menu-page").style.display = "block";
  document.getElementById("cart-page").style.display = "none";
  document.getElementById("thank-you-page").style.display = "none";
}

function showCartPage() {
  if (cart.length === 0) {
    alert("購物車是空的！");
    return;
  }
  document.getElementById("menu-page").style.display = "none";
  document.getElementById("cart-page").style.display = "block";
  document.getElementById("thank-you-page").style.display = "none";
  renderCart();
}

function showThankYouPage() {
  document.getElementById("menu-page").style.display = "none";
  document.getElementById("cart-page").style.display = "none";
  document.getElementById("thank-you-page").style.display = "block";
}

// === 表單驗證模組 (Form Validation Module) ===
function validateForm() {
  const recipient = document.getElementById("recipient").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value.trim();

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

// === 載入狀態模組 (Loading State Module) ===
function showLoading() {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) loadingElement.style.display = "block";
}

function hideLoading() {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) loadingElement.style.display = "none";
}

// === 訂單模組 (Order Module) ===
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
  submitButton.disabled = true;

  try {
    if (!liff.isInClient() || !liff.isLoggedIn()) {
      throw new Error("請在 LINE 應用中打開此頁面並登入！");
    }

    const userProfile = await liff.getProfile();
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 生成新訂單編號
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4位亂碼 (1000-9999)
    const orderNumber = `AAD${hours}${minutes}${randomNum}`; // 例如 AAD-17300001

    const orderData = {
      userId: userProfile.userId,
      orderDetails: cart.map(item => `${item.name} x${item.quantity} NT$${item.price * item.quantity}`).join("\n"),
      totalAmount,
      orderNumber,
      recipient: document.getElementById("recipient").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      location: document.getElementById("location").value.trim(),
      notes: document.getElementById("notes").value,
    };

    const response = await fetch("https://your-line-webhook-app-4d2cb4d3dfa4.herokuapp.com/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "訂單提交失敗");

    console.log("訂單提交成功:", result);
    cart = []; // 清空購物車
    saveCartToStorage(); // 提交訂單後儲存空的購物車
    updateCartCount();
    showThankYouPage();
  } catch (err) {
    console.error("訂單提交失敗:", err);
    alert(`訂單提交失敗：${err.message}。請稍後再試！`);
  } finally {
    hideLoading();
    submitButton.disabled = false;
  }
}