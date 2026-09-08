/**
 * BookHaven - Book Details Page Engine
 * Prepared for Spring Boot REST API integration
 */

// ==========================================================================
// Static Mock Repository (Fallback data mimicking Spring Boot REST Payload)
// ==========================================================================


const mockReviewsDatabase = [
    {
        id: 101,
        author: "John Silva",
        rating: 5,
        comment: "Excellent book. Very useful for learning professional programming practices.",
        date: "August 15, 2026"
    },
    {
        id: 102,
        author: "Kamal Perera",
        rating: 5,
        comment: "A must-read for anyone serious about software engineering. The principles are timeless.",
        date: "July 28, 2026"
    },
    {
        id: 103,
        author: "Sarah Jenkins",
        rating: 4,
        comment: "Great examples, though some Java-specific code snippets are slightly dated. Still highly recommended!",
        date: "June 10, 2026"
    }
];

// Page Local State
let state = {
    bookId: null,
    currentBook: null,
    selectedQuantity: 1,
    isWishlisted: false,
    isLoggedIn: false, // Simulated user auth state
    cart: [],
    wishlist: []
};

// ==========================================================================
// DOM Ready Entry Point
// ==========================================================================
$(document).ready(function () {
    initTheme();
    extractUrlParams();
    setupEventListeners();
    loadBookData();
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

function extractUrlParams() {
    const params = new URLSearchParams(window.location.search);
    state.bookId = params.get("id"); // Default to 1 if unspecified

    if(!state.bookId){
        showNotFoundState();
    }
}

// ==========================================================================
// REST API Abstraction Layer (Spring Boot Integration Ready)
// ==========================================================================

function loadBookData() {
    showLoadingState();

    $.ajax({
        // FIX: Replaced quotes with backticks for template string evaluation
        url: `/api/v1/books/${state.bookId}`,
        type: "GET",
        contentType: "application/json",
        success: function(response) {
            console.log("Book API Response:", response);

            if (response && response.body) {
                state.currentBook = response.body;
                renderBookDetails(state.currentBook);
                renderReviews(mockReviewsDatabase);
                renderRelatedBooks();
                showDetailContent();
            } else {
                showNotFoundState();
            }
        },
        error: function (xhr, status, error) {
            console.error("Book API Error:", error);
            showNotFoundState();
            showToast("Failed to load book details", "info");
        }
    });
}
// ==========================================================================
// DOM Renderers
// ==========================================================================
function renderBookDetails(book) {
    // Page Title & Breadcrumb
    document.title = `${book.title} - BookHaven`;
    $('#breadcrumb-title').text(book.title);

    // Left Gallery
    $('#main-book-cover').attr('src', book.coverImage);
    if (book.badge) {
        $('#product-badge').text(book.badge).show();
        if (book.badge.toLowerCase().includes('seller')) {
            $('#product-badge').addClass('bestseller');
        }
    } else {
        $('#product-badge').hide();
    }

    const thumbContainer = $('#thumbnail-gallery').empty();
    if (book.thumbnails && book.thumbnails.length > 0) {
        book.thumbnails.forEach((imgUrl, idx) => {
            thumbContainer.append(`
                <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="switchMainImage('${imgUrl}', this)">
                    <img src="${imgUrl}" alt="Thumbnail">
                </div>
            `);
        });
    }

    // Right Info
    $('#book-title').text(book.title);
    $('#book-author').text(book.author);
    $('#book-category').text(book.category);
    $('#book-isbn').text(book.isbn);
    $('#book-stars').html(renderStars(book.rating));
    $('#book-rating-num').text(book.rating.toFixed(1));
    $('#book-review-count').text(book.reviewCount);
    $('#book-short-desc').text(book.shortDescription);

    // Pricing
    $('#book-price').text(`Rs. ${book.price.toLocaleString()}`);
    if (book.originalPrice > book.price) {
        $('#book-original-price').text(`Rs. ${book.originalPrice.toLocaleString()}`).show();
        const discountPct = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
        $('#book-discount-badge').text(`${discountPct}% OFF`).show();
    } else {
        $('#book-original-price').hide();
        $('#book-discount-badge').hide();
    }

    // Stock Status
    renderStockInfo(book.stock);

    // Quantity & Subtotal Initial
    state.selectedQuantity = 1;
    $('#qty-input').val(1);
    updateSubtotal();

    // Tab Contents
    $('#full-description-text').text(book.fullDescription);
    $('#table-title').text(book.title);
    $('#table-author').text(book.author);
    $('#table-isbn').text(book.isbn);
    $('#table-publisher').text(book.publisher || 'N/A');
    $('#table-pub-date').text(book.pubDate || 'N/A');
    $('#table-pages').text(book.pages || 'N/A');
    $('#table-language').text(book.language || 'English');
    $('#table-category').text(book.category);

    // Social Sharing Links setup
    const currentUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(`Check out "${book.title}" on BookHaven!`);
    $('#share-facebook').attr('href', `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`);
    $('#share-whatsapp').attr('href', `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`);
    $('#share-twitter').attr('href', `https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`);
}

function renderStockInfo(stock) {
    const container = $('#stock-info-container').empty();
    const addBtn = $('#add-to-cart-btn');
    const buyBtn = $('#buy-now-btn');

    if (stock > 5) {
        container.attr('class', 'stock-info in-stock')
            .html(`<i class="fa-solid fa-circle-check"></i> In Stock (${stock} books available)`);
        addBtn.prop('disabled', false);
        buyBtn.prop('disabled', false);
    } else if (stock > 0 && stock <= 5) {
        container.attr('class', 'stock-info low-stock')
            .html(`<i class="fa-solid fa-triangle-exclamation"></i> Only ${stock} left in stock - order soon!`);
        addBtn.prop('disabled', false);
        buyBtn.prop('disabled', false);
    } else {
        container.attr('class', 'stock-info out-stock')
            .html(`<i class="fa-solid fa-circle-xmark"></i> Out of Stock`);
        addBtn.prop('disabled', true);
        buyBtn.prop('disabled', true);
    }
}

function renderReviews(reviews) {
    $('#tab-review-count, #summary-total-count').text(reviews.length);
    $('#summary-score').text(state.currentBook.rating.toFixed(1));
    $('#summary-stars').html(renderStars(state.currentBook.rating));

    // Ratings breakdown simulation
    const breakdownHTML = `
        <div class="breakdown-row"><span class="star-label">5 <i class="fa-solid fa-star stars"></i></span><div class="progress-bar"><div class="progress-fill" style="width: 80%;"></div></div><span class="percent-label">80%</span></div>
        <div class="breakdown-row"><span class="star-label">4 <i class="fa-solid fa-star stars"></i></span><div class="progress-bar"><div class="progress-fill" style="width: 15%;"></div></div><span class="percent-label">15%</span></div>
        <div class="breakdown-row"><span class="star-label">3 <i class="fa-solid fa-star stars"></i></span><div class="progress-bar"><div class="progress-fill" style="width: 3%;"></div></div><span class="percent-label">3%</span></div>
        <div class="breakdown-row"><span class="star-label">2 <i class="fa-solid fa-star stars"></i></span><div class="progress-bar"><div class="progress-fill" style="width: 1%;"></div></div><span class="percent-label">1%</span></div>
        <div class="breakdown-row"><span class="star-label">1 <i class="fa-solid fa-star stars"></i></span><div class="progress-bar"><div class="progress-fill" style="width: 1%;"></div></div><span class="percent-label">1%</span></div>
    `;
    $('#rating-breakdown-container').html(breakdownHTML);

    // List Rendering
    const listContainer = $('#reviews-list-container').empty();
    reviews.forEach(rev => {
        listContainer.append(`
            <div class="review-card">
                <div class="review-header">
                    <span class="reviewer-name">${rev.author}</span>
                    <span class="review-date">${rev.date}</span>
                </div>
                <div class="stars" style="margin-bottom: 0.4rem;">${renderStars(rev.rating)}</div>
                <p class="review-comment">"${rev.comment}"</p>
            </div>
        `);
    });

    // Auth visibility check
    if (state.isLoggedIn) {
        $('#user-review-form').show();
        $('#guest-review-prompt').hide();
    } else {
        $('#user-review-form').hide();
        $('#guest-review-prompt').show();
    }
}

function renderRelatedBooks() {
    const container = $('#related-books-grid').empty();
    const relatedList = mockBooksDatabase.filter(b => b.id !== state.bookId);

    relatedList.forEach(book => {
        container.append(`
            <div class="book-card">
                <div class="card-image-container">
                    <button class="wishlist-card-btn" onclick="event.stopPropagation(); showToast('Added to wishlist', 'info');">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    <img src="${book.coverImage}" alt="${book.title}">
                </div>
                <div class="card-body">
                    <h3 class="card-title">${book.title}</h3>
                    <p class="card-author">${book.author}</p>
                    <div class="stars" style="font-size:0.8rem; margin-bottom: 0.4rem;">${renderStars(book.rating)}</div>
                    <div class="card-price-row">Rs. ${book.price.toLocaleString()}</div>
                    <div class="card-actions">
                        <a href="book-details.html?id=${book.id}" class="btn btn-outline btn-sm">Details</a>
                        <button class="btn btn-primary btn-sm" onclick="showToast('Added ${book.title} to cart!', 'success')">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `);
    });
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fa-solid fa-star"></i>';
        } else if (i - rating < 1) {
            stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        } else {
            stars += '<i class="fa-regular fa-star"></i>';
        }
    }
    return stars;
}

// ==========================================================================
// View State Switchers
// ==========================================================================
function showLoadingState() {
    $('#loading-state').show();
    $('#book-detail-content, #not-found-state').hide();
}

function showDetailContent() {
    $('#loading-state, #not-found-state').hide();
    $('#book-detail-content').fadeIn(200);
}

function showNotFoundState() {
    $('#loading-state, #book-detail-content').hide();
    $('#not-found-state').show();
}

// ==========================================================================
// Event Listeners & Interactions
// ==========================================================================
function setupEventListeners() {
    // Theme Switch
    $('#theme-toggle').on('click', function () {
        const currentTheme = $('html').attr('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        $('html').attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Mobile Navigation Toggle
    $('#mobile-menu-btn').on('click', function() {
        $('#mobile-nav').slideToggle();
    });

    // Quantity Selector Actions
    $('#qty-minus').on('click', function () {
        if (state.selectedQuantity > 1) {
            state.selectedQuantity--;
            $('#qty-input').val(state.selectedQuantity);
            updateSubtotal();
        }
    });

    $('#qty-plus').on('click', function () {
        if (state.currentBook && state.selectedQuantity < state.currentBook.stock) {
            state.selectedQuantity++;
            $('#qty-input').val(state.selectedQuantity);
            updateSubtotal();
        } else {
            showToast(`Maximum available stock reached (${state.currentBook.stock})`, 'info');
        }
    });

    // Tab Switching Logic
    $('.tab-btn').on('click', function () {
        const targetTab = $(this).data('tab');
        $('.tab-btn').removeClass('active');
        $('.tab-content').removeClass('active');
        $(this).addClass('active');
        $(`#${targetTab}`).addClass('active');
    });

    // Shopping Action Buttons
    $('#add-to-cart-btn').on('click', function () {
        state.cart.push({ book: state.currentBook, qty: state.selectedQuantity });
        $('#cart-badge').text(state.cart.length);
        showToast(`Added ${state.selectedQuantity} x "${state.currentBook.title}" to cart!`, 'success');
    });

    $('#buy-now-btn').on('click', function () {
        // Direct navigation to checkout with selected book item
        window.location.href = `checkout.html?buyNowId=${state.currentBook.id}&qty=${state.selectedQuantity}`;
    });

    $('#wishlist-toggle-btn').on('click', function () {
        state.isWishlisted = !state.isWishlisted;
        const icon = $(this).find('i');
        
        if (state.isWishlisted) {
            $(this).addClass('active');
            icon.removeClass('fa-regular').addClass('fa-solid');
            state.wishlist.push(state.currentBook.id);
            showToast(`Added "${state.currentBook.title}" to wishlist!`, 'success');
        } else {
            $(this).removeClass('active');
            icon.removeClass('fa-solid').addClass('fa-regular');
            state.wishlist = state.wishlist.filter(id => id !== state.currentBook.id);
            showToast(`Removed from wishlist`, 'info');
        }
        $('#wishlist-badge').text(state.wishlist.length);
    });

    // Social Copy Link
    $('#copy-link-btn').on('click', function () {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Book link copied!', 'success');
        });
    });

    // Review Form Submission (Prepare POST /api/v1/books/{bookId}/reviews)
    $('#review-form').on('submit', function (e) {
        e.preventDefault();
        const rating = $('input[name="userRating"]:checked').val();
        const comment = $('#review-comment').val();

        if (!rating) {
            showToast('Please select a star rating.', 'info');
            return;
        }

        /* Spring Boot REST API Endpoint:
        $.ajax({
            url: `/api/v1/books/${state.bookId}/reviews`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ rating: rating, comment: comment }),
            success: function(response) { ... }
        });
        */

        // Local UI update simulation
        mockReviewsDatabase.unshift({
            id: Date.now(),
            author: "Current User",
            rating: parseInt(rating),
            comment: comment,
            date: "Just Now"
        });

        renderReviews(mockReviewsDatabase);
        $('#review-comment').val('');
        $('input[name="userRating"]').prop('checked', false);
        showToast('Thank you! Your review has been submitted.', 'success');
    });

    // Login Prompt Simulators
    $('#login-btn, #prompt-login-btn').on('click', function (e) {
        e.preventDefault();
        state.isLoggedIn = !state.isLoggedIn; // Toggle auth state for demo
        showToast(state.isLoggedIn ? "Logged in as Demo User" : "Logged out", "info");
        $('#login-btn').text(state.isLoggedIn ? "Logout" : "Login");
        if (state.currentBook) renderReviews(mockReviewsDatabase);
    });

    // AI Floating Assistant
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

function switchMainImage(src, element) {
    $('#main-book-cover').attr('src', src);
    $('.thumb-item').removeClass('active');
    $(element).addClass('active');
}

function updateSubtotal() {
    if (!state.currentBook) return;
    const subtotal = state.currentBook.price * state.selectedQuantity;
    $('#subtotal-price').text(`Rs. ${subtotal.toLocaleString()}`);
}

function showToast(message, type = 'info') {
    const toast = $(`<div class="toast ${type}"><i class="fa-solid fa-circle-check"></i> ${message}</div>`);
    $('#toast-container').append(toast);
    setTimeout(() => {
        toast.fadeOut(300, function() { $(this).remove(); });
    }, 3000);
}

// ==========================================================================
// Context-Aware AI Chat Engine (POST /api/v1/ai/chat)
// ==========================================================================
function handleAIChatSend(text) {
    const body = $('#ai-chat-body');
    body.append(`<div class="ai-message user-message">${text}</div>`);
    $('#ai-input').val('');
    body.scrollTop(body[0].scrollHeight);

    // AI Response Simulation using current book context
    setTimeout(() => {
        let response = "I can answer questions regarding this book's content, difficulty, or price comparisons!";
        const lower = text.toLowerCase();
        const bookTitle = state.currentBook ? state.currentBook.title : "this book";

        if (lower.includes('beginner')) {
            response = `${bookTitle} is suitable for readers who already possess basic foundational knowledge. If you're a complete beginner, I can recommend more introductory guides.`;
        } else if (lower.includes('similar') || lower.includes('recommend')) {
            response = `If you like ${bookTitle}, you might also enjoy 'The Pragmatic Programmer' or 'Effective Java'.`;
        } else if (lower.includes('cheaper') || lower.includes('alternative')) {
            response = `For budget-friendly options in ${state.currentBook ? state.currentBook.category : 'this genre'}, check out 'The Alchemist' or '1984'.`;
        }

        body.append(`<div class="ai-message bot-message">${response}</div>`);
        body.scrollTop(body[0].scrollHeight);
    }, 500);
}