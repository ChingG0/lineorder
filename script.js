let products = [
  { id: 1, name: "紐西蘭富士蘋果8入", quantity: "原裝80顆", price: 320, image: "images/nz-apple04.jpg" },
  { id: 2, name: "紐西蘭耀眼蘋果4入", quantity: "原裝30顆", price: 300, image: "images/nz-apple01.jpg" },
  { id: 3, name: "太陽黃金奇異果4入", quantity: "原裝22顆", price: 200, image: "images/nz-kiwi01.jpg" },
  { id: 4, name: "澳洲綠無籽葡萄2斤", quantity: "一組2斤", price: 360, image: "images/au-grapes02.jpg" },
  { id: 5, name: "加州香吉士5顆", quantity: "一組5顆", price: 100, image: "images/usa-orange.jpg" },
  { id: 6, name: "加州小蜜柑15顆", quantity: "一組15顆", price: 250, image: "images/usa-mandarin01.jpg" },
  { id: 7, name: "溪洲溫室巨峰葡萄1斤", quantity: "1組600g", price: 200, image: "images/taiwan-grapes.jpg" },
  { id: 8, name: "屏東金鑽鳳梨", quantity: "1顆", price: 140, image: "images/taiwan-pineapple.jpg" },
  { id: 9, name: "屏東硫黃百香果8入", quantity: "1組8入", price: 200, image: "images/taiwan-passionfruit01.jpg" },
  { id: 10, name: "台南香華綠肉哈密瓜", quantity: "1顆", price: 300, image: "images/taiwan-netted-melon.jpg" },
  { id: 11, name: "台南曾文木瓜", quantity: "1顆", price: 130, image: "images/taiwan-papaya.jpg" },
  { id: 12, name: "嘉義溫室玉女番茄", quantity: "1盒", price: 300, image: "images/taiwan-tomato.jpg" },
  { id: 13, name: "屏東黑珍珠蓮霧8顆", quantity: "一組8顆", price: 220, image: "images/taiwan-waxapple.jpg" },
  { id: 14, name: "南投中寮山蕉5根", quantity: "一組5根", price: 100, image: "images/taiwan-banana01.jpg" },
  { id: 15, name: "台南華寶西瓜1/4顆", quantity: "一組1/4顆", price: 280, image: "images/taiwan-watermelon.jpg" },
  { id: 16, name: "北海道烤布丁", quantity: "1入", price: 80, image: "images/pudding.jpg" },
  { id: 17, name: "北海道鮮奶酪", quantity: "1入", price: 80, image: "images/pannacotta.jpg" },
  { id: 18, name: "蜂蜜蛋糕捲", quantity: "1盒", price: 250, image: "images/chiffon.jpg" },
  { id: 19, name: "巴斯克起司蛋糕", quantity: "1入", price: 350, image: "images/basque-cheesecake01.jpg" },
  { id: 20, name: "當季水果切盒", quantity: "1盒", price: 90, image: "images/fruitbox01.jpg" },
  { id: 21, name: "哈密瓜三明治", quantity: "1入", price: 140, image: "images/sw-melon01.jpg" },
  { id: 22, name: "綠葡萄三明治", quantity: "1入", price: 140, image: "images/sw-grape.jpg" }
];
let cart = [];

document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }

  liff.init({ liffId: "2007147358-gA92Lq1a" })
    .then(() => {
      console.log("LIFF 初始化成功，LIFF 版本:", liff.getVersion());
      console.log("是否在 LINE 客戶端:", liff.isInClient());
      console.log("是否已登錄:", liff.isLoggedIn());
      renderProducts();
      showMenuPage();
    })
    .catch(err => {
      console.error("LIFF 初始化失敗:", err);
      alert("無法初始化應用，請稍後再試！");
      renderProducts();
      showMenuPage();
    });
}

// 加入 LINE 官方帳號
function joinLineOfficial() {
  liff.openWindow({
    url: "line://ti/p/@ringofruit",
    external: true,
  });
}

// 渲染產品
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
    img.loading = "lazy";
    img.width = 300;
    img.height = 300;
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

// 購物車功能
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
  saveCartToStorage();

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
    priceSpan.className = "flex-1 text-end fw-bold me-3";

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger btn-sm";
    removeBtn.textContent = "移除";
    removeBtn.onclick = () => removeFromCart(index);

    itemDiv.append(nameSpan, quantitySpan, priceSpan, removeBtn);
    cartItems.appendChild(itemDiv);
  });

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiv = document.createElement("div");
  totalDiv.className = "cart-total d-flex justify-content-between p-2 fw-bold";
  totalDiv.innerHTML = `<span>總金額</span><span>NT$${totalAmount}</span>`;
  cartItems.appendChild(totalDiv);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  saveCartToStorage();
  renderCart();
}

function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 頁面切換
function showMenuPage() {
  document.getElementById("menu-page").style.display = "block";
  document.getElementById("cart-page").style.display = "none";
  document.getElementById("thank-you-page").style.display = "none";
}

function showCartPage() {
  document.getElementById("menu-page").style.display = "none";
  document.getElementById("cart-page").style.display = "block";
  document.getElementById("thank-you-page").style.display = "none";
  renderCart();
}

function showThankYouPage(orderNumber) {
  document.getElementById("menu-page").style.display = "none";
  document.getElementById("cart-page").style.display = "none";
  document.getElementById("thank-you-page").style.display = "block";
  document.getElementById("order-number").textContent = `訂單編號：${orderNumber}`;
}

// 表單驗證
function validateForm() {
  const recipient = document.getElementById("recipient").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value.trim();

  if (!recipient || !phone || !location) {
    alert("請填寫所有必填欄位！");
    return false;
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    alert("請輸入有效的電話號碼（10 位數字）！");
    return false;
  }

  return true;
}

// 載入狀態
function showLoading() {
  document.getElementById("loading").style.display = "block";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

// 提交訂單
async function submitOrder() {
  if (!validateForm()) {
    return;
  }

  if (cart.length === 0) {
    alert("購物車是空的，請先添加產品！");
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
    console.log("用戶資料:", userProfile);

    const isFriendResponse = await fetch("https://your-line-webhook-app-4d2cb4d3dfa4.herokuapp.com/check-friendship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userProfile.userId }),
    });
    const isFriendResult = await isFriendResponse.json();
    console.log("好友檢查結果:", isFriendResult);

    if (!isFriendResponse.ok || !isFriendResult.isFriend) {
      const lineFriendModal = new bootstrap.Modal(document.getElementById("lineFriendModal"));
      lineFriendModal.show();
      return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AAD${hours}${minutes}${randomNum}`;

    const orderData = {
      userId: userProfile.userId,
      orderDetails: cart.map(item => `${item.name} x${item.quantity} NT$${item.price * item.quantity}`).join("\n"),
      totalAmount,
      orderNumber,
      recipient: document.getElementById("recipient").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      location: document.getElementById("location").value.trim(),
      notes: document.getElementById("notes").value.trim(),
    };

    console.log("提交訂單數據:", orderData);

    const response = await fetch("https://your-line-webhook-app-4d2cb4d3dfa4.herokuapp.com/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    console.log("後端響應:", response.status, await response.text());
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "訂單提交失敗");
    }

    console.log("訂單提交成功:", result);
    cart = [];
    saveCartToStorage();
    updateCartCount();
    showThankYouPage(orderNumber);
  } catch (err) {
    console.error("訂單提交失敗:", err);
    alert(`訂單提交失敗：${err.message}。請稍後再試！`);
  } finally {
    hideLoading();
    submitButton.disabled = false;
  }
}