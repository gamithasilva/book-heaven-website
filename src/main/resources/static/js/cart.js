/**
 * BookHaven - Cart Page Engine
 * Features local storage persistence and REST API preparation.
 */

// Default Fallback Sample Cart Data
const initialSampleCart = [
    {
        id: "1",
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        price: 4500,
        quantity: 1,
        stock: 10,
        coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "2",
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt & David Thomas",
        category: "Programming",
        price: 5200,
        quantity: 1,
        stock: 5,
        coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "4",
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-Help",
        price: 2800,
        quantity: 1,
        stock: 12,
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"
    }
];

// Recommended Books Mock Data
const recommendedBooksData = [
    { id: "2", title: "The Pragmatic Programmer", author: "Andrew Hunt", price: 5200, rating: 4.9, coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600" },
    { id: "4", title: "Atomic Habits", author: "James Clear", price: 2800, rating: 4.8, coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600" },
    { id: "5", title: "The Psychology of Money", author: "Morgan Housel", price: 3100, rating: 4.7, coverImage: "https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&q=80&w=600" },
    { id: "6", title: "The Hobbit", author: "J.R.R. Tolkien", price: 2400, rating: 4.9, coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600" }
];

// State Management
let state = {
    cart: [],
    wishlist: [],
    itemPendingDelete: null,
    discountRate: 0,
    appliedCoupon: "",
    deliveryFee: 350
};

// ==========================================================================
// Initialization Point
// ==========================================================================
$(document).ready(function () {
    initTheme();
    loadStoredData();
    setupEventListeners();
    fetchCartData();
    renderRecommendedBooks();
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    $('html').attr('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const icon = $('#theme-toggle i');
    if (theme === 'dark') {
        icon.removeClass('fa-moon').addClass('fa-sun');
    } else {
        icon.removeClass('fa-sun').addClass('fa-moon');
    }
}

function loadStoredData() {
    const storedCart = localStorage.getItem('bookhaven_cart');
    if (storedCart) {
        state.cart = JSON.parse(storedCart);
    } else {
        state.cart = [...initialSampleCart];
        saveCartToStorage();
    }

    const storedWishlist = localStorage.getItem('bookhaven_wishlist');
    if (storedWishlist) {
        state.wishlist = JSON.parse(storedWishlist);
    }
    updateHeaderBadges();
}

function saveCartToStorage() {
    localStorage.setItem('bookhaven_cart', JSON.stringify(state.cart));
    updateHeaderBadges();
}

function saveWishlistToStorage() {
    localStorage.setItem('bookhaven_wishlist', JSON.stringify(state.wishlist));
    updateHeaderBadges();
}

function updateHeaderBadges() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    $('#cart-badge').text(totalItems);
    $('#wishlist-badge').text(state.wishlist.length);
}

// ==========================================================================
// API Layer Abstraction (Spring Boot Backend Prepared)
// ==========================================================================

/* GET /api/v1/cart */
function fetchCartData() {
    showLoadingState();

    // Simulated API Latency
    setTimeout(() => {
        /* Future Integration:
        $.get('/api/v1/cart', function(response) {
            state.cart = response.items;
            renderCartUI();
        });
        */
        renderCartUI();
    }, 400);
}

/* PATCH /api/v1/cart/items/{id} */
function apiUpdateItemQuantity(bookId, newQty) {
    const item = state.cart.find(i => i.id === bookId);
    if (item) {
        item.quantity = newQty;
        saveCartToStorage();
        calculateAndRenderSummary();
        
        /* Future Integration:
        $.ajax({
            url: `/api/v1/cart/items/${bookId}`,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify({ quantity: newQty })
        });
        */
    }
}

/* DELETE /api/v1/cart/items/{id} */
function apiRemoveItem(bookId) {
    state.cart = state.cart.filter(i => i.id !== bookId);
    saveCartToStorage();
    renderCartUI();

    /* Future Integration:
    $.ajax({
        url: `/api/v1/cart/items/${bookId}`,
        method: 'DELETE'
    });
    */
}

/* POST /api/v1/cart/coupon */
function apiApplyCoupon(code) {
    const formattedCode = code.trim().toUpperCase();
    
    /* Future Integration:
    $.post('/api/v1/cart/coupon', { code: formattedCode }, function(res) { ... });
    */

    if (formattedCode === "BOOK10") {
        state.discountRate = 0.10;
        state.appliedCoupon = "BOOK10";
        showCouponMessage("Discount applied successfully! (10% OFF)", "success");
    } else if (formattedCode === "SAVE20") {
        state.discountRate = 0.20;
        state.appliedCoupon = "SAVE20";
        showCouponMessage("Discount applied successfully! (20% OFF)", "success");
    } else {
        showCouponMessage("Invalid discount code.", "error");
        return;
    }

    calculateAndRenderSummary();
}

// ==========================================================================
// Render Engine
// ==========================================================================
function renderCartUI() {
    hideLoadingState();

    if (!state.cart || state.cart.length === 0) {
        $('#cart-content-layout').hide();
        $('#empty-cart-state').fadeIn(200);
        return;
    }

    $('#empty-cart-state').hide();
    $('#cart-content-layout').fadeIn(200);

    const container = $('#cart-items-container').empty();

    state.cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        container.append(`
            <div class="cart-item-card" data-id="${item.id}">
                <div class="cart-item-cover">
                    <img src="${item.coverImage}" alt="${item.title}">
                </div>
                <div class="cart-item-info">
                    <div class="item-header-row">
                        <div>
                            <h3 class="item-title">${item.title}</h3>
                            <p class="item-author">By ${item.author}</p>
                            <span class="item-category">${item.category || 'General'}</span>
                        </div>
                        <div class="item-actions-group">
                            <button class="action-icon-btn" onclick="moveToWishlist('${item.id}')" title="Move to Wishlist">
                                <i class="fa-regular fa-heart"></i> Wishlist
                            </button>
                            <button class="action-icon-btn remove-btn" onclick="promptRemoveItem('${item.id}')" title="Remove Item">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                    <div class="item-price-unit">Unit Price: Rs. ${item.price.toLocaleString()}</div>
                    
                    <div class="item-bottom-row">
                        <div class="quantity-selector">
                            <button type="button" class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                            <input type="number" value="${item.quantity}" readonly>
                            <button type="button" class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                        </div>
                        <div class="item-subtotal" id="subtotal-${item.id}">
                            Rs. ${itemSubtotal.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        `);
    });

    calculateAndRenderSummary();
}

function updateQty(bookId, delta) {
    const item = state.cart.find(i => i.id === bookId);
    if (!item) return;

    const targetQty = item.quantity + delta;

    if (targetQty < 1) return;
    if (targetQty > item.stock) {
        showToast(`Maximum available stock reached (${item.stock})`, 'info');
        return;
    }

    apiUpdateItemQuantity(bookId, targetQty);
    
    // Smooth inline DOM update
    $(`.cart-item-card[data-id="${bookId}"] input`).val(targetQty);
    $(`#subtotal-${bookId}`).text(`Rs. ${(item.price * targetQty).toLocaleString()}`);
}

function calculateAndRenderSummary() {
    const rawSubtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = rawSubtotal * state.discountRate;

    // Delivery Logic: Free if > 10,000
    let effectiveDelivery = state.deliveryFee;
    if (rawSubtotal >= 10000 || rawSubtotal === 0) {
        effectiveDelivery = 0;
    }

    const finalTotal = rawSubtotal - discountAmount + effectiveDelivery;

    $('#summary-subtotal').text(`Rs. ${rawSubtotal.toLocaleString()}`);

    if (state.discountRate > 0) {
        $('#applied-coupon-code').text(`(${state.appliedCoupon})`);
        $('#summary-discount').text(`-Rs. ${discountAmount.toLocaleString()}`);
        $('#discount-display-row').show();
    } else {
        $('#discount-display-row').hide();
    }

    if (effectiveDelivery === 0 && rawSubtotal > 0) {
        $('#summary-delivery').html('<span class="text-success">FREE</span>');
    } else {
        $('#summary-delivery').text(`Rs. ${effectiveDelivery.toLocaleString()}`);
    }

    $('#summary-total').text(`Rs. ${finalTotal.toLocaleString()}`);
}

function renderRecommendedBooks() {
    const grid = $('#recommended-books-grid').empty();
    recommendedBooksData.forEach(book => {
        grid.append(`
            <div class="book-card">
                <div class="card-image-container">
                    <button class="wishlist-card-btn" onclick="quickAddWishlist('${book.id}', '${book.title}')" title="Add to Wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    <img src="${book.coverImage}" alt="${book.title}">
                </div>
                <div class="card-body">
                    <h3 class="card-title">${book.title}</h3>
                    <p class="card-author">${book.author}</p>
                    <div class="stars">${renderStars(book.rating)}</div>
                    <div class="card-price">Rs. ${book.price.toLocaleString()}</div>
                    <button class="btn btn-outline btn-sm btn-block" onclick="quickAddToCart('${book.id}')">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `);
    });
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += (i <= Math.floor(rating)) ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
    }
    return stars;
}

// ==========================================================================
// Interactive Handlers
// ==========================================================================
function promptRemoveItem(bookId) {
    const item = state.cart.find(i => i.id === bookId);
    if (!item) return;

    state.itemPendingDelete = bookId;
    $('#modal-message').text(`Remove "${item.title}" from your cart?`);
    $('#confirm-modal').fadeIn(200);
}

function moveToWishlist(bookId) {
    const item = state.cart.find(i => i.id === bookId);
    if (!item) return;

    if (!state.wishlist.includes(bookId)) {
        state.wishlist.push(bookId);
        saveWishlistToStorage();
    }

    apiRemoveItem(bookId);
    showToast(`Moved "${item.title}" to wishlist`, 'success');
}

function quickAddToCart(bookId) {
    const existing = state.cart.find(i => i.id === bookId);
    if (existing) {
        existing.quantity += 1;
    } else {
        const rec = recommendedBooksData.find(b => b.id === bookId);
        if (rec) {
            state.cart.push({
                ...rec,
                quantity: 1,
                stock: 10
            });
        }
    }
    saveCartToStorage();
    renderCartUI();
    showToast(`Added item to cart!`, 'success');
}

function quickAddWishlist(bookId, title) {
    if (!state.wishlist.includes(bookId)) {
        state.wishlist.push(bookId);
        saveWishlistToStorage();
        showToast(`Added "${title}" to wishlist!`, 'success');
    } else {
        showToast(`Already in your wishlist`, 'info');
    }
}

function showCouponMessage(msg, type) {
    $('#coupon-message').text(msg).attr('class', `coupon-message ${type}`);
}

function showLoadingState() {
    $('#loading-state').show();
    $('#cart-content-layout, #empty-cart-state').hide();
}

function hideLoadingState() {
    $('#loading-state').hide();
}

function showToast(message, type = 'info') {
    const toast = $(`<div class="toast ${type}"><i class="fa-solid fa-circle-info"></i> ${message}</div>`);
    $('#toast-container').append(toast);
    setTimeout(() => {
        toast.fadeOut(300, function () { $(this).remove(); });
    }, 3000);
}

// ==========================================================================
// Global Event Binding
// ==========================================================================
function setupEventListeners() {
    // Theme Switcher
    $('#theme-toggle').on('click', function () {
        const currentTheme = $('html').attr('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        $('html').attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Mobile Navigation Toggle
    $('#mobile-menu-btn').on('click', function () {
        $('#mobile-nav').slideToggle();
    });

    // Confirmation Modal Events
    $('#modal-cancel-btn').on('click', function () {
        $('#confirm-modal').fadeOut(200);
        state.itemPendingDelete = null;
    });

    $('#modal-confirm-btn').on('click', function () {
        if (state.itemPendingDelete) {
            apiRemoveItem(state.itemPendingDelete);
            showToast('Item removed from cart', 'info');
            state.itemPendingDelete = null;
        }
        $('#confirm-modal').fadeOut(200);
    });

    // Coupon Application
    $('#apply-coupon-btn').on('click', function () {
        const code = $('#coupon-code-input').val();
        if (code) apiApplyCoupon(code);
    });

    // Checkout Handling
    $('#checkout-btn').on('click', function () {
        if (!state.cart || state.cart.length === 0) {
            showToast('Your cart is empty!', 'info');
            return;
        }
        window.location.href = 'checkout.html';
    });

    // AI Assistant Handlers
    $('#ai-trigger-btn').on('click', function () {
        $('#ai-chat-popup').toggle();
    });

    $('#ai-close-btn').on('click', function () {
        $('#ai-chat-popup').hide();
    });

    $('.ai-suggestion-chip').on('click', function () {
        handleAIChatSend($(this).text());
    });

    $('#ai-send-btn').on('click', function () {
        const text = $('#ai-input').val().trim();
        if (text) handleAIChatSend(text);
    });
}

// ==========================================================================
// AI Assistant Contextual Responses (POST /api/v1/ai/chat Prepared)
// ==========================================================================
function handleAIChatSend(userText) {
    const body = $('#ai-chat-body');
    body.append(`<div class="ai-message user-message">${userText}</div>`);
    $('#ai-input').val('');
    body.scrollTop(body[0].scrollHeight);

    setTimeout(() => {
        let response = "I'm here to help with your BookHaven order!";
        const query = userText.toLowerCase();

        if (query.includes('what is in my cart') || query.includes('cart')) {
            if (state.cart.length === 0) {
                response = "Your cart is currently empty.";
            } else {
                const titles = state.cart.map(i => `${i.quantity}x ${i.title}`).join(', ');
                response = `You have ${state.cart.length} unique title(s) in your cart: ${titles}.`;
            }
        } else if (query.includes('discount') || query.includes('coupon')) {
            response = "You can try promo codes 'BOOK10' for 10% off or 'SAVE20' for 20% off during checkout!";
        } else if (query.includes('under') || query.includes('3000') || query.includes('cheaper')) {
            response = "Recommendations under Rs. 3,000 include 'Atomic Habits' (Rs. 2,800) and 'The Hobbit' (Rs. 2,400).";
        } else if (query.includes('recommend') || query.includes('another book')) {
            response = "I highly recommend checking out 'The Psychology of Money' by Morgan Housel!";
        }

        body.append(`<div class="ai-message bot-message">${response}</div>`);
        body.scrollTop(body[0].scrollHeight);
    }, 450);
}