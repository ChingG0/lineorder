let products = [];

export function loadProducts() {
  console.log("loadProducts 函數被調用...");
  fetch("../data/products.json")
  .then(response => {
    console.log("收到回應，狀態碼：", response.status);
    if (!response.ok) {
      throw new Error("無法載入產品資料，狀態碼：" + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("產品資料載入成功：", data);
    products = data;
    renderProducts();
  })
  .catch(err => {
    console.error("載入產品資料失敗：", err);
    alert("無法載入產品資料，請確認網路連線或檔案是否存在：" + err.message);
  });
}

function renderProducts() {
  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="image-container">
        <img src="${product.image}" alt="${product.name}" class="loading" onload="this.classList.remove('loading'); this.classList.add('loaded');" onerror="console.error('圖片載入失敗: ${product.image}'); this.src='../images/product1.jpg'; this.onerror=null;">
      </div>
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
}

export function getProducts() {
  return products;
}