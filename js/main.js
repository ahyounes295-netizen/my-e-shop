// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupThemeToggle();
});

function getCart() {
    const cart = localStorage.getItem('ecommerce_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElements = document.querySelectorAll('.cart-count');
    countElements.forEach(el => {
        el.textContent = totalItems;
        // Simple pop animation
        el.style.transform = 'scale(1.2)';
        setTimeout(() => el.style.transform = 'scale(1)', 200);
    });
}

function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    
    // Check saved theme
    const savedTheme = localStorage.getItem('ecommerce_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(toggleBtn, savedTheme);
    
    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('ecommerce_theme', newTheme);
        updateThemeIcon(toggleBtn, newTheme);
    });
}

function updateThemeIcon(btn, theme) {
    // using simple unicode icons for no-dependency approach
    btn.innerHTML = theme === 'light' ? '🌙' : '☀️';
}
