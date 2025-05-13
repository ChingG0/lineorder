let products = [
  { id: 1, name: "加州水蜜桃4顆", quantity: "4入", price: 520, image: "images/usa-peach01.jpg" },
  { id: 2, name: "加州水蜜桃原裝22顆", quantity: "原裝22顆", price: 2380, image: "images/usa-peach02.jpg" },
  { id: 3, name: "加州高山櫻桃1斤", quantity: "一盒一斤", price: 550, image: "images/usa-cherry01.jpg" },
  { id: 4, name: "加州櫻桃禮盒2公斤", quantity: "一盒2公斤", price: 1500, image: "images/usa-cherry2.jpg" },
  { id: 5, name: "加州高山櫻桃5kg", quantity: "一箱5kg", price: 3980, image: "images/usa-cherry03.jpg" },
  { id: 6, name: "枋山愛文芒果6入", quantity: "6入禮盒", price: 1200, image: "images/taiwan-mango01.jpg" },
  { id: 7, name: "枋山愛文芒果9入", quantity: "9入禮盒", price: 1050, image: "images/taiwan-mango02.jpg" },

  { id: 8, name: "紐西蘭富士蘋果4入", quantity: "一組4顆", price: 360, image: "images/nz-fujiapple02.jpg" },
  { id: 9, name: "紐西蘭富士蘋果24入", quantity: "原裝24顆", price: 1800, image: "images/nz-fujiapple05.jpg" },
  { id: 10, name: "紐西蘭Rockit蘋果1管", quantity: "一管5顆", price: 200, image: "images/nz-rockit01.jpg" },
  { id: 11, name: "紐西蘭耀眼蘋果4入", quantity: "原裝30顆", price: 280, image: "images/nz-apple30.jpg" },
  { id: 12, name: "紐西蘭耀眼蘋果6入", quantity: "原裝70顆", price: 240, image: "images/nz-apple70.jpg" },
  { id: 13, name: "有機黃金奇異果6入", quantity: "原裝22顆", price: 300, image: "images/nz-kiwi22.jpg" },
  { id: 14, name: "紐西蘭黃金奇異果6入", quantity: "原裝18顆", price: 360, image: "images/nz-kiwi18.jpg" },
  { id: 15, name: "紐西蘭黃金奇異果16入", quantity: "原裝16顆", price: 1000, image: "images/nz-kiwi16.jpg" },
  { id: 16, name: "加州香吉士8顆", quantity: "一組8顆", price: 160, image: "images/usa-orange.jpg" },
  { id: 17, name: "加州小蜜柑16顆", quantity: "一組16顆", price: 280, image: "images/usa-mandarin01.jpg" },

  { id: 18, name: "溪洲溫室巨峰葡萄1串", quantity: "1組600g", price: 200, image: "images/taiwan-grapes.jpg" },
  { id: 19, name: "南投中寮山蕉5根", quantity: "一組5根", price: 90, image: "images/taiwan-banana01.jpg" },
  { id: 20, name: "屏東硫黃百香果10顆", quantity: "1組10顆", price: 200, image: "images/taiwan-passionfruit01.jpg" },
  { id: 21, name: "屏東金鑽鳳梨1顆", quantity: "1顆", price: 130, image: "images/taiwan-pineapple.jpg" },
  { id: 22, name: "台南曾文木瓜1顆", quantity: "1顆", price: 110, image: "images/taiwan-papaya01.jpg" },
  { id: 23, name: "台南香華綠肉哈密瓜1顆", quantity: "1顆", price: 300, image: "images/taiwan-netted-melon.jpg" },
  { id: 24, name: "台南華寶西瓜1/4顆", quantity: "1/4顆", price: 280, image: "images/taiwan-watermelon01.jpg" },
  { id: 25, name: "南投牧草雞蛋1盒", quantity: "一箱3斤", price: 320, image: "images/egg01.jpg" },
  { id: 26, name: "雲林蒜頭(大)2斤", quantity: "一袋2斤", price: 400, image: "images/taiwan-garlic2.jpg" },
  { id: 27, name: "雲林蒜頭(中)2斤", quantity: "一袋2斤", price: 300, image: "images/taiwan-garlic1.jpg" },
]
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

  // 顯示載入中 UI
  showLoading()

  liff.init({ liffId: "2007147358-gA92Lq1a" })
    .then(() => {
      console.log("LIFF 初始化成功，LIFF 版本:", liff.getVersion());
      console.log("是否在 LINE 客戶端:", liff.isInClient());
      console.log("是否已登錄:", liff.isLoggedIn());

      // 預載圖片後再渲染
      renderProducts()
      preloadImages()
        .then(() => {
          hideLoading();
          showMenuPage();
          
        })
        .catch(err => {
          console.error("圖片預載失敗:", err);
          hideLoading();
          showMenuPage();
          
        });
    })
    .catch(err => {
      console.error("LIFF 初始化失敗:", err);
      alert("無法初始化應用，請稍後再試！");

      // 即使 LIFF 初始化失敗，也嘗試預載圖片並渲染
      renderProducts()
      preloadImages()
        .then(() => {
          hideLoading();
          showMenuPage();
        })
        .catch(err => {
          console.error("圖片預載失敗:", err);
          hideLoading();
          showMenuPage();
          
        });
    });
}

// 加入 LINE 官方帳號
function joinLineOfficial() {
  liff.openWindow({
    url: "line://ti/p/@ringofruit",
    external: true,
  });
}

// 渲染圖片
function preloadImages() {
  let successCount = 0;
  let failureCount = 0;

  const imagePromises = products.map(product => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = product.image;
      img.onload = () => {
        successCount++;
        console.log(`圖片載入成功: ${product.image}`);
        resolve();
      };
      img.onerror = () => {
        failureCount++;
        console.error(`圖片載入失敗: ${product.image}`);
        product.image = "images/fallback.jpg";
        resolve();
      };
    });
  });

  return Promise.all(imagePromises).then(() => {
    console.log(`圖片預載完成: 成功 ${successCount} 張，失敗 ${failureCount} 張`);
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
    img.onerror = () => { console.error(`圖片載入失敗: ${product.image}`); img.src = "images/taiwan-peach01.jpg"; };
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

// 檢查好友狀態（帶重試邯輯）
async function checkFriendship(userId, retries = 1) {
  try {
    const response = await fetch("https://your-line-webhook-app-4d2cb4d3dfa4.herokuapp.com/check-friendship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    console.log("好友檢查響應狀態:", response.status, response.statusText);
    const result = await response.json();
    console.log("好友檢查結果:", result);

    if (!response.ok) {
      throw new Error(result.error || "好友檢查失敗");
    }

    return result.isFriend;
  } catch (error) {
    console.error(`好友檢查失敗 (嘗試 ${2 - retries + 1}/${2}):`, error);
    if (retries > 0) {
      console.log("重試好友檢查...");
      return await checkFriendship(userId, retries - 1);
    }
    throw error;
  }
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

    const isFriend = await checkFriendship(userProfile.userId);
    if (!isFriend) {
      console.warn("用戶未加入官方帳號，userId:", userProfile.userId);
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

    const result = await response.json();
    console.log("後端響應:", { status: response.status, body: result });

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
    let errorMessage = "訂單提交失敗，請稍後再試或聯繫客服！";
    if (err.message.includes("好友檢查失敗")) {
      errorMessage = "無法驗證 LINE 好友狀態，請稍後再試或聯繫客服！";
    } else if (err.message.includes("訂單提交失敗")) {
      errorMessage = `訂單提交失敗：${err.message}。請稍後再試或聯繫客服！`;
    }
    alert(errorMessage);
  } finally {
    hideLoading();
    submitButton.disabled = false;
  }
}