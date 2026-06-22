// 全域變數或確保這兩個陣列/物件存在
if (typeof pendingPayments === 'undefined') window.pendingPayments = [];
let currentPaymentOrderId = null; // 記錄當前正在付款的訂單 ID

// 當使用者在購物車點擊「結帳/購買 (Checkout)」時觸發
function checkoutCart() {
    // 1. 基本防呆檢查
    if (!cart || cart.length === 0) {
        if (typeof showToast === 'function') showToast('🛒 購物車內沒有裝備！');
        else alert('🛒 購物車內沒有裝備！');
        return;
    }

    // 2. 計算總金額與產生隨機訂單編號
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const orderId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    currentPaymentOrderId = orderId;

    // 3. 建立一筆等待審核的訂單物件
    const newPayment = {
        id: orderId,
        method: 'PromptPay', // 預設路由
        amount: totalAmount,
        items: [...cart], // 複製當前購物車內容
        createdAt: new Date().toISOString()
    };

    // 4. 將訂單推入管理員審核清單（關鍵：這樣你的 admin 面板才會有資料）
    pendingPayments.push(newPayment);

    // 5. 【重要】顯示給一般使用者的付款 Modal（不要讓畫面沒反應）
    // 先檢查有沒有一般使用者的付款 Modal，如果沒有，就直接打開 Admin 的待審核面板模擬
    const buyerModal = document.getElementById('payment-modal') || document.getElementById('buyer-payment-modal');
    
    if (buyerModal) {
        // 如果有買家專用彈窗，渲染資料並顯示
        const payIdEl = document.getElementById('pay-order-id');
        const payAmountEl = document.getElementById('pay-amount');
        if (payIdEl) payIdEl.innerText = orderId;
        if (payAmountEl) payAmountEl.innerText = totalAmount;
        
        buyerModal.classList.remove('hidden');
    } else {
        // 防呆：如果完全找不到買家付款畫面，直接自動幫他打開 Admin 面板，方便你測試
        console.warn("未偵測到買家付款結構，自動開啟 Admin 面板進行模擬核對。");
        openPendingPaymentsAdmin();
    }
}

// 當使用者在付款畫面按下「確認已付款 / 傳送通知」時觸發
function submitPaymentOrder() {
    // 關閉買家付款視窗
    const buyerModal = document.getElementById('payment-modal') || document.getElementById('buyer-payment-modal');
    if (buyerModal) buyerModal.classList.add('hidden');

    // 清空購物車
    cart = [];
    if (typeof renderCart === 'function') renderCart();
    if (typeof saveAppState === 'function') saveAppState();

    if (typeof showToast === 'function') {
        showToast('✉️ 付款通知已傳送！請等待商人公會(管理員)核對款項。');
    } else {
        alert('✉️ 付款通知已傳送！請等待商人公會(管理員)核對款項。');
    }

    // 如果管理員後台正開著，即時重新渲染清單
    if (typeof renderPendingPaymentsAdmin === 'function') {
        renderPendingPaymentsAdmin();
    }
}

// 買家取消付款時的處理
function closePaymentModal() {
    const buyerModal = document.getElementById('payment-modal') || document.getElementById('buyer-payment-modal');
    if (buyerModal) buyerModal.classList.add('hidden');
    
    // 如果使用者取消了，就把剛剛加進去 pending 陣列的最後一筆移出
    if (currentPaymentOrderId) {
        pendingPayments = pendingPayments.filter(p => p.id !== currentPaymentOrderId);
        currentPaymentOrderId = null;
        if (typeof renderPendingPaymentsAdmin === 'function') {
            renderPendingPaymentsAdmin();
        }
    }
}
