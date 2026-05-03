// js/shop.js
let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/products.json');
        allProducts = await response.json();
        
        renderProducts(allProducts);
        
        // Setup Event Listeners for Filters and Search
        document.getElementById('search-input').addEventListener('input', filterProducts);
        document.getElementById('category-filter').addEventListener('change', filterProducts);
        document.getElementById('sort-filter').addEventListener('change', filterProducts);
        
    } catch (error) {
        console.error("Error loading products:", error);
        document.getElementById('shop-products').innerHTML = '<p style="text-align: center; color: red;">عذراً، حدث خطأ أثناء تحميل المنتجات.</p>';
    }
});

function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const sort = document.getElementById('sort-filter').value;
    
    // 1. Filter
    let filtered = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
    });
    
    // 2. Sort
    if (sort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    }
    
    renderProducts(filtered);
}

function renderProducts(products) {
    const grid = document.getElementById('shop-products');
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1 / -1; color: var(--text-secondary);">لم يتم العثور على منتجات تطابق بحثك.</p>';
        return;
    }
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <a href="product.html?id=${product.id}" class="product-image-container">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <div class="product-category">${getCategoryName(product.category)}</div>
            <a href="product.html?id=${product.id}" class="product-name">${product.name}</a>
            <div class="product-footer">
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})" title="أضف للسلة">
                    <span class="material-symbols-outlined">add</span>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function getCategoryName(cat) {
    const map = {
        'audio': 'صوتيات',
        'wearables': 'أجهزة يمكن ارتداؤها',
        'accessories': 'إكسسوارات'
    };
    return map[cat] || cat;
}

function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
    if (product) {
        const cart = getCart(); // defined in main.js
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        saveCart(cart);
        showToast('تمت إضافة المنتج إلى السلة بنجاح!');
    }
}
