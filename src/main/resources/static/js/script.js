// --- Sample Book Data ---
const sampleBooks = [
    {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        price: 4500,
        oldPrice: 5200,
        discount: "13% OFF",
        rating: 4.8,
        reviews: 240,
        cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        category: "Fantasy",
        price: 2800,
        oldPrice: null,
        discount: null,
        rating: 4.9,
        reviews: 1250,
        cover: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Business",
        price: 3200,
        oldPrice: 3800,
        discount: "15% OFF",
        rating: 4.9,
        reviews: 980,
        cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 4,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        category: "Fantasy",
        price: 3100,
        oldPrice: null,
        discount: null,
        rating: 4.7,
        reviews: 610,
        cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 5,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "Business",
        price: 2900,
        oldPrice: 3500,
        discount: "17% OFF",
        rating: 4.8,
        reviews: 430,
        cover: "https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 6,
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction",
        price: 2200,
        oldPrice: null,
        discount: null,
        rating: 4.6,
        reviews: 870,
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 7,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt & David Thomas",
        category: "Programming",
        price: 5100,
        oldPrice: 6000,
        discount: "15% OFF",
        rating: 4.9,
        reviews: 310,
        cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 8,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        category: "Business",
        price: 2600,
        oldPrice: null,
        discount: null,
        rating: 4.7,
        reviews: 1120,
        cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=400&q=80"
    }
];

// App State Management
let cartCount = 0;
let wishlistCount = 0;

$(document).ready(function() {



    function checkLoginStatus(){
        const token = localStorage.getItem("token");

        if(token){
            $('#register-btn').hide();
            $('#login-btn').hide();
            $('#logout-btn').show();
        }else {

            $('#login-btn').show()
            $('#register-btn').show();
            $('#logout-btn').hide();
        }
    }

    checkLoginStatus();

    
    // --- 1. Render Books ---
    function renderBooks(books) {
        const $grid = $('#book-grid');
        $grid.empty();
        
        if (books.length === 0) {
            $grid.append('<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No books match your criteria.</p>');
            return;
        }

        books.forEach(book => {
            const discountTag = book.discount ? `<span class="discount-badge">${book.discount}</span>` : '';
            const oldPriceTag = book.oldPrice ? `<span class="old-price">Rs. ${book.oldPrice.toLocaleString()}</span>` : '';
            
            const bookCard = `
                <article class="book-card" data-id="${book.id}">
                    <div class="book-cover-container">
                        <img src="${book.cover}" alt="${book.title}" class="book-cover" loading="lazy">
                        ${discountTag}
                        <button class="wishlist-btn" aria-label="Add to wishlist"><i class="fa-regular fa-heart"></i></button>
                    </div>
                    <div class="book-details">
                        <span class="book-category">${book.category}</span>
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-author">by ${book.author}</p>
                        <div class="book-rating">
                            <i class="fa-solid fa-star"></i>
                            <span>${book.rating} (${book.reviews})</span>
                        </div>
                        <div class="book-price">
                            <span class="current-price">Rs. ${book.price.toLocaleString()}</span>
                            ${oldPriceTag}
                        </div>
                        <div class="book-actions">
                            <button class="btn btn-primary btn-sm add-to-cart-btn"><i class="fa-solid fa-cart-plus"></i> Add</button>
                            <a href="books.html" class="btn btn-secondary btn-sm">Details</a>
                        </div>
                    </div>
                </article>
            `;
            $grid.append(bookCard);
        });
    }

    renderBooks(sampleBooks);

    // --- 2. Dark / Light Mode Toggle ---
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

    function updateThemeIcon(theme) {
        const $icon = $('#theme-toggle i');
        if (theme === 'dark') {
            $icon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            $icon.removeClass('fa-sun').addClass('fa-moon');
        }
    }

    // --- 3. Mobile Navigation & Search Overlay ---
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

    // Filtering books live on search
    $('#search-input').on('keyup', function() {
        const query = $(this).val().toLowerCase();
        const filtered = sampleBooks.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query)
        );
        renderBooks(filtered);
    });

    // --- 4. Wishlist & Cart Functionality ---
    $(document).on('click', '.wishlist-btn', function() {
        const $icon = $(this).find('i');
        $(this).toggleClass('active');

        if ($(this).hasClass('active')) {
            $icon.removeClass('fa-regular').addClass('fa-solid');
            wishlistCount++;
            showToast('Added to Wishlist!');
        } else {
            $icon.removeClass('fa-solid').addClass('fa-regular');
            wishlistCount = Math.max(0, wishlistCount - 1);
            showToast('Removed from Wishlist.');
        }
        $('#wishlist-badge').text(wishlistCount);
    });

    $(document).on('click', '.add-to-cart-btn', function() {
        cartCount++;
        $('#cart-badge').text(cartCount);
        showToast('Book added to cart!');
    });

    function showToast(message) {
        $('#toast-message').text(message);
        $('#toast').removeClass('hidden');
        setTimeout(() => {
            $('#toast').addClass('hidden');
        }, 2500);
    }

    // --- 5. Category Navigation ---
    $('.category-card').on('click', function() {
        const category = $(this).data('category');
        window.location.href = `books.html?category=${category}`;
    });

    // --- 6. Sale Countdown Timer ---
    function startCountdown() {
        let duration = (2 * 24 * 60 * 60) + (12 * 60 * 60) + (35 * 60) + 20; // seconds

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
    startCountdown();

    // --- 7. Newsletter Validation ---
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

    // --- 8. AI Chat Assistant Widget ---
    $('#ai-toggle-btn').on('click', function() {
        $('#ai-chat-popup').toggleClass('hidden');
    });

    $('#close-chat').on('click', function() {
        $('#ai-chat-popup').addClass('hidden');
    });

    // Quick Option Chips
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

    function handleAiChatSubmit(message) {
        appendChatMessage(message, 'user');

        // Simulate AI Response Processing
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
});

