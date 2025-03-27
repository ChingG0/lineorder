import { getCart, clearCart, updateCartCount } from './cart.js';
import { showThankYouPage } from './page-switch.js';

export function submitOrder() {
  const recipient = document.getElementById("recipient").value;
  const phone = document.getElementById("phone").value;
  const location = document.getElementById("location").value;
  const notes = document.getElementById("notes").value;

  if (!recipient || !phone || !location) {
    alert("請填寫所有必填欄位！");
    return;
  }

  const cart = getCart();

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
  clearCart();
  updateCartCount();
  showThankYouPage();
}