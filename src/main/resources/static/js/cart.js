/**
 * BookHaven - Cart Page Engine
 * Integrated with Spring Boot REST API & Wishlist API
 */

// Recommended Books Mock Data
const recommendedBooksData = [
    { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt", price: 5200, rating: 4.9, coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600" },
    { id: 4, title: "Atomic Habits", author: "James Clear", price: 2800, rating: 4.8, coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600" },
    { id: 5, title: "The Psychology of Money", author: "Morgan Housel", price: 3100, rating: 4.7, coverImage: "https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&q=80&w=600" },
    { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", price: 2400, rating: 4.9, coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600" }
];

// State Management
let state = {
    cart: [],
    wishlist: [], // Array of Book IDs
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
    setupEventListeners();
    fetchCartData();
    fetchWishlistData();
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

function updateHeaderBadges() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    $('#cart-badge').text(totalItems);
    $('#wishlist-badge').text(state.wishlist.length);
}

// Helper to retrieve auth header
function getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": "Bearer " + token } : {};
}

// Helper to normalize CartItemDTO object properties
function normalizeCartItem(item) {
    return {
        id: Number(item.bookId || item.id),
        cartItemId: item.id,
        title: item.title,
        author: item.author,
        category: item.category || 'General',
        price: Number(item.price || 0),
        quantity: item.quantity || 1,
        stock: item.stock !== undefined ? item.stock : 10,
        coverImage: item.coverImage || "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600"
    };
}

// ==========================================================================
// API Layer Integration - Cart & Wishlist Services
// ==========================================================================

/* GET /api/v1/wishlist */
function fetchWishlistData() {
    const token = localStorage.getItem("token");

    if (!token) {
        state.wishlist = [];
        updateHeaderBadges();
        return;
    }

    $.ajax({
        url: "/api/v1/wishlist",
        type: "GET",
        headers: getAuthHeader(),
        success: function (response) {
            if (response && response.status === 200 && response.body) {
                const items = response.body.wishlistItemDTOS || [];
                state.wishlist = items.map(item => Number(item.bookId)).filter(id => id != null);
            } else {
                state.wishlist = [];
            }
            updateHeaderBadges();
            renderRecommendedBooks();
        },
        error: function (xhr) {
            console.error("Failed to load wishlist:", xhr);
            state.wishlist = [];
            updateHeaderBadges();
        }
    });
}

/* POST /api/v1/wishlist/items/{bookId} */
function apiAddToWishlist(bookId, title = "", onSuccess = null) {
    const token = localStorage.getItem("token");

    if (!token) {
        showToast("Please login first!", "info");
        return;
    }

    $.ajax({
        url: `/api/v1/wishlist/items/${bookId}`,
        type: "POST",
        headers: getAuthHeader(),
        success: function (response) {
            const numericId = Number(bookId);
            if (!state.wishlist.includes(numericId)) {
                state.wishlist.push(numericId);
            }
            updateHeaderBadges();
            renderRecommendedBooks();
            showToast(title ? `"${title}" added to wishlist!` : "Added to wishlist!", "success");

            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        },
        error: function (xhr) {
            console.error("Failed to add to wishlist:", xhr);
            if (xhr.status === 401 || xhr.status === 403) {
                showToast("Please login first!", "info");
            } else {
                showToast("Failed to add book to wishlist.", "error");
            }
        }
    });
}

/* DELETE /api/v1/wishlist/items/{bookId} */
function apiRemoveFromWishlist(bookId) {
    const token = localStorage.getItem("token");

    if (!token) {
        showToast("Please login first!", "info");
        return;
    }

    $.ajax({
        url: `/api/v1/wishlist/items/${bookId}`,
        type: "DELETE",
        headers: getAuthHeader(),
        success: function () {
            const numericId = Number(bookId);
            state.wishlist = state.wishlist.filter(id => id !== numericId);
            updateHeaderBadges();
            renderRecommendedBooks();
            showToast("Removed from wishlist.", "info");
        },
        error: function (xhr) {
            console.error("Failed to remove from wishlist:", xhr);
            showToast("Failed to remove book from wishlist.", "error");
        }
    });
}

/* GET /api/customer/cart */
function fetchCartData() {
    const token = localStorage.getItem("token");

    if (!token) {
        state.cart = [];
        renderCartUI();
        return;
    }

    showLoadingState();

    $.ajax({
        url: "/api/customer/cart",
        type: "GET",
        headers: getAuthHeader(),
        success: function (response) {
            if (response && response.status === 200 && response.body) {
                const items = response.body.items || [];
                state.cart = items.map(normalizeCartItem);
            } else {
                state.cart = [];
            }
            renderCartUI();
        },
        error: function (xhr) {
            console.error("Failed to fetch cart:", xhr);
            state.cart = [];
            renderCartUI();
            if (xhr.status === 401) {
                showToast("Please login to view your cart.", "info");
            } else {
                showToast("Failed to load cart items.", "error");
            }
        }
    });
}

/* POST /api/customer/cart/items/{bookId}?quantity={quantity} */
function apiAddToCart(bookId, quantity = 1) {
    const token = localStorage.getItem("token");

    if (!token) {
        showToast("Please login first!", "info");
        return;
    }

    $.ajax({
        url: `/api/customer/cart/items/${bookId}?quantity=${quantity}`,
        type: "POST",
        headers: getAuthHeader(),
        success: function (response) {
            if (response && response.status === 200 && response.body) {
                const items = response.body.items || [];
                state.cart = items.map(normalizeCartItem);
                renderCartUI();
                showToast("Item added to cart!", "success");
            }
        },
        error: function (xhr) {
            console.error("Failed to add to cart:", xhr);
            if (xhr.status === 401 || xhr.status === 403) {
                showToast("Please login first!", "info");
            } else {
                showToast("Failed to add item to cart.", "error");
            }
        }
    });
}

/* PATCH /api/customer/cart/items/{bookId}?quantity={quantity} */
function apiUpdateItemQuantity(bookId, newQty) {
    const token = localStorage.getItem("token");

    if (!token) {
        showToast("Please login first!", "info");
        return;
    }

    $.ajax({
        url: `/api/customer/cart/items/${bookId}?quantity=${newQty}`,
        type: "PATCH",
        headers: getAuthHeader(),
        success: function (response) {
            if (response && response.status === 200 && response.body) {
                const items = response.body.items || [];
                state.cart = items.map(normalizeCartItem);
                renderCartUI();
            }
        },
        error: function (xhr) {
            console.error("Failed to update cart quantity:", xhr);
            showToast("Failed to update item quantity.", "error");
            fetchCartData();
        }
    });
}

/* DELETE /api/customer/cart/items/{bookId} */
function apiRemoveItem(bookId) {
    const token = localStorage.getItem("token");

    if (!token) {
        showToast("Please login first!", "info");
        return;
    }

    $.ajax({
        url: `/api/customer/cart/items/${bookId}`,
        type: "DELETE",
        headers: getAuthHeader(),
        success: function (response) {
            if (response && response.status === 200) {
                if (response.body && response.body.items) {
                    state.cart = response.body.items.map(normalizeCartItem);
                } else {
                    state.cart = state.cart.filter(i => Number(i.id) !== Number(bookId));
                }
                renderCartUI();
                showToast("Item removed from cart.", "info");
            }
        },
        error: function (xhr) {
            console.error("Failed to remove item:", xhr);
            showToast("Failed to remove item from cart.", "error");
        }
    });
}

/* POST Coupon Handler */
function apiApplyCoupon(code) {
    const formattedCode = code.trim().toUpperCase();

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
    updateHeaderBadges();

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
        const isWishlisted = state.wishlist.includes(Number(item.id));

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
                            <button class="action-icon-btn ${isWishlisted ? 'active' : ''}" onclick="moveToWishlist('${item.id}')" title="Move to Wishlist">
                                <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i> Wishlist
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
    const item = state.cart.find(i => Number(i.id) === Number(bookId));
    if (!item) return;

    const targetQty = item.quantity + delta;

    if (targetQty < 1) return;
    if (targetQty > item.stock) {
        showToast(`Maximum available stock reached (${item.stock})`, 'info');
        return;
    }

    apiUpdateItemQuantity(bookId, targetQty);
}

function calculateAndRenderSummary() {
    const rawSubtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = rawSubtotal * state.discountRate;

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
        const isWishlisted = state.wishlist.includes(Number(book.id));
        grid.append(`
            <div class="book-card">
                <div class="card-image-container">
                    <button class="wishlist-card-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${book.id}', '${book.title}')" title="Wishlist">
                        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
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
    const item = state.cart.find(i => Number(i.id) === Number(bookId));
    if (!item) return;

    state.itemPendingDelete = bookId;
    $('#modal-message').text(`Remove "${item.title}" from your cart?`);
    $('#confirm-modal').fadeIn(200);
}

function moveToWishlist(bookId) {
    const item = state.cart.find(i => Number(i.id) === Number(bookId));
    if (!item) return;

    const numericId = Number(bookId);

    if (!state.wishlist.includes(numericId)) {
        apiAddToWishlist(numericId, item.title, function () {
            apiRemoveItem(bookId);
        });
    } else {
        apiRemoveItem(bookId);
    }
}

function toggleWishlist(bookId, title) {
    const numericId = Number(bookId);

    if (state.wishlist.includes(numericId)) {
        apiRemoveFromWishlist(numericId);
    } else {
        apiAddToWishlist(numericId, title);
    }
}

function quickAddToCart(bookId) {
    apiAddToCart(bookId, 1);
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
            state.itemPendingDelete = null;
        }
        $('#confirm-modal').fadeOut(200);
    });

    // Coupon Application
    $('#apply-coupon-btn').on('click', function () {
        const code = $('#coupon-code-input').val();
        if (code) apiApplyCoupon(code);
    });

    // Checkout Handling - Save cart state to localStorage first
    $(document).on('click', '#checkout-btn, #btn-proceed-checkout, .proceed-to-checkout-btn', function (e) {
        e.preventDefault();

        if (!state.cart || state.cart.length === 0) {
            showToast('Your cart is empty!', 'info');
            return;
        }

        // Backup current cart to localStorage for checkout.html
        localStorage.setItem('bookhaven_cart', JSON.stringify(state.cart));

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
// AI Assistant Contextual Responses
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