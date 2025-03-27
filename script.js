// 全域變數，用於儲存產品資料
let products = [];
let cart = [];

console.log("script.js 開始執行...");

// 直接載入產品資料
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOMContentLoaded 觸發...");
  console.log("開始載入產品資料...");
  loadProducts();
});

// 載入產品資料
function loadProducts() {
  console.log("loadProducts 函數被調用...");
  fetch("data/products.json")
    .then(response => {
      console.log("收到回應，狀態碼：", response.status);
      if (!response.ok) {
        throw new Error("無法載入產品資料，狀態碼：" + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log("產品資料載入成功：", data);
      products = data; // 儲存到全域變數
      const productGrid = document.getElementById("product-grid");
      products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}" onerror="console.error('圖片載入失敗: ${product.image}'); this.src='https://via.placeholder.com/150'; this.onerror=null;">
          <div class="product-name">${product.name}</div>
          <div class="product-spec">${product.quantity} 規格: 6顆 300g</div>
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
    })
    .catch(err => {
      console.error("載入產品資料失敗：", err);
      alert("無法載入產品資料，請確認網路連線或檔案是否存在：" + err.message);
    });
}

// 更改數量
function changeQuantity(productId, change) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  let quantity = parseInt(quantityInput.value);
  quantity = Math.max(1, quantity + change);
  quantityInput.value = quantity;
}

// 加入購物車
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

  // 使用 Bootstrap Modal 顯示提示訊息
  const modalMessage = document.getElementById("cartModalMessage");
  modalMessage.textContent = `${product.name} 已加入購物車！`;
  const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
  cartModal.show();
}

// 更新購物車計數
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = totalItems;
}

// 顯示選單頁
function showMenuPage() {
  document.getElementById("menu-page").style.display = "block";
  document.getElementById("cart-page").style.display = "none";
  document.getElementById("thank-you-page").style.display = "none";
}

// 顯示購物車頁
function showCartPage() {
  if (cart.length === 0) {
    alert("購物車是空的！");
    return;
  }

  document.getElementById("menu-page").style.display = "none";
  document.getElementById("cart-page").style.display = "block";
  document.getElementById("thank-you-page").style.display = "none";

  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  cart.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <span>${item.name}</span>
      <span>數量: ${item.quantity}</span>
      <span>NT$${item.price * item.quantity}</span>
    `;
    cartItems.appendChild(itemDiv);
  });
}

// 提交訂單並發送 LINE 訊息
function submitOrder() {
  const recipient = document.getElementById("recipient").value;
  const phone = document.getElementById("phone").value;
  const location = document.getElementById("location").value;
  const notes = document.getElementById("notes").value;

  if (!recipient || !phone || !location) {
    alert("請填寫所有必填欄位！");
    return;
  }

  // 計算總金額
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 生成訂單編號（簡單模擬）
  const orderNumber = `20210621060039274`;

  // 構建訂單明細
  let orderDetails = cart.map(item => `${item.name} x${item.quantity} NT$${item.price * item.quantity}`).join("\n");
  orderDetails += `\n\n總金額: NT$${totalAmount}`;

  // 模擬發送 LINE 訊息
  console.log("模擬發送 LINE 訊息：", {
    type: "text",
    text: `訂單 #${orderNumber}：\n訂單狀態已更新為「已確認」。\n\n訂單狀態：已確認\n付款狀態：未付款\n送貨狀態：備貨中\n\n${orderDetails}\n\n有關訂單查詢，請點入訂單連結詢問\n問或直接回覆此 LINE @ 訊息。`,
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
  });

  // 模擬成功發送後的操作
  cart = []; // 清空購物車
  updateCartCount();
  showThankYouPage();
}

// 顯示感謝頁
function showThankYouPage() {
  document.getElementById("menu-page").style.display = "none";
  document.getElementById("cart-page").style.display = "none";
  document.getElementById("thank-you-page").style.display = "block";
}

// 初始化顯示選單頁
showMenuPage();