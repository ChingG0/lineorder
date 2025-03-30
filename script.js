// === 初始化模組 (Initialization Module) ===
let products = [
  {
    id: 1,
    name: "蘋果",
    quantity: "6包",
    price: 100,
    image: "images/product1.jpg"
  },
  {
    id: 2,
    name: "調味料",
    quantity: "300g",
    price: 50,
    image: "images/product1.jpg"
  },
  {
    id: 3,
    name: "泡麵",
    quantity: "6包",
    price: 100,
    image: "images/product1.jpg"
  },
  {
    id: 4,
    name: "泡麵",
    quantity: "6包",
    price: 100,
    image: "images/product1.jpg"
  },
];
let cart = [];

document.addEventListener("DOMContentLoaded", function() {
  initializeApp();
});

function initializeApp() {
  // 初始化 LIFF
  liff.init({ liffId: "2007147358-gA92Lq1a" })
    .then(() => {
      console.log("LIFF 初始化成功");
      renderProducts();
      showMenuPage();
    })
    .catch(err => {
      console.error("LIFF 初始化失敗：", err);
      alert("無法初始化應用，請稍後再試！");
      // 即使 LIFF 初始化失敗，仍然渲染產品
      renderProducts();
      showMenuPage();
    });
}

// === 產品載入模組 (Product Loader Module) ===
function renderProducts() {
  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = ""; // 清空現有內容
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="image-container">
        <img src="${product.image}" alt="${product.name}" class="loading" onload="this.classList.remove('loading'); this.classList.add('loaded');" onerror="console.error('圖片載入失敗: ${product.image}'); this.src='images/product1.jpg'; this.onerror=null;">
      </div>
      <div class="product-name">${product.name}</div>
      <div class="product-spec">${product.quantity}</div>
      <div class="price">NT$${product.price}</div>
      <div class="quantity-selector">
        <button onclick="changeQuantity(${product.id}, -1)">-</button>
        <input type="text" id="quantity-${product.id}" value="1" readonly>
        <button onclick="changeQuantity(${product.id}, 1)">+</button>
      </div>
      <button class="add-to-cart" onclick="addToCart(${product.id})">加入購物車</button>
    `;
    productGrid.appendChild(card);
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
  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: quantity
  };

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
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <span>${item.name}</span>
      <span>數量: ${item.quantity}</span>
      <span>NT$${item.price * item.quantity}</span>
      <button onclick="removeFromCart(${index})">移除</button>
    `;
    cartItems.appendChild(itemDiv);
  });
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
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

// === 訂單模組 (Order Module) ===
function submitOrder() {
  const recipient = document.getElementById("recipient").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value.trim();
  const notes = document.getElementById("notes").value;

  if (!recipient || !phone || !location) {
    alert("請填寫所有必填欄位！");
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    alert("電話號碼必須是10位數字！");
    return;
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const orderDetails = cart.map(item => `${item.name} x${item.quantity} NT$${item.price * item.quantity}`).join("\n") + `\n\n總金額: NT$${totalAmount}`;

  liff.sendMessages([{
    type: "text",
    text: `訂單 #${orderNumber}：\n訂單狀態已更新為「已確認」。\n\n${orderDetails}`,
    quickReply: {
      items: [
        {
          type: "action",
          action: {
            type: "message",
            label: "查詢訂單",
            text: "查詢訂單"
          }
        },
        {
          type: "action",
          action: {
            type: "message",
            label: "付款並上傳購物",
            text: "付款並上傳購物"
          }
        }
      ]
    }
  }])
    .then(() => {
      console.log("訊息發送成功");
      cart = [];
      updateCartCount();
      showThankYouPage();
    })
    .catch(err => {
      console.error("訊息發送失敗：", err);
      alert("訂單提交失敗，請稍後再試！");
    });
}