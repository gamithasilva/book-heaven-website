/**
 * BookHaven - Books Page Interactive Engine
 * Prepared for Spring Boot REST API integration
 */

// ==========================================================================
// Sample Data Store (Mimics Spring Boot API Data Payload)
// ==========================================================================
const sampleBooks = [
    {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        price: 4500,
        originalPrice: 5000,
        rating: 4.8,
        reviewCount: 245,
        stock: 15,
        language: "English",
        badge: "Discount",
        coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400",
        isbn: "9780132350884"
    },
    {
        id: 2,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        category: "Fantasy",
        price: 2800,
        originalPrice: 3200,
        rating: 4.9,
        reviewCount: 1280,
        stock: 42,
        language: "English",
        badge: "New",
        coverImage: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?auto=format&fit=crop&q=80&w=400",
        isbn: "9780747532743"
    },
    {
        id: 3,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Business",
        price: 3500,
        originalPrice: 3500,
        rating: 4.8,
        reviewCount: 890,
        stock: 20,
        language: "English",
        badge: null,
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
        isbn: "9780735211292"
    },
    {
        id: 4,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        category: "Fantasy",
        price: 2600,
        originalPrice: 3000,
        rating: 4.7,
        reviewCount: 650,
        stock: 0,
        language: "English",
        badge: "Discount",
        coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
        isbn: "9780261102217"
    },
    {
        id: 5,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "Business",
        price: 3100,
        originalPrice: 3500,
        rating: 4.6,
        reviewCount: 420,
        stock: 8,
        language: "English",
        badge: null,
        coverImage: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=400",
        isbn: "9780857197689"
    },
    {
        id: 6,
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction",
        price: 2200,
        originalPrice: 2200,
        rating: 4.5,
        reviewCount: 1100,
        stock: 18,
        language: "English",
        badge: null,
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400",
        isbn: "9780062315007"
    },
    {
        id: 7,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt & David Thomas",
        category: "Programming",
        price: 5200,
        originalPrice: 6000,
        rating: 4.9,
        reviewCount: 310,
        stock: 5,
        language: "English",
        badge: "Discount",
        coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400",
        isbn: "9780135957059"
    },
    {
        id: 8,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        category: "Business",
        price: 2750,
        originalPrice: 3000,
        rating: 4.7,
        reviewCount: 950,
        stock: 12,
        language: "English",
        badge: null,
        coverImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=400",
        isbn: "9781612680194"
    },
    {
        id: 9,
        title: "1984",
        author: "George Orwell",
        category: "Science Fiction",
        price: 1950,
        originalPrice: 2400,
        rating: 4.8,
        reviewCount: 820,
        stock: 25,
        language: "English",
        badge: "Discount",
        coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400",
        isbn: "9780451524935"
    },
    {
        id: 10,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        price: 1800,
        originalPrice: 1800,
        rating: 4.4,
        reviewCount: 540,
        stock: 0,
        language: "English",
        badge: null,
        coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400",
        isbn: "9780743273565"
    },
    {
        id: 11,
        title: "The Lean Startup",
        author: "Eric Ries",
        category: "Business",
        price: 3800,
        originalPrice: 4200,
        rating: 4.5,
        reviewCount: 380,
        stock: 10,
        language: "English",
        badge: "New",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
        isbn: "9780307887894"
    },
    {
        id: 12,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Programming",
        price: 8500,
        originalPrice: 9500,
        rating: 4.9,
        reviewCount: 190,
        stock: 4,
        language: "English",
        badge: "Discount",
        coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400",
        isbn: "9780262033848"
    }
];

// Application State Tracking
let state = {
    books: [],
    filteredBooks: [],
    cart: [],
    wishlist: [],
    currentPage: 1,
    pageSize: 8,
    selectedCategory: "All",
    searchQuery: "",
    maxPrice: 10000,
    minRating: 0,
    stockFilters: { inStock: true, outOfStock: true },
    languages: ["English", "Sinhala", "Tamil"],
    sortBy: "recommended"
};

// ==========================================================================
// Initialization and Theme Engine
// ==========================================================================
$(document).ready(function () {
    initTheme();
    fetchBooksAPI(); // Local initial load
    setupEventListeners();
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

// ==========================================================================
// REST API Abstraction Layer (Spring Boot Integration Points)
// ==========================================================================
function fetchBooksAPI(page = 0, size = 12) {
    showLoading(true);

    // Placeholder: Simulate API Network Latency
    setTimeout(() => {
        /* Future Integration:
        $.get(`/api/v1/books?page=${page}&size=${size}`, function(data) {
            state.books = data.content;
            applyFiltersAndSort();
        });
        */
        state.books = [...sampleBooks];
        applyFiltersAndSort();
        showLoading(false);
    }, 400);
}

function fetchBookByIdAPI(id) {
    // GET /api/v1/books/{id}
    window.location.href = `book-details.html?id=${id}`;
}

// ==========================================================================
// Filtering & Sorting Logic
// ==========================================================================
function applyFiltersAndSort() {
    let result = state.books.filter(book => {
        // Search Query Filter
        const matchesSearch = !state.searchQuery || 
            book.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            book.isbn.includes(state.searchQuery);

        // Category Filter
        const matchesCategory = state.selectedCategory === "All" || book.category === state.selectedCategory;

        // Price Filter
        const matchesPrice = book.price <= state.maxPrice;

        // Rating Filter
        const matchesRating = book.rating >= state.minRating;

        // Stock Filter
        const isInStock = book.stock > 0;
        const matchesStock = (isInStock && state.stockFilters.inStock) || (!isInStock && state.stockFilters.outOfStock);

        // Language Filter
        const matchesLanguage = state.languages.includes(book.language);

        return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock && matchesLanguage;
    });

    // Sorting
    switch (state.sortBy) {
        case "price-low":
            result.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            result.sort((a, b) => b.price - a.price);
            break;
        case "rating":
            result.sort((a, b) => b.rating - a.rating);
            break;
        case "newest":
            result.sort((a, b) => b.id - a.id);
            break;
        case "popular":
            result.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
        default: // Recommended
            break;
    }

    state.filteredBooks = result;
    state.currentPage = 1;
    renderGrid();
}

// ==========================================================================
// DOM Rendering Functions
// ==========================================================================
function renderGrid() {
    const grid = $('#book-grid');
    grid.empty();

    $('#results-count-text').text(`${state.filteredBooks.length} Books Found`);

    if (state.filteredBooks.length === 0) {
        $('#empty-state').show();
        $('#pagination-container').hide();
        return;
    } else {
        $('#empty-state').hide();
        $('#pagination-container').show();
    }

    // Pagination Slice
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const paginatedBooks = state.filteredBooks.slice(startIndex, startIndex + state.pageSize);

    paginatedBooks.forEach(book => {
        const isWishlisted = state.wishlist.includes(book.id);
        const cardHTML = `
            <div class="book-card" data-id="${book.id}">
                <div class="card-image-container">
                    ${book.badge ? `<span class="card-badge ${book.badge.toLowerCase()}">${book.badge}</span>` : ''}
                    <button class="wishlist-card-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${book.id}, event)">
                        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                    <img src="${book.coverImage}" alt="${book.title}" loading="lazy">
                </div>
                <div class="card-body">
                    <span class="card-category">${book.category}</span>
                    <h3 class="card-title">${book.title}</h3>
                    <p class="card-author">by ${book.author}</p>
                    <div class="card-rating">
                        <span class="stars">${renderStars(book.rating)}</span>
                        <span class="review-count">(${book.reviewCount})</span>
                    </div>
                    <div class="card-price-row">
                        <span class="current-price">Rs. ${book.price.toLocaleString()}</span>
                        ${book.originalPrice > book.price ? `<span class="original-price">Rs. ${book.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="stock-status ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${book.stock > 0 ? `<i class="fa-solid fa-check"></i> In Stock (${book.stock})` : `<i class="fa-solid fa-xmark"></i> Out of Stock`}
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-outline btn-sm" onclick="fetchBookByIdAPI(${book.id})">Details</button>
                        <button class="btn btn-primary btn-sm" ${book.stock === 0 ? 'disabled' : ''} onclick="addToCart(${book.id})">
                            <i class="fa-solid fa-cart-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.append(cardHTML);
    });

    renderPagination();
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

function renderPagination() {
    const container = $('#pagination-container');
    container.empty();

    const totalPages = Math.ceil(state.filteredBooks.length / state.pageSize);
    if (totalPages <= 1) return;

    // Previous Button
    container.append(`
        <button class="page-btn" ${state.currentPage === 1 ? 'disabled' : ''} onclick="changePage(${state.currentPage - 1})">
            &larr; Prev
        </button>
    `);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        container.append(`
            <button class="page-btn ${i === state.currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `);
    }

    // Next Button
    container.append(`
        <button class="page-btn" ${state.currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${state.currentPage + 1})">
            Next &rarr;
        </button>
    `);
}

function changePage(newPage) {
    state.currentPage = newPage;
    renderGrid();
    $('html, body').animate({ scrollTop: $('#book-grid').offset().top - 100 }, 'fast');
}

function showLoading(isLoading) {
    if (isLoading) {
        $('#loading-state').show();
        $('#book-grid').empty();
        $('#pagination-container').hide();
    } else {
        $('#loading-state').hide();
    }
}

// ==========================================================================
// Interaction Event Handlers
// ==========================================================================
function setupEventListeners() {
    // Theme Toggle
    $('#theme-toggle').on('click', function () {
        const currentTheme = $('html').attr('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        $('html').attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Mobile Navigation & Search
    $('#mobile-menu-btn').on('click', function() {
        $('#mobile-nav').slideToggle();
    });

    // Search Operations
    $('#search-input').on('input', function () {
        const query = $(this).val().trim();
        $('#clear-search-btn').toggle(query.length > 0);
        state.searchQuery = query;
        applyFiltersAndSort();
    });

    $('#clear-search-btn').on('click', function () {
        $('#search-input').val('');
        $(this).hide();
        state.searchQuery = '';
        applyFiltersAndSort();
    });

    // Sidebar Mobile Toggles
    $('#toggle-mobile-filters').on('click', function () {
        $('#sidebar-filters').addClass('open');
    });

    $('#close-sidebar-btn').on('click', function () {
        $('#sidebar-filters').removeClass('open');
    });

    // Category Selector
    $('#category-list').on('click', 'a', function (e) {
        e.preventDefault();
        $('#category-list a').removeClass('active');
        $(this).addClass('active');
        state.selectedCategory = $(this).data('category');
        applyFiltersAndSort();
    });

    // Price Slider
    $('#price-range').on('input', function () {
        state.maxPrice = parseInt($(this).val());
        $('#price-max-display').text(`Rs. ${state.maxPrice.toLocaleString()}`);
    });

    // Apply & Clear Filter Actions
    $('#apply-filters-btn').on('click', function () {
        // Rating
        state.minRating = parseFloat($('input[name="rating"]:checked').val()) || 0;
        
        // Availability
        state.stockFilters.inStock = $('#stock-in').is(':checked');
        state.stockFilters.outOfStock = $('#stock-out').is(':checked');

        // Languages
        state.languages = $('.lang-filter:checked').map(function() { return $(this).val(); }).get();

        applyFiltersAndSort();
        $('#sidebar-filters').removeClass('open');
    });

    $('#clear-filters-btn, #reset-filters-btn').on('click', function () {
        resetFilters();
    });

    // Sorting Dropdown
    $('#sort-select').on('change', function () {
        state.sortBy = $(this).val();
        applyFiltersAndSort();
    });

    // AI Chat Bot Integration Points
    $('#ai-trigger-btn').on('click', function () {
        $('#ai-chat-popup').toggle();
    });

    $('#ai-close-btn').on('click', function () {
        $('#ai-chat-popup').hide();
    });

    $('.ai-suggestion-chip').on('click', function() {
        const query = $(this).text();
        handleAISend(query);
    });

    $('#ai-send-btn').on('click', function() {
        const query = $('#ai-input').val();
        if(query) handleAISend(query);
    });
}

function resetFilters() {
    $('#search-input').val('');
    $('#clear-search-btn').hide();
    $('#price-range').val(10000);
    $('#price-max-display').text('Rs. 10,000');
    $('input[name="rating"]').prop('checked', false);
    $('#stock-in, #stock-out, .lang-filter').prop('checked', true);
    $('#category-list a').removeClass('active').first().addClass('active');

    state.searchQuery = "";
    state.selectedCategory = "All";
    state.maxPrice = 10000;
    state.minRating = 0;
    state.stockFilters = { inStock: true, outOfStock: true };
    state.languages = ["English", "Sinhala", "Tamil"];
    state.sortBy = "recommended";

    applyFiltersAndSort();
}

// ==========================================================================
// Cart & Wishlist Global Actions
// ==========================================================================
function addToCart(bookId) {
    const book = state.books.find(b => b.id === bookId);
    if (!book || book.stock === 0) return;

    state.cart.push(book);
    $('#cart-badge').text(state.cart.length);
    showToast(`Added "${book.title}" to cart!`, 'success');
}

function toggleWishlist(bookId, event) {
    event.stopPropagation();
    const index = state.wishlist.indexOf(bookId);
    const book = state.books.find(b => b.id === bookId);

    if (index === -1) {
        state.wishlist.push(bookId);
        showToast(`Added "${book.title}" to wishlist!`, 'success');
    } else {
        state.wishlist.splice(index, 1);
        showToast(`Removed "${book.title}" from wishlist.`, 'info');
    }

    $('#wishlist-badge').text(state.wishlist.length);
    renderGrid();
}

function showToast(message, type = 'info') {
    const toast = $(`<div class="toast ${type}"><i class="fa-solid fa-circle-check"></i> ${message}</div>`);
    $('#toast-container').append(toast);
    setTimeout(() => {
        toast.fadeOut(300, function() { $(this).remove(); });
    }, 3000);
}

// ==========================================================================
// AI Assistant Engine (Simulated Endpoint POST /api/v1/ai/chat)
// ==========================================================================
function handleAISend(text) {
    const body = $('#ai-chat-body');
    body.append(`<div class="ai-message user-message">${text}</div>`);
    $('#ai-input').val('');
    
    body.scrollTop(body[0].scrollHeight);

    // Mock response handler mapping
    setTimeout(() => {
        let botResponse = "I can help you browse our repository. Try searching for specific programming or fantasy titles!";
        const lower = text.toLowerCase();

        if (lower.includes('fantasy')) {
            botResponse = "I strongly recommend 'Harry Potter' or 'The Hobbit' for epic fantasy worlds!";
        } else if (lower.includes('3000') || lower.includes('under')) {
            botResponse = "Check out 'The Alchemist' or '1984'. Both are priced under Rs. 3000!";
        } else if (lower.includes('programming')) {
            botResponse = "'Clean Code' and 'The Pragmatic Programmer' are top choices for developers.";
        }

        body.append(`<div class="ai-message bot-message">${botResponse}</div>`);
        body.scrollTop(body[0].scrollHeight);
    }, 600);
}