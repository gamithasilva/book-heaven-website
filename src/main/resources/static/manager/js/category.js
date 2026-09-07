/**
 * BookHaven - Category Management JS
 * Handles UI logic, Filtering, Pagination, Modals, LocalStorage Theme, and Spring Boot API Hooks
 */

// Global State
let categoriesData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;
let categoryToDeleteId = null;

// Initial Mock Categories
const initialMockCategories = [
    {
        id: 1,
        name: "Fiction",
        description: "Fictional stories and novels.",
        status: "ACTIVE",
        createdAt: "2026-08-20T10:30:00",
        bookCount: 24
    },
    {
        id: 2,
        name: "Fantasy",
        description: "Fantasy novels and magical adventures.",
        status: "ACTIVE",
        createdAt: "2026-08-21T11:15:00",
        bookCount: 18
    },
    {
        id: 3,
        name: "Programming",
        description: "Programming and software development books.",
        status: "ACTIVE",
        createdAt: "2026-08-22T09:45:00",
        bookCount: 15
    },
    {
        id: 4,
        name: "History",
        description: "Historical books and biographies.",
        status: "INACTIVE",
        createdAt: "2026-08-23T14:20:00",
        bookCount: 0
    },
    {
        id: 5,
        name: "Science Fiction",
        description: "Futuristic technology, space exploration, and time travel.",
        status: "ACTIVE",
        createdAt: "2026-08-24T16:00:00",
        bookCount: 12
    },
    {
        id: 6,
        name: "Self-Help",
        description: "Personal development, productivity, and mindfulness.",
        status: "ACTIVE",
        createdAt: "2026-08-25T08:30:00",
        bookCount: 9
    },
    {
        id: 7,
        name: "Mystery & Thriller",
        description: "Suspenseful, crime solving, and mystery novels.",
        status: "ACTIVE",
        createdAt: "2026-08-26T12:10:00",
        bookCount: 21
    },
    {
        id: 8,
        name: "Business & Economics",
        description: "Finance, startup strategies, leadership, and markets.",
        status: "INACTIVE",
        createdAt: "2026-08-27T17:45:00",
        bookCount: 0
    },
    {
        id: 9,
        name: "Comics & Graphic Novels",
        description: "Visual stories, manga, and superhero comics.",
        status: "ACTIVE",
        createdAt: "2026-08-28T10:00:00",
        bookCount: 7
    },
    {
        id: 10,
        name: "Biography & Memoir",
        description: "True life stories written by or about real people.",
        status: "ACTIVE",
        createdAt: "2026-08-29T11:20:00",
        bookCount: 5
    }
];

$(document.documentElement || document).ready(function () {
    initTheme();
    loadCategories();
    setupEventListeners();
});

/* ==========================================================================
   Theme Management
   ========================================================================== */
function initTheme() {
    const savedTheme = localStorage.getItem('bookhaven_theme') || 'light-mode';
    $('body').removeClass('light-mode dark-mode').addClass(savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const icon = $('#themeToggle i');
    if (theme === 'dark-mode') {
        icon.removeClass('fa-moon').addClass('fa-sun');
    } else {
        icon.removeClass('fa-sun').addClass('fa-moon');
    }
}

/* ==========================================================================
   Data Fetching & Preparation (API Ready)
   ========================================================================== */
function loadCategories() {
    $('#loadingSpinner').removeClass('hidden');
    $('#tableContainer, #emptyState').addClass('hidden');

    // Simulating AJAX Call GET /api/v1/categories
    setTimeout(function () {
        categoriesData = [...initialMockCategories];
        filteredData = [...categoriesData];

        $('#loadingSpinner').addClass('hidden');
        updateStatistics();
        applyFilterAndSort();
    }, 400);
}

/* ==========================================================================
   Render & UI Updates
   ========================================================================== */
function updateStatistics() {
    const total = categoriesData.length;
    const active = categoriesData.filter(c => c.status === 'ACTIVE').length;
    const inactive = categoriesData.filter(c => c.status === 'INACTIVE').length;
    const totalBooks = categoriesData.reduce((acc, curr) => acc + curr.bookCount, 0);

    $('#statTotalCategories').text(total);
    $('#statActiveCategories').text(active);
    $('#statInactiveCategories').text(inactive);
    $('#statCategorizedBooks').text(totalBooks);
}

function renderCategories() {
    const $tbody = $('#categoryTableBody');
    $tbody.empty();

    if (filteredData.length === 0) {
        $('#tableContainer').addClass('hidden');
        $('#emptyState').removeClass('hidden');
        return;
    }

    $('#emptyState').addClass('hidden');
    $('#tableContainer').removeClass('hidden');

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    const paginatedItems = filteredData.slice(startIndex, endIndex);

    paginatedItems.forEach(cat => {
        const dateFormatted = formatDate(cat.createdAt);
        const statusBadge = cat.status === 'ACTIVE'
            ? `<span class="badge-status active"><i class="fa-solid fa-circle"></i> Active</span>`
            : `<span class="badge-status inactive"><i class="fa-solid fa-circle"></i> Inactive</span>`;

        const row = `
            <tr>
                <td>#${cat.id}</td>
                <td>
                    <div class="category-cell">
                        <i class="fa-solid fa-layer-group"></i>
                        <span>${escapeHtml(cat.name)}</span>
                    </div>
                </td>
                <td><div class="description-cell" title="${escapeHtml(cat.description || '')}">${escapeHtml(cat.description || 'No description')}</div></td>
                <td><span class="book-badge">${cat.bookCount} books</span></td>
                <td>${statusBadge}</td>
                <td>${dateFormatted}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn" title="View Details" onclick="openViewCategoryModal(${cat.id})">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="action-btn" title="Edit Category" onclick="openEditCategoryModal(${cat.id})">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="action-btn delete" title="Delete Category" onclick="openDeleteModal(${cat.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        $tbody.append(row);
    });

    renderPagination(filteredData.length, startIndex, endIndex);
}

function renderPagination(totalItems, startIndex, endIndex) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    $('#paginationInfo').text(`Showing ${totalItems > 0 ? startIndex + 1 : 0}-${endIndex} of ${totalItems} categories`);

    const $controls = $('#paginationControls');
    $controls.empty();

    if (totalPages <= 1) return;

    $controls.append(`
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            Previous
        </button>
    `);

    for (let i = 1; i <= totalPages; i++) {
        $controls.append(`
            <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `);
    }

    $controls.append(`
        <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            Next
        </button>
    `);
}

function changePage(page) {
    currentPage = page;
    renderCategories();
}

/* ==========================================================================
   Filter, Search, Sort Logic
   ========================================================================== */
function applyFilterAndSort() {
    const searchTerm = $('#searchInput').val().toLowerCase().trim();
    const statusVal = $('#statusFilter').val();
    const sortVal = $('#sortBySelect').val();

    filteredData = categoriesData.filter(cat => {
        const matchesSearch = cat.name.toLowerCase().includes(searchTerm) ||
            (cat.description && cat.description.toLowerCase().includes(searchTerm));
        const matchesStatus = statusVal === 'ALL' || cat.status === statusVal;
        return matchesSearch && matchesStatus;
    });

    // Sorting
    filteredData.sort((a, b) => {
        if (sortVal === 'NEWEST') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortVal === 'OLDEST') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortVal === 'NAME_ASC') return a.name.localeCompare(b.name);
        if (sortVal === 'NAME_DESC') return b.name.localeCompare(a.name);
        if (sortVal === 'BOOKS_DESC') return b.bookCount - a.bookCount;
        if (sortVal === 'BOOKS_ASC') return a.bookCount - b.bookCount;
        return 0;
    });

    currentPage = 1;
    renderCategories();
}

function clearFilters() {
    $('#searchInput').val('');
    $('#statusFilter').val('ALL');
    $('#sortBySelect').val('NEWEST');
    applyFilterAndSort();
}

/* ==========================================================================
   Modal Operations & Forms
   ========================================================================== */
function openAddCategoryModal() {
    resetFormErrors();
    $('#categoryId').val('');
    $('#categoryName').val('');
    $('#categoryDescription').val('');
    $('#categoryStatus').val('ACTIVE');

    $('#modalTitle').text('Add New Category');
    $('#saveCategoryBtn').text('Save Category');
    $('#categoryModal').removeClass('hidden');
}

function openEditCategoryModal(id) {
    resetFormErrors();
    const category = categoriesData.find(c => c.id === id);
    if (!category) return;

    $('#categoryId').val(category.id);
    $('#categoryName').val(category.name);
    $('#categoryDescription').val(category.description || '');
    $('#categoryStatus').val(category.status);

    $('#modalTitle').text('Edit Category');
    $('#saveCategoryBtn').text('Update Category');

    $('#viewCategoryModal').addClass('hidden');
    $('#categoryModal').removeClass('hidden');
}

function openViewCategoryModal(id) {
    const category = categoriesData.find(c => c.id === id);
    if (!category) return;

    $('#viewCategoryId').text(`#${category.id}`);
    $('#viewCategoryName').text(category.name);
    $('#viewCategoryDescription').text(category.description || 'No description provided.');
    $('#viewCategoryBooks').text(`${category.bookCount} Books`);
    $('#viewCategoryStatus').html(category.status === 'ACTIVE'
        ? `<span class="badge-status active"><i class="fa-solid fa-circle"></i> Active</span>`
        : `<span class="badge-status inactive"><i class="fa-solid fa-circle"></i> Inactive</span>`
    );
    $('#viewCategoryCreated').text(formatDateLong(category.createdAt));

    $('#viewEditCategoryBtn').off('click').on('click', function () {
        openEditCategoryModal(category.id);
    });

    $('#viewCategoryModal').removeClass('hidden');
}

function saveCategory() {
    if (!validateCategoryForm()) return;

    const id = $('#categoryId').val();
    const name = $('#categoryName').val().trim();
    const description = $('#categoryDescription').val().trim();
    const status = $('#categoryStatus').val();

    if (id) {
        // Update Action (PUT /api/v1/categories/{id})
        const index = categoriesData.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            categoriesData[index].name = name;
            categoriesData[index].description = description;
            categoriesData[index].status = status;
            showToast('Category updated successfully.', 'success');
        }
    } else {
        // Create Action (POST /api/v1/categories)
        const newCategory = {
            id: Date.now(), // Temporary ID generator
            name: name,
            description: description,
            status: status,
            createdAt: new Date().toISOString(),
            bookCount: 0
        };
        categoriesData.unshift(newCategory);
        showToast('Category created successfully.', 'success');
    }

    closeModals();
    updateStatistics();
    applyFilterAndSort();
}

function openDeleteModal(id) {
    const category = categoriesData.find(c => c.id === id);
    if (!category) return;

    categoryToDeleteId = id;
    $('#deleteCategoryName').text(category.name);

    if (category.bookCount > 0) {
        $('#deleteWarningMessage').removeClass('hidden');
        $('#confirmDeleteBtn').prop('disabled', true);
    } else {
        $('#deleteWarningMessage').addClass('hidden');
        $('#confirmDeleteBtn').prop('disabled', false);
    }

    $('#deleteCategoryModal').removeClass('hidden');
}

function deleteCategory() {
    if (!categoryToDeleteId) return;

    // AJAX Call placeholder DELETE /api/v1/categories/{id}
    categoriesData = categoriesData.filter(c => c.id !== categoryToDeleteId);
    showToast('Category deleted successfully.', 'success');

    categoryToDeleteId = null;
    closeModals();
    updateStatistics();
    applyFilterAndSort();
}

/* ==========================================================================
   Validation Logic
   ========================================================================== */
function validateCategoryForm() {
    resetFormErrors();
    let isValid = true;
    const id = $('#categoryId').val();
    const name = $('#categoryName').val().trim();
    const description = $('#categoryDescription').val().trim();

    if (!name) {
        $('#categoryNameError').text('Category name is required.');
        isValid = false;
    } else if (name.length < 2) {
        $('#categoryNameError').text('Category name must be at least 2 characters.');
        isValid = false;
    } else if (name.length > 100) {
        $('#categoryNameError').text('Category name cannot exceed 100 characters.');
        isValid = false;
    } else {
        // Check duplicate name
        const duplicate = categoriesData.some(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== parseInt(id));
        if (duplicate) {
            $('#categoryNameError').text('Category name already exists.');
            showToast('Category name already exists.', 'warning');
            isValid = false;
        }
    }

    if (description.length > 500) {
        $('#categoryDescriptionError').text('Description cannot exceed 500 characters.');
        isValid = false;
    }

    return isValid;
}

function resetFormErrors() {
    $('#categoryNameError, #categoryDescriptionError').text('');
}

function closeModals() {
    $('.modal-overlay').addClass('hidden');
}

/* ==========================================================================
   AI Assistant Simulation
   ========================================================================== */
function handleAiQuery(queryText) {
    if (!queryText) return;

    appendAiMessage('user', queryText);
    $('#aiInput').val('');

    // Dynamic responses based on context
    setTimeout(function () {
        let reply = "I can help you review your categories. Feel free to filter or modify them using the dashboard.";
        const lower = queryText.toLowerCase();

        if (lower.includes('active categories')) {
            const count = categoriesData.filter(c => c.status === 'ACTIVE').length;
            reply = `You currently have ${count} active categories out of ${categoriesData.length} total categories.`;
        } else if (lower.includes('most books')) {
            const top = [...categoriesData].sort((a, b) => b.bookCount - a.bookCount)[0];
            reply = top ? `The category with the most books is "${top.name}" with ${top.bookCount} books.` : "No categories found.";
        } else if (lower.includes('no books')) {
            const emptyCats = categoriesData.filter(c => c.bookCount === 0).map(c => c.name);
            reply = emptyCats.length > 0 ? `Categories with 0 books: ${emptyCats.join(', ')}.` : "All categories currently have books assigned!";
        } else if (lower.includes('inactive')) {
            const inactiveCats = categoriesData.filter(c => c.status === 'INACTIVE').map(c => c.name);
            reply = inactiveCats.length > 0 ? `Inactive categories: ${inactiveCats.join(', ')}.` : "There are no inactive categories currently.";
        } else if (lower.includes('fiction')) {
            const fic = categoriesData.find(c => c.name.toLowerCase() === 'fiction');
            reply = fic ? `The Fiction category has ${fic.bookCount} books.` : "Fiction category was not found.";
        }

        appendAiMessage('bot', reply);
    }, 500);
}

function appendAiMessage(sender, text) {
    const messageHtml = `
        <div class="ai-message ${sender}">
            <div class="message-content">${escapeHtml(text)}</div>
        </div>
    `;
    $('#aiChatBody').append(messageHtml);
    $('#aiChatBody').scrollTop($('#aiChatBody')[0].scrollHeight);
}

/* ==========================================================================
   Utilities & Notifications
   ========================================================================== */
function showToast(message, type = 'success') {
    const toast = $(`
        <div class="toast ${type}">
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-xmark'}"></i>
            <span>${escapeHtml(message)}</span>
        </div>
    `);

    $('#toastContainer').append(toast);
    setTimeout(() => {
        toast.fadeOut(300, function () { $(this).remove(); });
    }, 3000);
}

function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateLong(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* ==========================================================================
   Event Listeners Configuration
   ========================================================================== */
function setupEventListeners() {
    // Theme Toggle
    $('#themeToggle').on('click', function () {
        const currentTheme = $('body').hasClass('dark-mode') ? 'dark-mode' : 'light-mode';
        const newTheme = currentTheme === 'light-mode' ? 'dark-mode' : 'light-mode';
        $('body').removeClass(currentTheme).addClass(newTheme);
        localStorage.setItem('bookhaven_theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Mobile Sidebar
    $('#sidebarToggleBtn').on('click', function () {
        $('#sidebar').addClass('open');
    });
    $('#sidebarCloseBtn').on('click', function () {
        $('#sidebar').removeClass('open');
    });

    // Filtering & Searching
    $('#applyFiltersBtn').on('click', applyFilterAndSort);
    $('#clearFiltersBtn').on('click', clearFilters);
    $('#searchInput').on('keyup', function (e) {
        if (e.key === 'Enter') applyFilterAndSort();
    });

    // Modal Actions
    $('#addCategoryBtn, #emptyAddCategoryBtn').on('click', openAddCategoryModal);
    $('#closeCategoryModalBtn, #cancelCategoryModalBtn').on('click', closeModals);
    $('#closeViewModalBtn, #viewCloseBtn').on('click', closeModals);
    $('#closeDeleteModalBtn, #cancelDeleteBtn').on('click', closeModals);

    // Form Submit
    $('#categoryForm').on('submit', function (e) {
        e.preventDefault();
        saveCategory();
    });

    // Delete Trigger
    $('#confirmDeleteBtn').on('click', deleteCategory);

    // Logout Modal
    $('#logoutBtn').on('click', function () {
        $('#logoutModal').removeClass('hidden');
    });
    $('#closeLogoutModalBtn, #cancelLogoutBtn').on('click', closeModals);
    $('#confirmLogoutBtn').on('click', function () {
        localStorage.removeItem('jwt_token');
        window.location.href = '../login.html';
    });

    // AI Assistant Toggles
    $('#aiToggleBtn').on('click', function () {
        $('#aiChatWindow').toggleClass('hidden');
    });
    $('#aiCloseBtn').on('click', function () {
        $('#aiChatWindow').addClass('hidden');
    });
    $('#aiSendBtn').on('click', function () {
        handleAiQuery($('#aiInput').val().trim());
    });
    $('#aiInput').on('keyup', function (e) {
        if (e.key === 'Enter') handleAiQuery($(this).val().trim());
    });
    $(document).on('click', '.suggestion-btn', function () {
        handleAiQuery($(this).text().trim());
    });
}