// js/cart.js
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const cart = getCart(); // From main.js
    const container = document.getElementById('cart-container');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <span class="material-symbols-outlined" style="font-size: 4rem; color: var(--text-secondary); margin-bottom: 1rem;">shopping_bag</span>
                <h2>سلة المشتريات فارغة</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">لم تقم بإضافة أي منتجات إلى السلة بعد.</p>
                <a href="shop.html" class="btn btn-primary">تصفح المنتجات</a>
            </div>
        `;
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <a href="product.html?id=${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                </a>
                <div class="cart-item-info">
                    <a href="product.html?id=${item.id}"><h3>${item.name}</h3></a>
                    <div style="color: var(--text-secondary)">$${item.price.toFixed(2)}</div>
                </div>
                
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateItemQty(${index}, -1)">-</button>
                    <span style="width: 20px; text-align: center; font-weight: 600;">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateItemQty(${index}, 1)">+</button>
                </div>
                
                <div style="font-weight: 700; font-size: 1.2rem;">
                    $${itemTotal.toFixed(2)}
                </div>
                
                <button class="remove-btn" onclick="removeItem(${index})" title="إزالة من السلة">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
    });
    
    html += `
        <div class="cart-summary">
            <div style="color: var(--text-secondary); margin-bottom: 0.5rem;">المجموع الكلي:</div>
            <div class="cart-total">$${total.toFixed(2)}</div>
            <button class="btn btn-primary" style="width: 100%; max-width: 300px; font-size: 1.1rem;">إتمام الطلب</button>
        </div>
    `;
    
    container.innerHTML = html;
}

function updateItemQty(index, delta) {
    const cart = getCart();
    
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity < 1) {
            cart.splice(index, 1);
        }
        saveCart(cart);
        renderCart();
    }
}

function removeItem(index) {
    const cart = getCart();
    if (cart[index]) {
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
        showToast('تمت إزالة المنتج من السلة.');
    }
}
