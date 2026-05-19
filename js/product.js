// js/product.js
document.addEventListener('DOMContentLoaded', async () => {
    // Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const container = document.getElementById('product-container');

    if (!productId) {
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem 0;">
                <h2>المنتج غير موجود</h2>
                <a href="shop.html" class="btn btn-primary" style="margin-top: 1rem;">العودة للمتجر</a>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch('data/products.json');
        const products = await response.json();
        const product = products.find(p => p.id === parseInt(productId));

        if (!product) {
            container.innerHTML = `
                <div style="text-align: center; padding: 4rem 0;">
                    <h2>المنتج غير موجود</h2>
                    <a href="shop.html" class="btn btn-primary" style="margin-top: 1rem;">العودة للمتجر</a>
                </div>
            `;
            return;
        }

        // Render product details
        document.title = `متجر أورورا | ${product.name}`;
        
        container.innerHTML = `
            <div class="product-detail">
                <div class="detail-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="detail-info">
                    <div class="product-category" style="font-size: 1rem; margin-bottom: 1rem;">${getCategoryName(product.category)}</div>
                    <h1>${product.name}</h1>
                    <div class="detail-price">$${product.price}</div>
                    <p class="detail-desc">${product.description}</p>
                    
                    <div class="detail-actions">
                        <div class="qty-controls" style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 0.25rem;">
                            <button class="qty-btn" onclick="changeQty(-1)">-</button>
                            <span id="qty-val" style="width: 30px; text-align: center; font-weight: 600;">1</span>
                            <button class="qty-btn" onclick="changeQty(1)">+</button>
                        </div>
                        <button class="btn btn-primary" onclick="addToCartFromDetail(${product.id})" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                            <span class="material-symbols-outlined">shopping_cart</span>
                            إضافة للسلة
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Store current product in a global var so the add to cart function can access it
        window.currentProduct = product;
        window.currentProductId = parseInt(productId);

        // Show and setup reviews section
        document.getElementById('reviews-section').style.display = 'block';
        setupReviewsSection(parseInt(productId));

    } catch (error) {
        console.error("Error loading product:", error);
        container.innerHTML = '<p style="text-align: center; color: red;">عذراً، حدث خطأ أثناء تحميل المنتج.</p>';
    }
});

let currentQty = 1;
function changeQty(delta) {
    const qtySpan = document.getElementById('qty-val');
    currentQty += delta;
    if (currentQty < 1) currentQty = 1;
    qtySpan.textContent = currentQty;
}

function getCategoryName(cat) {
    const map = {
        'audio': 'صوتيات',
        'wearables': 'أجهزة يمكن ارتداؤها',
        'accessories': 'إكسسوارات'
    };
    return map[cat] || cat;
}

function addToCartFromDetail(id) {
    const product = window.currentProduct;
    if (product) {
        const cart = getCart(); // from main.js
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += currentQty;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: currentQty
            });
        }
        
        saveCart(cart);
        showToast('تمت إضافة المنتج إلى السلة بنجاح!');
        // reset qty
        currentQty = 1;
        document.getElementById('qty-val').textContent = currentQty;
    }
}

// Reviews Functions
function getProductReviews(productId) {
    const reviews = localStorage.getItem(`reviews_product_${productId}`);
    return reviews ? JSON.parse(reviews) : [];
}

function saveProductReview(productId, review) {
    const reviews = getProductReviews(productId);
    reviews.push({
        id: Date.now(),
        author: review.author,
        rating: review.rating,
        comment: review.comment,
        date: new Date().toLocaleDateString('ar-SA')
    });
    localStorage.setItem(`reviews_product_${productId}`, JSON.stringify(reviews));
}

function setupReviewsSection(productId) {
    const reviewForm = document.getElementById('review-form');
    const ratingSelector = document.getElementById('rating-selector');
    const reviewsList = document.getElementById('reviews-list');
    let selectedRating = 0;

    // Star rating selector
    const stars = ratingSelector.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.getAttribute('data-rating'));
            document.getElementById('rating-value').value = selectedRating;
            document.getElementById('rating-label').textContent = `تقييمك: ${selectedRating} من 5`;
            
            // Update star appearance
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-rating')) <= selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });

        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.getAttribute('data-rating'));
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-rating')) <= hoverRating) {
                    s.style.opacity = '1';
                } else {
                    s.style.opacity = '0.5';
                }
            });
        });
    });

    ratingSelector.addEventListener('mouseleave', () => {
        stars.forEach(s => {
            if (parseInt(s.getAttribute('data-rating')) <= selectedRating) {
                s.style.opacity = '1';
            } else {
                s.style.opacity = '0.5';
            }
        });
    });

    // Form submission
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const author = document.getElementById('reviewer-name').value.trim();
        const comment = document.getElementById('review-comment').value.trim();
        const rating = parseInt(document.getElementById('rating-value').value);

        if (!author || !comment || rating === 0) {
            showToast('يرجى ملء جميع الحقول واختيار تقييماً');
            return;
        }

        // Save review
        saveProductReview(productId, {
            author,
            rating,
            comment
        });

        // Reset form
        reviewForm.reset();
        document.getElementById('rating-value').value = '0';
        document.getElementById('rating-label').textContent = 'اختر تقييماً';
        stars.forEach(s => s.classList.remove('active'));
        selectedRating = 0;

        showToast('شكراً! تم إضافة تقييمك بنجاح');
        
        // Reload reviews
        displayReviews(productId);
    });

    // Load and display existing reviews
    displayReviews(productId);
}

function displayReviews(productId) {
    const reviewsList = document.getElementById('reviews-list');
    const reviews = getProductReviews(productId);

    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">لا توجد تقييمات حتى الآن. كن أول من يقيّم هذا المنتج!</p>';
        return;
    }

    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div>
                    <div class="review-author">${review.author}</div>
                    <div class="review-date">${review.date}</div>
                </div>
                <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
            </div>
            <div class="review-comment">${review.comment}</div>
        </div>
    `).join('');
}
