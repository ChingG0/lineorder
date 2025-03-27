import { loadProducts } from './modules/product-loader.js';
import { addToCart, changeQuantity, updateCartCount, renderCart } from './modules/cart.js';
import { showMenuPage, showCartPage, showThankYouPage } from './modules/page-switch.js';
import { submitOrder } from './modules/order.js';

// 將函數暴露給全局，以便 HTML 事件處理器使用
window.changeQuantity = changeQuantity;
window.addToCart = addToCart;
window.showCartPage = showCartPage;
window.showMenuPage = showMenuPage;
window.submitOrder = submitOrder;

// 初始化應用程式
document.addEventListener("DOMContentLoaded", function() {
  console.log("應用程式初始化...");
  loadProducts();
  showMenuPage();
});
