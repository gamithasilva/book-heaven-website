/**
 * BookHaven - Home Page Interactive Engine
 * Connected to Spring Boot REST API (api/v1/books, api/v1/wishlist, api/customer/cart)
 */

// App State Management
let cartCount = 0;
let wishlistCount = 0;
let booksList = [];
let userWishlistBookIds = [];
let userCart = [];

$(document).ready(function() {
    checkLoginStatus();
    loadCartAPI();     // Loads active user cart on init
    loadWishlist();    // Loads wishlist IDs first, then fetches & renders books
    startCountdown();
    setupEventListeners();
});

// ==========================================================================
// 1. Authentication & Status Checks
// ==========================================================================
function isUserLoggedIn() {
    const token = localStorage.getItem("token");
    return token !== null && token !== "";
}

function checkLoginStatus() {
    if (isUserLoggedIn()) {
        $('#register-btn').hide();
        $('#login-btn').hide();
        $('#logout-btn').show();
        $('#profile-btn').show();
    } else {
        $('#login-btn').show();
        $('#register-btn').show();
        $('#logout-btn').hide();
        $('#profile-btn').hide();
    }
}

// ==========================================================================
// 2. REST API Integration (Cart Operations)
// ==========================================================================

// Fetch User Cart from Spring Boot API
function loadCartAPI() {
    const token = localStorage.getItem("token");

    if (!token) {
        userCart = [];
        updateCartBadge();
        return;
    }

    $.ajax({
        url: "api/customer/cart",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function(response) {
            if (response.status === 200 && response.body) {
                userCart = response.body.items || [];
            } else {
                userCart = [];
            }
            updateCartBadge();
        },
        error: function(xhr) {
            console.error("Failed to load cart:", xhr);
            userCart = [];
            updateCartBadge();
        }
    });
}

// Add Item to Cart API
function addToCartAPI(bookId, quantity = 1) {
    const token = localStorage.getItem("token");

    if (!token) {
        showToast("Please log in first.");
        return;
    }

    $.ajax({
        url: `api/customer/cart/items/${bookId}?quantity=${quantity}`,
        type: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function(response) {
            if (response.status === 200) {
                userCart = response.body?.items || [];
                updateCartBadge();
                showToast("Added book to cart!");
            }
        },
        error: function(xhr) {
            console.error("Add to cart error:", xhr);
            if (xhr.status === 401 || xhr.status === 403) {
                showToast("Please log in first.");
                return;
            }
            showToast("Failed to add book to cart.");
        }
    });
}

// Update Item Quantity in Cart API
function updateCartQuantityAPI(itemId, newQuantity) {
    const token = localStorage.getItem("token");

    if (!token) return;

    if (newQuantity <= 0) {
        removeFromCartAPI(itemId);
        return;
    }

    $.ajax({
        url: `api/customer/cart/items/${itemId}?quantity=${newQuantity}`,
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function(response) {
            if (response.status === 200) {
                userCart = response.body?.items || [];
                updateCartBadge();
                showToast("Cart updated.");
            }
        },
        error: function(xhr) {
            console.error("Failed to update cart quantity:", xhr);
            showToast("Failed to update cart quantity.");
        }
    });
}

// Remove Item from Cart API
function removeFromCartAPI(itemId) {
    const token = localStorage.getItem("token");

    if (!token) return;

    $.ajax({
        url: `api/customer/cart/items/${itemId}`,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function(response) {
            if (response.status === 200) {
                userCart = response.body?.items || [];
                updateCartBadge();
                showToast("Item removed from cart.");
            }
        },
        error: function(xhr) {
            console.error("Failed to remove item from cart:", xhr);
            showToast("Failed to remove item from cart.");
        }
    });
}

// Clear Entire Cart API
function clearCartAPI() {
    const token = localStorage.getItem("token");

    if (!token) return;

    $.ajax({
        url: "api/customer/cart/clear",
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function(response) {
            userCart = [];
            updateCartBadge();
            showToast("Cart cleared.");
        },
        error: function(xhr) {
            console.error("Failed to clear cart:", xhr);
            showToast("Failed to clear cart.");
        }
    });
}

// Calculate total quantity & update DOM badge
function updateCartBadge() {
    cartCount = userCart.reduce((total, item) => total + (item.quantity || 0), 0);
    $('#cart-badge').text(cartCount);
}

// ==========================================================================
// 3. REST API Integration (Books & Wishlist)
// ==========================================================================

// Fetch Wishlist from Spring Boot API
function loadWishlist() {
    const token = localStorage.getItem("token");

    if (!token) {
        userWishlistBookIds = [];
        updateWishlistBadge();
        fetchBooksAPI();
        return;
    }

    $.ajax({
        url: "api/v1/wishlist",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function(response) {
            const wishlist = response.body;
            const items = wishlist?.wishlistItemDTOS || [];

            userWishlistBookIds = items
                .map(item => item.bookId)
                .filter(id => id != null);

            wishlistCount = userWishlistBookIds.length;
            updateWishlistBadge();
            fetchBooksAPI();
        },
        error: function(xhr) {
            console.error("Failed to load wishlist:", xhr);
            userWishlistBookIds = [];
            updateWishlistBadge();
            fetchBooksAPI();
        }
    });
}

// Fetch Books from Spring Boot API
function fetchBooksAPI() {
    $.ajax({
        url: "api/v1/books/getAll",
        type: "GET",
        success: function(response) {
            if (response.status === 200 && Array.isArray(response.body)) {
                booksList = response.body.slice(0, 8);
            } else {
                booksList = [];
            }
            renderBooks(booksList);
        },
        error: function(xhr, status, error) {
            console.error("Failed to load books:", error);
            booksList = [];
            renderBooks(booksList);
        }
    });
}

// Add Item to Wishlist API
function addToWishlistAPI(bookId, $button) {
    const token = localStorage.getItem("token");

    $.ajax({
        url: `api/v1/wishlist/items/${bookId}`,
        type: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function() {
            if (!userWishlistBookIds.includes(bookId)) {
                userWishlistBookIds.push(bookId);
            }
            wishlistCount = userWishlistBookIds.length;
            updateWishlistBadge();

            $button.addClass('active');
            $button.find('i').removeClass('fa-regular').addClass('fa-solid');
            showToast('Added to Wishlist!');
        },
        error: function(xhr) {
            console.error("Wishlist error:", xhr);
            showToast('Failed to add book to wishlist.');
        }
    });
}

// Remove Item from Wishlist API
function removeFromWishlistAPI(bookId, $button) {
    const token = localStorage.getItem("token");

    $.ajax({
        url: `api/v1/wishlist/items/${bookId}`,
        type: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function() {
            userWishlistBookIds = userWishlistBookIds.filter(id => id !== bookId);
            wishlistCount = userWishlistBookIds.length;
            updateWishlistBadge();

            $button.removeClass('active');
            $button.find('i').removeClass('fa-solid').addClass('fa-regular');
            showToast('Removed from Wishlist.');
        },
        error: function(xhr) {
            console.error("Failed to remove wishlist item:", xhr);
            showToast('Failed to remove book from wishlist.');
        }
    });
}

function updateWishlistBadge() {
    $('#wishlist-badge').text(wishlistCount);
}

// ==========================================================================
// 4. Render Books Grid
// ==========================================================================
function renderBooks(books) {
    const $grid = $('#book-grid');
    $grid.empty();

    if (!books || books.length === 0) {
        $grid.append('<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No books match your criteria.</p>');
        return;
    }

    books.forEach(book => {
        const isWishlisted = userWishlistBookIds.includes(book.id);
        const categoryName = book.categoryName || book.category || 'General';
        const coverImg = book.coverImage || book.cover;

        const discountTag = book.badge
            ? `<span class="discount-badge">${book.badge}</span>`
            : (book.discount ? `<span class="discount-badge">${book.discount}</span>` : '');

        const oldPriceTag = book.originalPrice > book.price
            ? `<span class="old-price">Rs. ${book.originalPrice.toLocaleString()}</span>`
            : (book.oldPrice ? `<span class="old-price">Rs. ${book.oldPrice.toLocaleString()}</span>` : '');

        const bookCard = `
            <article class="book-card" data-id="${book.id}">
                <div class="book-cover-container">
                    <img src="${coverImg}" alt="${book.title}" class="book-cover" loading="lazy">
                    ${discountTag}
                    <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" aria-label="Add to wishlist">
                        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                </div>
                <div class="book-details">
                    <span class="book-category">${categoryName}</span>
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">by ${book.author}</p>
                    <div class="book-rating">
                        <i class="fa-solid fa-star"></i>
                        <span>${book.rating || 0} (${book.reviewCount || book.reviews || 0})</span>
                    </div>
                    <div class="book-price">
                        <span class="current-price">Rs. ${book.price.toLocaleString()}</span>
                        ${oldPriceTag}
                    </div>
                    <div class="book-actions">
                        <button class="btn btn-primary btn-sm add-to-cart-btn" ${book.stock === 0 ? 'disabled' : ''}>
                            <i class="fa-solid fa-cart-plus"></i> Add
                        </button>
                        <a href="book-details.html?id=${book.id}" class="btn btn-secondary btn-sm">Details</a>
                    </div>
                </div>
            </article>
        `;
        $grid.append(bookCard);
    });
}

// ==========================================================================
// 5. UI Events & Handlers
// ==========================================================================
function setupEventListeners() {
    // Theme Toggle
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        $('html').attr('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    $('#theme-toggle').on('click', function() {
        const currentTheme = $('html').attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        $('html').attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Mobile Navigation & Search Overlay
    $('#hamburger').on('click', function() {
        $('#nav-menu').toggleClass('active');
    });

    $('#search-toggle').on('click', function() {
        $('#search-bar').addClass('active');
        $('#search-input').focus();
    });

    $('#close-search').on('click', function() {
        $('#search-bar').removeClass('active');
    });

    // Live Search Filter
    $('#search-input').on('keyup', function() {
        const query = $(this).val().toLowerCase();
        const filtered = booksList.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        );
        renderBooks(filtered);
    });

    // Category Navigation
    $('.category-card').on('click', function() {
        const category = $(this).data('category');
        window.location.href = `books.html?category=${category}`;
    });

    // Newsletter Validation
    $('#newsletter-form').on('submit', function(e) {
        e.preventDefault();
        const email = $('#newsletter-email').val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            $('#email-error').show();
        } else {
            $('#email-error').hide();
            showToast('Subscription successful!');
            $(this)[0].reset();
        }
    });

    // AI Chat Assistant Widget
    $('#ai-toggle-btn').on('click', function() {
        $('#ai-chat-popup').toggleClass('hidden');
    });

    $('#close-chat').on('click', function() {
        $('#ai-chat-popup').addClass('hidden');
    });

    $('.chip-btn').on('click', function() {
        const query = $(this).data('query');
        handleAiChatSubmit(query);
    });

    $('#ai-chat-form').on('submit', function(e) {
        e.preventDefault();
        const message = $('#ai-input').val().trim();
        if (message) {
            handleAiChatSubmit(message);
            $('#ai-input').val('');
        }
    });

    // Logout Action
    $('#logout-btn').on('click', function() {
        if (isUserLoggedIn()) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            localStorage.removeItem("role");

            userCart = [];
            checkLoginStatus();
            loadWishlist();
            updateCartBadge();
            showToast('Logged out successfully!');
        }
    });

    // Protected Route Triggers
    $('#cart-btn, #wishlist-btn, #profile-btn').on('click', function(e) {
        if (!isUserLoggedIn()) {
            e.preventDefault();
            showToast('Please log in first.');
        }
    });
}

// Global Wishlist Button Click Event
$(document).on('click', '.wishlist-btn', function(e) {
    e.preventDefault();

    if (!isUserLoggedIn()) {
        showToast('Please log in first.');
        return;
    }

    const $button = $(this);
    const bookId = $button.closest('.book-card').data('id');
    const isWishlisted = userWishlistBookIds.includes(bookId);

    if (isWishlisted) {
        removeFromWishlistAPI(bookId, $button);
    } else {
        addToWishlistAPI(bookId, $button);
    }
});

// Global Add to Cart Click Event
$(document).on('click', '.add-to-cart-btn', function(e) {
    e.preventDefault();

    if (!isUserLoggedIn()) {
        showToast('Please log in first.');
        return;
    }

    const bookId = $(this).closest('.book-card').data('id');
    addToCartAPI(bookId, 1);
});

// ==========================================================================
// 6. Utilities & Helpers
// ==========================================================================
function updateThemeIcon(theme) {
    const $icon = $('#theme-toggle i');
    if (theme === 'dark') {
        $icon.removeClass('fa-moon').addClass('fa-sun');
    } else {
        $icon.removeClass('fa-sun').addClass('fa-moon');
    }
}

function startCountdown() {
    let duration = (2 * 24 * 60 * 60) + (12 * 60 * 60) + (35 * 60) + 20;

    setInterval(function() {
        if (duration <= 0) return;

        const days = Math.floor(duration / (24 * 3600));
        const hours = Math.floor((duration % (24 * 3600)) / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);

        $('#days').text(String(days).padStart(2, '0'));
        $('#hours').text(String(hours).padStart(2, '0'));
        $('#minutes').text(String(minutes).padStart(2, '0'));
        $('#seconds').text(String(seconds).padStart(2, '0'));

        duration--;
    }, 1000);
}

function showToast(message) {
    $('#toast-message').text(message);
    $('#toast').removeClass('hidden');

    setTimeout(function() {
        $('#toast').addClass('hidden');
    }, 2500);
}

function handleAiChatSubmit(message) {
    appendChatMessage(message, 'user');
    setTimeout(() => {
        const botReply = generateMockAiResponse(message);
        appendChatMessage(botReply, 'bot');
    }, 600);
}

function appendChatMessage(text, sender) {
    const $chatBody = $('#chat-body');
    const messageHtml = `<div class="chat-message ${sender}"><p>${text}</p></div>`;
    $chatBody.append(messageHtml);
    $chatBody.scrollTop($chatBody[0].scrollHeight);
}

function generateMockAiResponse(query) {
    const q = query.toLowerCase();
    if (q.includes('fantasy')) {
        return "I highly recommend starting with 'The Hobbit' by J.R.R. Tolkien or 'Harry Potter'. Both are iconic choices!";
    } else if (q.includes('3000') || q.includes('under')) {
        return "Great options under Rs. 3000 include 'The Psychology of Money' (Rs. 2,900) and 'Harry Potter' (Rs. 2,800).";
    } else if (q.includes('programming') || q.includes('code')) {
        return "You can check out 'Clean Code' by Robert C. Martin or 'The Pragmatic Programmer' for career-defining insights.";
    } else if (q.includes('harry potter')) {
        return "If you like Harry Potter, you will love 'The Hobbit' or 'Percy Jackson' series!";
    } else {
        return `I'm ready to help you discover books related to "${query}". Check our Featured section for live recommendations!`;
    }
}