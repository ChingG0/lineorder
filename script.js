let products = [
  { id: 1, name: "蘋果", quantity: "6包", price: 100, image: "images/product1.jpg" },
  { id: 2, name: "調味料", quantity: "300g", price: 50, image: "images/product1.jpg" },
  { id: 3, name: "泡麵", quantity: "6包", price: 100, image: "images/product1.jpg" },
  { id: 4, name: "泡麵", quantity: "6包", price: 100, image: "images/product1.jpg" },
];
let cart = [];

document.addEventListener("DOMContentLoaded", function () {
  console.log("視窗寬度:", window.innerWidth);
  initializeApp();
});

function initializeApp() {
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

function renderProducts() {
  const productGrid = document.getElementById("product-grid");
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
}

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
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
}

function showMenuPage() {
  document.getElementById("menu-page").style.display = "block";
  document.getElementById("cart-page").style.display = "none";
  document.getElementById("thank-you-page").style.display = "none";
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
      throw new Error("請先登入 LINE！");
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
    document.getElementById("menu-page").style.display = "none";
    document.getElementById("cart-page").style.display = "block";
    document.getElementById("thank-you-page").style.display = "none";
    renderCart();
  } catch (err) {
    console.error("檢查好友狀態失敗:", err);
    alert(`錯誤：${err.message}。請稍後再試！`);
  }
}

function showThankYouPage() {
  document.getElementById("menu-page").style.display = "none";
  document.getElementById("cart-page").style.display = "none";
  document.getElementById("thank-you-page").style.display = "block";
}

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
  submitButton.disabled = true;

  try {
    // 檢查是否在 LINE 客戶端中
    if (!liff.isInClient()) {
      throw new Error("請在 LINE 應用中打開此頁面！");
    }

    // 檢查是否已登入
    if (!liff.isLoggedIn()) {
      throw new Error("請先登入 LINE！");
    }

    // 提交訂單（此處已無需再次檢查好友狀態，因為進入購物車時已檢查）
    const userProfile = await liff.getProfile();
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
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
    cart = [];
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

// 加好友函數
function addFriend() {
  // 替換為你的 LINE 官方帳號加好友連結
  const officialAccountLink = "https://line.me/R/ti/p/@ringofruit";
  liff.openWindow({
    url: officialAccountLink,
    external: true,
  });
}