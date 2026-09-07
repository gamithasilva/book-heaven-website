/**
 * BookHaven Bookstore - Manager Book Form Management System
 * Author: Development Team
 * Date: 2026
 */

// Global State
let editMode = false;
let bookId = null;
let isFormDirty = false;
let uploadedCoverData = null;

// Mock Dataset for Edit Mode Demo
const sampleBooks = [
    {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "9780132350884",
        category: "Programming",
        language: "English",
        publisher: "Prentice Hall",
        publicationDate: "2008-08-01",
        pages: 464,
        edition: "1st Edition",
        originalPrice: 5000,
        sellingPrice: 4500,
        stock: 15,
        description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way.",
        format: "Paperback",
        weight: "0.60 kg",
        dimensions: "23 × 18 × 3 cm",
        coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300"
    },
    {
        id: 15,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        isbn: "9780374533557",
        category: "Self Help",
        language: "English",
        publisher: "Farrar, Straus and Giroux",
        publicationDate: "2013-04-02",
        pages: 512,
        edition: "1st Edition",
        originalPrice: 4500,
        sellingPrice: 4100,
        stock: 2,
        description: "In the international bestseller, Thinking, Fast and Slow, Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.",
        format: "Paperback",
        weight: "0.50 kg",
        dimensions: "20 × 13 × 3 cm",
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300"
    }
];

// Service Layer API Wrapper
const API = {
    async fetchBookById(id) {
        // GET /api/v1/books/{id}
        const book = sampleBooks.find(b => b.id === Number(id));
        return Promise.resolve(book || null);
    },
    async createBook(bookData) {
        // POST /api/v1/books
        console.log("API POST /api/v1/books Payload:", bookData);
        return new Promise(resolve => setTimeout(() => resolve({ success: true, id: Date.now() }), 1000));
    },
    async updateBook(id, bookData) {
        // PUT /api/v1/books/{id}
        console.log(`API PUT /api/v1/books/${id} Payload:`, bookData);
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
    },
    async sendAiMessage(message) {
        // POST /api/v1/ai/chat
        let responseText = "I'm your assistant for adding and updating catalog books.";
        const msg = message.toLowerCase();

        if (msg.includes("category")) {
            responseText = "Common categories: Programming, Fiction, Business, Self Help, Science Fiction, and Fantasy.";
        } else if (msg.includes("description")) {
            responseText = "A great description includes a compelling hook, summary of key topics, target audience, and key benefits.";
        } else if (msg.includes("selling price") || msg.includes("price")) {
            responseText = "Recommended strategy: Set a competitive price 5-15% lower than retail for promotional interest.";
        } else if (msg.includes("keywords")) {
            responseText = "Suggested keywords: bestseller, original edition, software engineering, personal growth.";
        }

        return Promise.resolve(responseText);
    }
};

// Initialize Application
$(document).ready(function() {
    checkAuth();
    initTheme();
    detectUrlMode();
    bindEvents();
});

// Authentication Guard
function checkAuth() {
    const isManagerLoggedIn = localStorage.getItem("managerLoggedIn");
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

// Mode Detection (Add vs. Edit)
async function detectUrlMode() {
    const urlParams = new URLSearchParams(window.location.search);
    bookId = urlParams.get('id');

    if (bookId) {
        editMode = true;
        $("#pageTitle").text("Book Haven | Manager - Edit Book");
        $("#formHeading").text("Edit Book");
        $("#formSubheading").text("Update the information, price, and stock of this book.");
        $("#saveBtnText").text("Save Changes");

        // Load existing book
        const book = await API.fetchBookById(bookId);
        if (book) {
            populateForm(book);
        } else {
            showToast("Book not found. Redirecting...", "error");
            setTimeout(() => window.location.href = "books.html", 2000);
        }
    } else {
        editMode = false;
        $("#pageTitle").text("Book Haven | Manager - Add New Book");
        $("#formHeading").text("Add New Book");
        $("#formSubheading").text("Add a new book to the BookHaven store.");
        $("#saveBtnText").text("Add Book");
        updateStockStatus(0);
    }
}

// Populate Form Data for Edit Mode
function populateForm(book) {
    $("#bookTitle").val(book.title);
    $("#author").val(book.author);
    $("#isbn").val(book.isbn);
    $("#category").val(book.category);
    $("#language").val(book.language);
    $("#description").val(book.description || "");
    $("#publisher").val(book.publisher || "");
    $("#publicationDate").val(book.publicationDate || "");
    $("#pages").val(book.pages || "");
    $("#edition").val(book.edition || "");
    $("#originalPrice").val(book.originalPrice || "");
    $("#sellingPrice").val(book.sellingPrice || "");
    $("#stock").val(book.stock);
    $("#format").val(book.format || "Paperback");
    $("#weight").val(book.weight || "");
    $("#dimensions").val(book.dimensions || "");

    // Update dynamic fields
    updateCharCounter();
    calculateDiscount();
    updateStockStatus(book.stock);

    if (book.coverImage) {
        showCoverPreview(book.coverImage, "Existing Cover Image", "");
    }
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

    // Mobile Sidebar Toggle
    $("#sidebarToggle").on("click", function() {
        $("#sidebar").toggleClass("open");
    });

    // Track Form Modifications
    $("#bookForm input, #bookForm select, #bookForm textarea").on("change input", function() {
        isFormDirty = true;
    });

    // Unsaved Changes Warning
    window.addEventListener("beforeunload", function(e) {
        if (isFormDirty) {
            e.preventDefault();
            e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        }
    });

    // Character Counter
    $("#description").on("input", updateCharCounter);

    // Dynamic Discount Calculation
    $("#originalPrice, #sellingPrice").on("input", calculateDiscount);

    // Stock Status Calculation
    $("#stock").on("input", function() {
        const stockVal = parseInt($(this).val()) || 0;
        updateStockStatus(stockVal);
    });

    // Image Upload Events
    $("#chooseImgBtn").on("click", function() {
        $("#coverInput").click();
    });

    $("#coverInput").on("change", handleImageUpload);

    $("#removeImgBtn").on("click", function() {
        $("#coverInput").val("");
        uploadedCoverData = null;
        $("#coverImgPreview").attr("src", "").addClass("hidden");
        $("#uploadPlaceholder").removeClass("hidden");
        $("#removeImgBtn").addClass("hidden");
        $("#chooseImgBtn").removeClass("hidden");
        $("#fileInfoBox").addClass("hidden");
        $("#coverError").text("");
    });

    // Form Submission
    $("#bookForm").on("submit", handleFormSubmit);

    // Logout Modal Logic
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

    // AI Assistant Handlers
    $("#aiToggleBtn").on("click", function() {
        $("#aiChatCard").toggleClass("hidden");
    });

    $("#closeAiBtn").on("click", function() {
        $("#aiChatCard").addClass("hidden");
    });

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

// Character Counter Logic
function updateCharCounter() {
    const len = $("#description").val().length;
    $("#charCounter").text(`${len} / 2000`);
}

// Discount Logic Calculation
function calculateDiscount() {
    const orig = parseFloat($("#originalPrice").val());
    const sell = parseFloat($("#sellingPrice").val());

    if (orig && sell && orig > sell && orig > 0) {
        const discount = Math.round(((orig - sell) / orig) * 100);
        $("#discountBadge").text(`${discount}% OFF`);
        $("#discountBadgeContainer").removeClass("hidden");
    } else {
        $("#discountBadgeContainer").addClass("hidden");
    }
}

// Stock Badge Status Indicator
function updateStockStatus(stock) {
    const container = $("#stockStatusBadge");
    if (stock === 0) {
        container.html(`<span class="status-badge badge-out-of-stock"><i class="fa-solid fa-circle-xmark"></i> OUT OF STOCK</span>`);
    } else if (stock >= 1 && stock <= 5) {
        container.html(`<span class="status-badge badge-low-stock"><i class="fa-solid fa-triangle-exclamation"></i> LOW STOCK</span>`);
    } else {
        container.html(`<span class="status-badge badge-in-stock"><i class="fa-solid fa-circle-check"></i> IN STOCK</span>`);
    }
}

// Image File Selection Handler
function handleImageUpload(e) {
    const file = e.target.files[0];
    $("#coverError").text("");

    if (!file) return;

    // Allowed Extensions
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        $("#coverError").text("Invalid image format. Only JPG, JPEG, PNG, WEBP are allowed.");
        return;
    }

    // Maximum 5 MB Size Limit
    if (file.size > 5 * 1024 * 1024) {
        $("#coverError").text("File size exceeds 5MB limit.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
        uploadedCoverData = evt.target.result;
        showCoverPreview(uploadedCoverData, file.name, (file.size / (1024 * 1024)).toFixed(2) + " MB");
    };
    reader.readAsDataURL(file);
}

function showCoverPreview(src, fileName, fileSize) {
    $("#coverImgPreview").attr("src", src).removeClass("hidden");
    $("#uploadPlaceholder").addClass("hidden");
    $("#chooseImgBtn").addClass("hidden");
    $("#removeImgBtn").removeClass("hidden");

    if (fileName) {
        $("#fileNameText").text(fileName);
        $("#fileSizeText").text(fileSize ? `Size: ${fileSize}` : "");
        $("#fileInfoBox").removeClass("hidden");
    }
}

// Form Validation and Submission Engine
async function handleFormSubmit(e) {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    const title = $("#bookTitle").val().trim();
    const author = $("#author").val().trim();
    const isbn = $("#isbn").val().trim();
    const category = $("#category").val();
    const language = $("#language").val();
    const origPrice = parseFloat($("#originalPrice").val());
    const sellPrice = parseFloat($("#sellingPrice").val());
    const stockVal = $("#stock").val().trim();
    const stock = parseInt(stockVal);
    const pagesVal = $("#pages").val().trim();
    const pages = parseInt(pagesVal);

    // Validation Rules Checks
    if (!title || title.length < 2) {
        showFieldError("#bookTitleError", "Title must be at least 2 characters.");
        isValid = false;
    }

    if (!author || author.length < 2) {
        showFieldError("#authorError", "Author name must be at least 2 characters.");
        isValid = false;
    }

    if (!isbn) {
        showFieldError("#isbnError", "ISBN number is required.");
        isValid = false;
    }

    if (!category) {
        showFieldError("#categoryError", "Please select a category.");
        isValid = false;
    }

    if (!language) {
        showFieldError("#languageError", "Please select a language.");
        isValid = false;
    }

    if (isNaN(sellPrice) || sellPrice <= 0) {
        showFieldError("#sellingPriceError", "Selling price must be greater than 0.");
        isValid = false;
    }

    if (origPrice && origPrice < 0) {
        showFieldError("#originalPriceError", "Original price cannot be negative.");
        isValid = false;
    }

    if (origPrice && sellPrice && sellPrice > origPrice) {
        showFieldError("#sellingPriceError", "Selling price cannot exceed original price.");
        isValid = false;
    }

    if (stockVal === "" || isNaN(stock) || stock < 0) {
        showFieldError("#stockError", "Stock must be a whole number 0 or greater.");
        isValid = false;
    }

    if (pagesVal !== "" && (isNaN(pages) || pages <= 0)) {
        showFieldError("#pagesError", "Pages must be greater than 0.");
        isValid = false;
    }

    if (!isValid) return;

    // Build Request Payload
    const payload = {
        title: title,
        author: author,
        isbn: isbn,
        category: category,
        language: language,
        publisher: $("#publisher").val().trim(),
        publicationDate: $("#publicationDate").val(),
        pages: pages || null,
        edition: $("#edition").val().trim(),
        originalPrice: origPrice || null,
        sellingPrice: sellPrice,
        stock: stock,
        description: $("#description").val().trim(),
        format: $("#format").val(),
        weight: $("#weight").val().trim(),
        dimensions: $("#dimensions").val().trim(),
        coverImage: uploadedCoverData
    };

    // UI Loading State
    const submitBtn = $("#saveBookBtn");
    submitBtn.prop("disabled", true);
    $("#saveBtnText").text("Saving...");

    try {
        if (editMode) {
            await API.updateBook(bookId, payload);
            showToast("Book updated successfully.", "success");
        } else {
            await API.createBook(payload);
            showToast("Book added successfully.", "success");
        }

        isFormDirty = false; // Disable warning on navigate
        setTimeout(() => {
            window.location.href = "books.html";
        }, 1200);

    } catch (err) {
        showToast("An error occurred while saving the book.", "error");
        submitBtn.prop("disabled", false);
        $("#saveBtnText").text(editMode ? "Save Changes" : "Add Book");
    }
}

function showFieldError(selector, msg) {
    $(selector).text(msg);
}

function clearErrors() {
    $(".error-msg").text("");
}

// AI Chat Interaction Logic
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

// Toast Helper
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