/**
 * BookHaven Bookstore - Manager Book Management System
 * Author: Development Team
 * Date: 2026
 */

// Global State
let sampleBooks = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Programming", isbn: "9780132350884", language: "English", price: 4500, originalPrice: 5000, stock: 15, sales: 124, rating: 4.8, publisher: "Prentice Hall", publicationDate: "2008-08-01", pages: 464, coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200" },
    { id: 2, title: "Atomic Habits", author: "James Clear", category: "Self Help", isbn: "9780735211292", language: "English", price: 3000, originalPrice: 3500, stock: 4, sales: 98, rating: 4.9, publisher: "Avery", publicationDate: "2018-10-16", pages: 320, coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200" },
    { id: 3, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fantasy", isbn: "9780547928227", language: "English", price: 3500, originalPrice: 4000, stock: 0, sales: 76, rating: 4.7, publisher: "Mariner Books", publicationDate: "2012-09-18", pages: 320, coverImage: "https://images.unsplash.com/photo-1629992101753-56d196c8a0be?auto=format&fit=crop&q=80&w=200" },
    { id: 4, title: "Design Patterns", author: "Erich Gamma et al.", category: "Programming", isbn: "9780201633610", language: "English", price: 5500, originalPrice: 6000, stock: 0, sales: 64, rating: 4.6, publisher: "Addison-Wesley", publicationDate: "1994-11-10", pages: 395, coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200" },
    { id: 5, title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Programming", isbn: "9780135957059", language: "English", price: 5000, originalPrice: 5500, stock: 1, sales: 110, rating: 4.8, publisher: "Addison-Wesley", publicationDate: "2019-09-13", pages: 352, coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200" },
    { id: 6, title: "Dune", author: "Frank Herbert", category: "Science Fiction", isbn: "9780441172719", language: "English", price: 3200, originalPrice: 3800, stock: 22, sales: 145, rating: 4.7, publisher: "Ace", publicationDate: "1990-09-01", pages: 688, coverImage: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=200" },
    { id: 7, title: "Steve Jobs", author: "Walter Isaacson", category: "Biography", isbn: "9781451648539", language: "English", price: 4200, originalPrice: 4800, stock: 3, sales: 88, rating: 4.6, publisher: "Simon & Schuster", publicationDate: "2011-10-24", pages: 656, coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=200" },
    { id: 8, title: "The Lean Startup", author: "Eric Ries", category: "Business", isbn: "9780307887894", language: "English", price: 3800, originalPrice: 4200, stock: 12, sales: 205, rating: 4.5, publisher: "Crown Business", publicationDate: "2011-09-13", pages: 336, coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=200" },
    { id: 9, title: "Sapiens", author: "Yuval Noah Harari", category: "History", isbn: "9780062316097", language: "English", price: 3900, originalPrice: 4500, stock: 2, sales: 310, rating: 4.8, publisher: "Harper", publicationDate: "2015-02-10", pages: 464, coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=200" },
    { id: 10, title: "Madol Doova", author: "Martin Wickramasinghe", category: "Fiction", isbn: "9789559098003", language: "Sinhala", price: 1200, originalPrice: 1500, stock: 45, sales: 420, rating: 4.9, publisher: "Tisara Prakashakayo", publicationDate: "1947-04-12", pages: 180, coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200" },
    { id: 11, title: "Ponniyin Selvan", author: "Kalki Krishnamurthy", category: "History", isbn: "9788170172116", language: "Tamil", price: 2800, originalPrice: 3200, stock: 5, sales: 180, rating: 4.9, publisher: "Vikatan", publicationDate: "1954-10-29", pages: 1200, coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200" },
    { id: 12, title: "Pride and Prejudice", author: "Jane Austen", category: "Romance", isbn: "9780141439518", language: "English", price: 2200, originalPrice: 2500, stock: 18, sales: 150, rating: 4.7, publisher: "Penguin Classics", publicationDate: "2002-12-30", pages: 480, coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200" },
    { id: 13, title: "Gamperaliya", author: "Martin Wickramasinghe", category: "Fiction", isbn: "9789559098010", language: "Sinhala", price: 1500, originalPrice: 1800, stock: 0, sales: 230, rating: 4.8, publisher: "Tisara Prakashakayo", publicationDate: "1944-01-01", pages: 240, coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200" },
    { id: 14, title: "Zero to One", author: "Peter Thiel", category: "Business", isbn: "9780804139298", language: "English", price: 3400, originalPrice: 4000, stock: 8, sales: 115, rating: 4.5, publisher: "Currency", publicationDate: "2014-09-16", pages: 224, coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=200" },
    { id: 15, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Self Help", isbn: "9780374533557", language: "English", price: 4100, originalPrice: 4500, stock: 2, sales: 95, rating: 4.6, publisher: "Farrar, Straus and Giroux", publicationDate: "2013-04-02", pages: 512, coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200" }
];

let filteredBooks = [...sampleBooks];
let currentPage = 1;
const itemsPerPage = 10;
let bookToDeleteId = null;

// API Service Wrapper (Preparation for Spring Boot integration)
const API = {
    async fetchBooks() {
        // GET /api/v1/books
        return Promise.resolve([...sampleBooks]);
    },
    async getBookById(id) {
        // GET /api/v1/books/{id}
        const book = sampleBooks.find(b => b.id === Number(id));
        return Promise.resolve(book);
    },
    async updateStock(id, stock) {
        // PATCH /api/v1/books/{id}/stock
        const book = sampleBooks.find(b => b.id === Number(id));
        if (book) book.stock = Number(stock);
        return Promise.resolve(book);
    },
    async updatePrice(id, price) {
        // PATCH /api/v1/books/{id}/price
        const book = sampleBooks.find(b => b.id === Number(id));
        if (book) book.price = Number(price);
        return Promise.resolve(book);
    },
    async deleteBook(id) {
        // DELETE /api/v1/books/{id}
        sampleBooks = sampleBooks.filter(b => b.id !== Number(id));
        return Promise.resolve(true);
    },
    async fetchLowStock() {
        // GET /api/v1/books/low-stock
        return Promise.resolve(sampleBooks.filter(b => b.stock >= 1 && b.stock <= 5));
    },
    async fetchOutOfStock() {
        // GET /api/v1/books/out-of-stock
        return Promise.resolve(sampleBooks.filter(b => b.stock === 0));
    },
    async sendAiMessage(message) {
        // POST /api/v1/ai/chat
        let responseText = "I'm here to assist with bookstore metrics, stock, and inventory inquiries.";
        const msg = message.toLowerCase();

        if (msg.includes("low in stock") || msg.includes("restock")) {
            const low = sampleBooks.filter(b => b.stock >= 1 && b.stock <= 5).map(b => b.title).join(", ");
            responseText = `Books currently low in stock (1-5 units): ${low || "None"}.`;
        } else if (msg.includes("out of stock")) {
            const out = sampleBooks.filter(b => b.stock === 0).map(b => b.title).join(", ");
            responseText = `Out of stock items: ${out || "None"}.`;
        } else if (msg.includes("best-selling") || msg.includes("highest sales")) {
            const top = [...sampleBooks].sort((a,b) => b.sales - a.sales).slice(0, 3).map(b => `${b.title} (${b.sales} sold)`).join(", ");
            responseText = `Top 3 best-selling books: ${top}.`;
        } else if (msg.includes("programming")) {
            const prog = sampleBooks.filter(b => b.category === "Programming").map(b => b.title).join(", ");
            responseText = `Programming titles available: ${prog}.`;
        }

        return Promise.resolve(responseText);
    }
};

// Initialize Application
$(document.body).ready(function() {
    checkAuth();
    initTheme();
    loadDashboardData();
    bindEvents();
});

// Authentication Check
function checkAuth() {
    const isManagerLoggedIn = localStorage.getItem("managerLoggedIn");
    // Defaulting logged in status for demo preview purposes if null
    if (isManagerLoggedIn === "false") {
        window.location.href = "manager-login.html";
    }
}

// Theme Handling
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light-mode";
    $("body").removeClass("light-mode dark-mode").addClass(savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const icon = $("#themeToggle i");
    if (theme === "dark-mode") {
        icon.removeClass("fa-moon").addClass("fa-sun");
    } else {
        icon.removeClass("fa-sun").addClass("fa-moon");
    }
}

// Core Data Rendering & Stat Updates
async function loadDashboardData() {
    $("#loadingSpinner").removeClass("hidden");
    $("#emptyState").addClass("hidden");
    
    const books = await API.fetchBooks();
    calculateStatistics(books);
    applyFiltersAndSort();
    renderStockWidgets();
    
    $("#loadingSpinner").addClass("hidden");
}

function calculateStatistics(books) {
    let total = books.length;
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    books.forEach(book => {
        if (book.stock === 0) {
            outOfStock++;
        } else if (book.stock >= 1 && book.stock <= 5) {
            lowStock++;
        } else {
            inStock++;
        }
    });

    $("#statTotalBooks").text(total.toLocaleString());
    $("#statInStock").text(inStock.toLocaleString());
    $("#statLowStock").text(lowStock.toLocaleString());
    $("#statOutOfStock").text(outOfStock.toLocaleString());
}

function renderTable(books) {
    const tbody = $("#booksTableBody");
    tbody.empty();

    if (books.length === 0) {
        $("#emptyState").removeClass("hidden");
        $("#booksTable").addClass("hidden");
        renderPagination(0);
        return;
    }

    $("#emptyState").addClass("hidden");
    $("#booksTable").removeClass("hidden");

    // Pagination Calculation
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, books.length);
    const paginatedBooks = books.slice(startIndex, endIndex);

    paginatedBooks.forEach(book => {
        const badge = getStatusBadge(book.stock);
        const row = `
            <tr data-id="${book.id}">
                <td>
                    <div class="book-cell">
                        <img src="${book.coverImage}" alt="${book.title}" class="book-cover-thumb">
                        <div>
                            <a href="../book-details.html?id=${book.id}" class="book-title-link">${escapeHtml(book.title)}</a>
                            <div class="book-author-sub">${escapeHtml(book.author)}</div>
                        </div>
                    </div>
                </td>
                <td>${escapeHtml(book.category)}</td>
                <td>${escapeHtml(book.isbn)}</td>
                <td class="price-cell">
                    <span>Rs. ${book.price.toLocaleString()}</span>
                    <button class="inline-edit-btn edit-price-btn" title="Quick edit price"><i class="fa-solid fa-pen"></i></button>
                </td>
                <td class="stock-cell">
                    <span>${book.stock}</span>
                    <button class="inline-edit-btn edit-stock-btn" title="Quick edit stock"><i class="fa-solid fa-pen"></i></button>
                </td>
                <td>${badge}</td>
                <td>${book.sales}</td>
                <td class="text-right">
                    <div class="action-buttons">
                        <button class="action-btn view-btn" title="Quick View"><i class="fa-solid fa-eye"></i></button>
                        <a href="book-form.html?id=${book.id}" class="action-btn" title="Edit Book"><i class="fa-solid fa-pen-to-square"></i></a>
                        <button class="action-btn delete-btn" title="Delete Book"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `;
        tbody.append(row);
    });

    renderPagination(books.length);
}

function getStatusBadge(stock) {
    if (stock === 0) {
        return `<span class="status-badge badge-out-of-stock"><i class="fa-solid fa-circle-xmark"></i> OUT OF STOCK</span>`;
    } else if (stock >= 1 && stock <= 5) {
        return `<span class="status-badge badge-low-stock"><i class="fa-solid fa-triangle-exclamation"></i> LOW STOCK</span>`;
    } else {
        return `<span class="status-badge badge-in-stock"><i class="fa-solid fa-circle-check"></i> IN STOCK</span>`;
    }
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const container = $("#paginationControls");
    container.empty();

    if (totalItems === 0) {
        $("#paginationInfo").text("Showing 0-0 of 0 books");
        return;
    }

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    $("#paginationInfo").text(`Showing ${start}–${end} of ${totalItems} books`);

    // Prev Button
    container.append(`<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} id="prevPageBtn"><i class="fa-solid fa-chevron-left"></i></button>`);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        container.append(`<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`);
    }

    // Next Button
    container.append(`<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} id="nextPageBtn"><i class="fa-solid fa-chevron-right"></i></button>`);
}

// Widget List Section Handling
async function renderStockWidgets() {
    const lowStock = await API.fetchLowStock();
    const outOfStock = await API.fetchOutOfStock();

    const lowList = $("#lowStockList").empty();
    if (lowStock.length === 0) {
        lowList.append('<li><span class="text-muted">No low stock warnings.</span></li>');
    } else {
        lowStock.forEach(b => {
            lowList.append(`<li><span>${escapeHtml(b.title)}</span> <strong class="color-amber">${b.stock} left</strong></li>`);
        });
    }

    const outList = $("#outOfStockList").empty();
    if (outOfStock.length === 0) {
        outList.append('<li><span class="text-muted">No out of stock books.</span></li>');
    } else {
        outOfStock.forEach(b => {
            outList.append(`<li><span>${escapeHtml(b.title)}</span> <strong class="color-red">Stock: 0</strong></li>`);
        });
    }
}

// Search, Filtering, and Sorting Pipeline
function applyFiltersAndSort() {
    const searchVal = $("#searchInput").val().toLowerCase().trim();
    const category = $("#categoryFilter").val();
    const stockStatus = $("#stockStatusFilter").val();
    const language = $("#languageFilter").val();
    const minPrice = parseFloat($("#minPriceInput").val()) || 0;
    const maxPrice = parseFloat($("#maxPriceInput").val()) || Infinity;
    const sortBy = $("#sortBySelect").val();

    filteredBooks = sampleBooks.filter(book => {
        // Search Criteria
        const matchesSearch = book.title.toLowerCase().includes(searchVal) ||
                              book.author.toLowerCase().includes(searchVal) ||
                              book.isbn.toLowerCase().includes(searchVal) ||
                              book.category.toLowerCase().includes(searchVal);

        // Filter Criteria
        const matchesCategory = category === "All" || book.category === category;
        const matchesLanguage = language === "All" || book.language === language;
        const matchesPrice = book.price >= minPrice && book.price <= maxPrice;

        let matchesStock = true;
        if (stockStatus === "In Stock") matchesStock = book.stock > 5;
        if (stockStatus === "Low Stock") matchesStock = book.stock >= 1 && book.stock <= 5;
        if (stockStatus === "Out of Stock") matchesStock = book.stock === 0;

        return matchesSearch && matchesCategory && matchesLanguage && matchesPrice && matchesStock;
    });

    // Sorting Engine
    filteredBooks.sort((a, b) => {
        switch (sortBy) {
            case "newest": return b.id - a.id;
            case "oldest": return a.id - b.id;
            case "title-az": return a.title.localeCompare(b.title);
            case "title-za": return b.title.localeCompare(a.title);
            case "price-low": return a.price - b.price;
            case "price-high": return b.price - a.price;
            case "stock-high": return b.stock - a.stock;
            case "stock-low": return a.stock - b.stock;
            case "best-selling": return b.sales - a.sales;
            default: return 0;
        }
    });

    currentPage = 1;
    renderTable(filteredBooks);
}

// Event Bindings
function bindEvents() {
    // Theme toggle
    $("#themeToggle").on("click", function() {
        const currentTheme = $("body").hasClass("dark-mode") ? "light-mode" : "dark-mode";
        $("body").removeClass("light-mode dark-mode").addClass(currentTheme);
        localStorage.setItem("theme", currentTheme);
        updateThemeIcon(currentTheme);
    });

    // Sidebar Mobile Toggle
    $("#sidebarToggle").on("click", function() {
        $("#sidebar").toggleClass("open");
    });

    // Collapsible Filters
    $("#toggleFilterBtn").on("click", function() {
        const grid = $("#filterGrid");
        grid.toggleClass("hidden");
        const isHidden = grid.hasClass("hidden");
        $(this).find(".text").text(isHidden ? "Expand" : "Collapse");
        $(this).find("i").toggleClass("fa-chevron-down fa-chevron-up");
    });

    // Search Input Realtime Listener
    $("#searchInput").on("input", function() {
        const val = $(this).val();
        $("#clearSearchBtn").toggleClass("hidden", val === "");
        applyFiltersAndSort();
    });

    $("#clearSearchBtn").on("click", function() {
        $("#searchInput").val("");
        $(this).addClass("hidden");
        applyFiltersAndSort();
    });

    // Filter Buttons
    $("#applyFiltersBtn").on("click", applyFiltersAndSort);
    $("#clearFiltersBtn, #emptyStateClearBtn").on("click", function() {
        $("#categoryFilter").val("All");
        $("#stockStatusFilter").val("All");
        $("#languageFilter").val("All");
        $("#minPriceInput").val("");
        $("#maxPriceInput").val("");
        $("#sortBySelect").val("newest");
        $("#searchInput").val("");
        $("#clearSearchBtn").addClass("hidden");
        applyFiltersAndSort();
    });

    $("#sortBySelect").on("change", applyFiltersAndSort);

    // Widget Action Redirections
    $("#manageLowStockBtn").on("click", function() {
        $("#stockStatusFilter").val("Low Stock");
        applyFiltersAndSort();
        $('html, body').animate({ scrollTop: $(".controls-card").offset().top - 80 }, 300);
    });

    $("#viewOutOfStockBtn").on("click", function() {
        $("#stockStatusFilter").val("Out of Stock");
        applyFiltersAndSort();
        $('html, body').animate({ scrollTop: $(".controls-card").offset().top - 80 }, 300);
    });

    // Pagination Event Delegation
    $("#paginationControls").on("click", ".page-btn", function() {
        if ($(this).attr("id") === "prevPageBtn") {
            if (currentPage > 1) currentPage--;
        } else if ($(this).attr("id") === "nextPageBtn") {
            const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
            if (currentPage < totalPages) currentPage++;
        } else {
            currentPage = Number($(this).data("page"));
        }
        renderTable(filteredBooks);
    });

    // Table Inline Quick Stock Edit
    $("#booksTableBody").on("click", ".edit-stock-btn", function() {
        const cell = $(this).closest(".stock-cell");
        const currentVal = parseInt(cell.find("span").text());
        const rowId = $(this).closest("tr").data("id");

        const editContainer = $(`
            <div class="editable-container">
                <input type="number" min="0" step="1" class="inline-input" value="${currentVal}">
                <button class="btn btn-sm btn-primary save-stock-btn"><i class="fa-solid fa-check"></i></button>
                <button class="btn btn-sm btn-secondary cancel-stock-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `);

        cell.data("old-content", cell.html());
        cell.html(editContainer);
    });

    $("#booksTableBody").on("click", ".save-stock-btn", async function() {
        const cell = $(this).closest(".stock-cell");
        const rowId = $(this).closest("tr").data("id");
        const newVal = parseInt(cell.find("input").val());

        if (isNaN(newVal) || newVal < 0) {
            showToast("Stock must be a valid non-negative whole number.", "error");
            return;
        }

        await API.updateStock(rowId, newVal);
        showToast("Stock updated successfully!", "success");
        loadDashboardData();
    });

    $("#booksTableBody").on("click", ".cancel-stock-btn", function() {
        const cell = $(this).closest(".stock-cell");
        cell.html(cell.data("old-content"));
    });

    // Table Inline Quick Price Edit
    $("#booksTableBody").on("click", ".edit-price-btn", function() {
        const cell = $(this).closest(".price-cell");
        const rowId = $(this).closest("tr").data("id");
        const book = sampleBooks.find(b => b.id === Number(rowId));

        const editContainer = $(`
            <div class="editable-container">
                <input type="number" min="0" class="inline-input" value="${book.price}">
                <button class="btn btn-sm btn-primary save-price-btn"><i class="fa-solid fa-check"></i></button>
                <button class="btn btn-sm btn-secondary cancel-price-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `);

        cell.data("old-content", cell.html());
        cell.html(editContainer);
    });

    $("#booksTableBody").on("click", ".save-price-btn", async function() {
        const cell = $(this).closest(".price-cell");
        const rowId = $(this).closest("tr").data("id");
        const newVal = parseFloat(cell.find("input").val());

        if (isNaN(newVal) || newVal < 0) {
            showToast("Price must be a valid non-negative number.", "error");
            return;
        }

        await API.updatePrice(rowId, newVal);
        showToast("Price updated successfully!", "success");
        loadDashboardData();
    });

    $("#booksTableBody").on("click", ".cancel-price-btn", function() {
        const cell = $(this).closest(".price-cell");
        cell.html(cell.data("old-content"));
    });

    // Quick View Modal Display
    $("#booksTableBody").on("click", ".view-btn", async function() {
        const rowId = $(this).closest("tr").data("id");
        const book = await API.getBookById(rowId);

        if (!book) return;

        const content = `
            <div class="modal-detail-grid">
                <img src="${book.coverImage}" alt="${book.title}" class="modal-detail-cover">
                <div>
                    <h2>${escapeHtml(book.title)}</h2>
                    <p class="subtitle">By ${escapeHtml(book.author)}</p>
                    <hr style="margin: 12px 0; border: none; border-top: 1px solid var(--border-color);">
                    <p><strong>Category:</strong> ${escapeHtml(book.category)}</p>
                    <p><strong>ISBN:</strong> ${escapeHtml(book.isbn)}</p>
                    <p><strong>Language:</strong> ${escapeHtml(book.language)}</p>
                    <p><strong>Publisher:</strong> ${escapeHtml(book.publisher)}</p>
                    <p><strong>Published Date:</strong> ${book.publicationDate}</p>
                    <p><strong>Pages:</strong> ${book.pages}</p>
                    <p><strong>Price:</strong> Rs. ${book.price.toLocaleString()}</p>
                    <p><strong>Stock Status:</strong> ${book.stock} units remaining</p>
                    <p><strong>Rating:</strong> ⭐ ${book.rating} / 5</p>
                    <p><strong>Total Sales:</strong> ${book.sales} units sold</p>
                </div>
            </div>
        `;

        $("#detailsModalBody").html(content);
        $("#modalEditBtn").attr("href", `book-form.html?id=${book.id}`);
        $("#detailsModal").removeClass("hidden");
    });

    $("#closeDetailsModalBtn, #closeDetailsModalFooterBtn").on("click", function() {
        $("#detailsModal").addClass("hidden");
    });

    // Delete Operations Modal setup
    $("#booksTableBody").on("click", ".delete-btn", function() {
        const rowId = $(this).closest("tr").data("id");
        const book = sampleBooks.find(b => b.id === Number(rowId));
        
        if (book) {
            bookToDeleteId = book.id;
            $("#deleteBookTitle").text(book.title);
            $("#deleteModal").removeClass("hidden");
        }
    });

    $("#cancelDeleteBtn").on("click", function() {
        bookToDeleteId = null;
        $("#deleteModal").addClass("hidden");
    });

    $("#confirmDeleteBtn").on("click", async function() {
        if (bookToDeleteId) {
            await API.deleteBook(bookToDeleteId);
            showToast("Book deleted successfully", "success");
            bookToDeleteId = null;
            $("#deleteModal").addClass("hidden");
            loadDashboardData();
        }
    });

    // Logout Confirmation Modal Setup
    $("#logoutBtn").on("click", function() {
        $("#logoutModal").removeClass("hidden");
    });

    $("#cancelLogoutBtn").on("click", function() {
        $("#logoutModal").addClass("hidden");
    });

    $("#confirmLogoutBtn").on("click", function() {
        localStorage.setItem("managerLoggedIn", "false");
        window.location.href = "manager-login.html";
    });

    // Floating AI Assistant Widget Interactions
    $("#aiToggleBtn").on("click", function() {
        $("#aiChatCard").toggleClass("hidden");
    });

    $("#closeAiBtn").on("click", function() {
        $("#aiChatCard").addClass("hidden");
    });

    async function handleAiSubmit(text) {
        if (!text) return;

        const body = $("#aiChatBody");
        body.append(`<div class="ai-message user">${escapeHtml(text)}</div>`);
        $("#aiInput").val("");
        body.scrollTop(body[0].scrollHeight);

        const response = await API.sendAiMessage(text);
        body.append(`<div class="ai-message bot">${escapeHtml(response)}</div>`);
        body.scrollTop(body[0].scrollHeight);
    }

    $("#sendAiBtn").on("click", function() {
        handleAiSubmit($("#aiInput").val().trim());
    });

    $("#aiInput").on("keypress", function(e) {
        if (e.which === 13) handleAiSubmit($(this).val().trim());
    });

    $(".ai-suggestions").on("click", ".ai-chip", function() {
        handleAiSubmit($(this).text());
    });
}

// Toast Helper Function
function showToast(message, type = "success") {
    const toast = $(`
        <div class="toast ${type}">
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
            <span>${escapeHtml(message)}</span>
        </div>
    `);
    
    $("#toastContainer").append(toast);
    
    setTimeout(() => {
        toast.fadeOut(300, function() { $(this).remove(); });
    }, 3000);
}

// Helper to escape HTML characters
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}