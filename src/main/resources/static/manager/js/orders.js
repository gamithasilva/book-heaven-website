/**
 * BookHaven Order Management System
 * Manager Portal JS Functionality
 * Author: Development Team
 * Date: 2026
 */

// Master Sample Orders Dataset (12 Initialized Orders)
let sampleOrders = [
    {
        id: 1,
        orderNumber: "BH-2026-00125",
        orderDate: "2026-08-23",
        status: "SHIPPED",
        paymentMethod: "CASH_ON_DELIVERY",
        paymentStatus: "PENDING",
        transactionId: null,
        customer: { id: 101, name: "Kaveesha Silva", email: "kaveesha@example.com", phone: "0771234567" },
        shippingAddress: { recipientName: "Kaveesha Silva", addressLine1: "25 Main Street", addressLine2: "Apt 4B", city: "Colombo", postalCode: "00100", country: "Sri Lanka", phone: "0771234567" },
        items: [
            { bookId: 1, title: "Clean Code", author: "Robert C. Martin", quantity: 1, unitPrice: 4500, subtotal: 4500, coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=100" },
            { bookId: 2, title: "Atomic Habits", author: "James Clear", quantity: 1, unitPrice: 3000, subtotal: 3000, coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=100" }
        ],
        subtotal: 7500, discount: 500, deliveryFee: 350, total: 7350
    },
    {
        id: 2,
        orderNumber: "BH-2026-00124",
        orderDate: "2026-08-23",
        status: "PROCESSING",
        paymentMethod: "CARD",
        paymentStatus: "PAID",
        transactionId: "TXN-9988231",
        customer: { id: 102, name: "Nimal Perera", email: "nimal@example.com", phone: "0719876543" },
        shippingAddress: { recipientName: "Nimal Perera", addressLine1: "12 Temple Road", addressLine2: "", city: "Kandy", postalCode: "20000", country: "Sri Lanka", phone: "0719876543" },
        items: [
            { bookId: 1, title: "Clean Code", author: "Robert C. Martin", quantity: 1, unitPrice: 4500, subtotal: 4500, coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=100" }
        ],
        subtotal: 4500, discount: 0, deliveryFee: 350, total: 4850
    },
    {
        id: 3,
        orderNumber: "BH-2026-00123",
        orderDate: "2026-08-22",
        status: "DELIVERED",
        paymentMethod: "ONLINE",
        paymentStatus: "PAID",
        transactionId: "TXN-7741029",
        customer: { id: 103, name: "Amaya Fernando", email: "amaya@example.com", phone: "0754433221" },
        shippingAddress: { recipientName: "Amaya Fernando", addressLine1: "88 Galle Road", addressLine2: "", city: "Galle", postalCode: "80000", country: "Sri Lanka", phone: "0754433221" },
        items: [
            { bookId: 3, title: "The Pragmatic Programmer", author: "Andrew Hunt", quantity: 2, unitPrice: 5200, subtotal: 10400, coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=100" }
        ],
        subtotal: 10400, discount: 1000, deliveryFee: 0, total: 9400
    },
    {
        id: 4,
        orderNumber: "BH-2026-00122",
        orderDate: "2026-08-21",
        status: "PENDING",
        paymentMethod: "CASH_ON_DELIVERY",
        paymentStatus: "PENDING",
        transactionId: null,
        customer: { id: 104, name: "Sunil Jayasinghe", email: "sunil@example.com", phone: "0723344556" },
        shippingAddress: { recipientName: "Sunil Jayasinghe", addressLine1: "45 Station Road", addressLine2: "", city: "Kurunegala", postalCode: "60000", country: "Sri Lanka", phone: "0723344556" },
        items: [
            { bookId: 4, title: "Design Patterns", author: "Erich Gamma", quantity: 1, unitPrice: 6000, subtotal: 6000, coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=100" }
        ],
        subtotal: 6000, discount: 0, deliveryFee: 350, total: 6350
    },
    {
        id: 5,
        orderNumber: "BH-2026-00121",
        orderDate: "2026-08-20",
        status: "CONFIRMED",
        paymentMethod: "CARD",
        paymentStatus: "PAID",
        transactionId: "TXN-5511024",
        customer: { id: 105, name: "Dilani Rajapaksha", email: "dilani@example.com", phone: "0761122334" },
        shippingAddress: { recipientName: "Dilani Rajapaksha", addressLine1: "10 Flower Road", addressLine2: "", city: "Colombo", postalCode: "00700", country: "Sri Lanka", phone: "0761122334" },
        items: [
            { bookId: 2, title: "Atomic Habits", author: "James Clear", quantity: 3, unitPrice: 3000, subtotal: 9000, coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=100" }
        ],
        subtotal: 9000, discount: 500, deliveryFee: 350, total: 8850
    },
    {
        id: 6,
        orderNumber: "BH-2026-00120",
        orderDate: "2026-08-19",
        status: "CANCELLED",
        paymentMethod: "CARD",
        paymentStatus: "REFUNDED",
        transactionId: "TXN-3300192",
        customer: { id: 106, name: "Kasun Kalhara", email: "kasun@example.com", phone: "0778899001" },
        shippingAddress: { recipientName: "Kasun Kalhara", addressLine1: "55 Beach Road", addressLine2: "", city: "Negombo", postalCode: "11500", country: "Sri Lanka", phone: "0778899001" },
        items: [
            { bookId: 1, title: "Clean Code", author: "Robert C. Martin", quantity: 1, unitPrice: 4500, subtotal: 4500, coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=100" }
        ],
        subtotal: 4500, discount: 0, deliveryFee: 350, total: 4850
    },
    {
        id: 7,
        orderNumber: "BH-2026-00119",
        orderDate: "2026-08-18",
        status: "DELIVERED",
        paymentMethod: "CASH_ON_DELIVERY",
        paymentStatus: "PAID",
        transactionId: null,
        customer: { id: 107, name: "Nuwan Pradeep", email: "nuwan@example.com", phone: "0712233445" },
        shippingAddress: { recipientName: "Nuwan Pradeep", addressLine1: "101 High Level Rd", addressLine2: "", city: "Nugegoda", postalCode: "10250", country: "Sri Lanka", phone: "0712233445" },
        items: [
            { bookId: 3, title: "The Pragmatic Programmer", author: "Andrew Hunt", quantity: 1, unitPrice: 5200, subtotal: 5200, coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=100" }
        ],
        subtotal: 5200, discount: 200, deliveryFee: 350, total: 5350
    },
    {
        id: 8,
        orderNumber: "BH-2026-00118",
        orderDate: "2026-08-17",
        status: "SHIPPED",
        paymentMethod: "ONLINE",
        paymentStatus: "PAID",
        transactionId: "TXN-8812734",
        customer: { id: 108, name: "Tharushi Cooray", email: "tharushi@example.com", phone: "0759988776" },
        shippingAddress: { recipientName: "Tharushi Cooray", addressLine1: "77 Park Street", addressLine2: "", city: "Colombo", postalCode: "00200", country: "Sri Lanka", phone: "0759988776" },
        items: [
            { bookId: 4, title: "Design Patterns", author: "Erich Gamma", quantity: 1, unitPrice: 6000, subtotal: 6000, coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=100" }
        ],
        subtotal: 6000, discount: 600, deliveryFee: 350, total: 5750
    },
    {
        id: 9,
        orderNumber: "BH-2026-00117",
        orderDate: "2026-08-16",
        status: "PROCESSING",
        paymentMethod: "CARD",
        paymentStatus: "PAID",
        transactionId: "TXN-1299384",
        customer: { id: 109, name: "Sahan Wickramasinghe", email: "sahan@example.com", phone: "0701122334" },
        shippingAddress: { recipientName: "Sahan Wickramasinghe", addressLine1: "33 Lake Road", addressLine2: "", city: "Anuradhapura", postalCode: "50000", country: "Sri Lanka", phone: "0701122334" },
        items: [
            { bookId: 2, title: "Atomic Habits", author: "James Clear", quantity: 2, unitPrice: 3000, subtotal: 6000, coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=100" }
        ],
        subtotal: 6000, discount: 0, deliveryFee: 350, total: 6350
    },
    {
        id: 10,
        orderNumber: "BH-2026-00116",
        orderDate: "2026-08-15",
        status: "PENDING",
        paymentMethod: "CASH_ON_DELIVERY",
        paymentStatus: "PENDING",
        transactionId: null,
        customer: { id: 110, name: "Bhashini De Silva", email: "bhashini@example.com", phone: "0773344112" },
        shippingAddress: { recipientName: "Bhashini De Silva", addressLine1: "14 Modern Lane", addressLine2: "", city: "Ratnapura", postalCode: "70000", country: "Sri Lanka", phone: "0773344112" },
        items: [
            { bookId: 1, title: "Clean Code", author: "Robert C. Martin", quantity: 1, unitPrice: 4500, subtotal: 4500, coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=100" }
        ],
        subtotal: 4500, discount: 0, deliveryFee: 350, total: 4850
    },
    {
        id: 11,
        orderNumber: "BH-2026-00115",
        orderDate: "2026-08-14",
        status: "DELIVERED",
        paymentMethod: "CARD",
        paymentStatus: "PAID",
        transactionId: "TXN-9021823",
        customer: { id: 111, name: "Mahesh Gunawardena", email: "mahesh@example.com", phone: "0765544332" },
        shippingAddress: { recipientName: "Mahesh Gunawardena", addressLine1: "90 Circular Rd", addressLine2: "", city: "Matara", postalCode: "81000", country: "Sri Lanka", phone: "0765544332" },
        items: [
            { bookId: 3, title: "The Pragmatic Programmer", author: "Andrew Hunt", quantity: 1, unitPrice: 5200, subtotal: 5200, coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=100" }
        ],
        subtotal: 5200, discount: 500, deliveryFee: 350, total: 5050
    },
    {
        id: 12,
        orderNumber: "BH-2026-00114",
        orderDate: "2026-08-13",
        status: "CONFIRMED",
        paymentMethod: "ONLINE",
        paymentStatus: "PAID",
        transactionId: "TXN-4491023",
        customer: { id: 112, name: "Rashmi Senanayake", email: "rashmi@example.com", phone: "0718877665" },
        shippingAddress: { recipientName: "Rashmi Senanayake", addressLine1: "18 Hill Street", addressLine2: "", city: "Badulla", postalCode: "90000", country: "Sri Lanka", phone: "0718877665" },
        items: [
            { bookId: 4, title: "Design Patterns", author: "Erich Gamma", quantity: 2, unitPrice: 6000, subtotal: 12000, coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=100" }
        ],
        subtotal: 12000, discount: 1000, deliveryFee: 0, total: 11000
    }
];

// App State Variables
let filteredOrders = [];
let currentPage = 1;
const pageSize = 5; // Rows per page
let activeOrderForModal = null;
let pendingStatusUpdate = null;

// REST API Service Stubs
const API = {
    async fetchOrders() {
        // GET /api/v1/orders
        return Promise.resolve([...sampleOrders]);
    },
    async updateOrderStatus(id, status) {
        // PATCH /api/v1/orders/{id}/status
        const target = sampleOrders.find(o => o.id === id);
        if (target) target.status = status;
        return Promise.resolve({ success: true, order: target });
    },
    async cancelOrder(id) {
        // PATCH /api/v1/orders/{id}/cancel
        const target = sampleOrders.find(o => o.id === id);
        if (target) target.status = "CANCELLED";
        return Promise.resolve({ success: true, order: target });
    },
    async sendAiMessage(message) {
        // POST /api/v1/ai/chat
        const msg = message.toLowerCase();
        let res = "I can analyze sales performance, pending deliveries, and order counts.";

        if (msg.includes("pending")) {
            const count = sampleOrders.filter(o => o.status === "PENDING").length;
            res = `There are currently ${count} orders in PENDING status requiring manager review.`;
        } else if (msg.includes("shipped")) {
            const count = sampleOrders.filter(o => o.status === "SHIPPED").length;
            res = `There are ${count} orders currently SHIPPED and in transit to customers.`;
        } else if (msg.includes("total sales") || msg.includes("revenue")) {
            const total = sampleOrders.filter(o => o.status !== "CANCELLED").reduce((acc, curr) => acc + curr.total, 0);
            res = `Total net revenue from current non-cancelled orders is Rs. ${total.toLocaleString()}.`;
        } else if (msg.includes("cancelled")) {
            const count = sampleOrders.filter(o => o.status === "CANCELLED").length;
            res = `${count} order(s) have been CANCELLED.`;
        } else if (msg.includes("delivered")) {
            const count = sampleOrders.filter(o => o.status === "DELIVERED").length;
            res = `${count} order(s) have been successfully DELIVERED.`;
        }

        return Promise.resolve(res);
    }
};

// Application Initialization
$(document).ready(function () {
    checkAuth();
    initTheme();
    bindEvents();
    loadDashboardData();
});

// Guard Authentication
function checkAuth() {
    const isManagerLoggedIn = localStorage.getItem("managerLoggedIn");
    if (isManagerLoggedIn === "false") {
        window.location.href = "manager-login.html";
    }
}

// Theme Handlers
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

// Fetch & Render Engine Initialization
async function loadDashboardData() {
    showLoading(true);
    const orders = await API.fetchOrders();
    showLoading(false);

    filteredOrders = [...orders];
    updateStatistics(orders);
    applyFiltersAndSort();
}

// Statistics KPI Card Updates
function updateStatistics(orders) {
    $("#statTotal").text(orders.length);
    $("#statPending").text(orders.filter(o => o.status === "PENDING").length);
    $("#statConfirmed").text(orders.filter(o => o.status === "CONFIRMED").length);
    $("#statProcessing").text(orders.filter(o => o.status === "PROCESSING").length);
    $("#statShipped").text(orders.filter(o => o.status === "SHIPPED").length);
    $("#statDelivered").text(orders.filter(o => o.status === "DELIVERED").length);
}

// Filter, Search, and Sort Engine
function applyFiltersAndSort() {
    const searchTerm = $("#searchInput").val().trim().toLowerCase();
    const statusFilter = $("#filterStatus").val();
    const paymentStatusFilter = $("#filterPaymentStatus").val();
    const paymentMethodFilter = $("#filterPaymentMethod").val();
    const dateRange = $("#filterDate").val();
    const minPrice = parseFloat($("#filterMinPrice").val()) || 0;
    const maxPrice = parseFloat($("#filterMaxPrice").val()) || Infinity;
    const sortBy = $("#sortBy").val();

    filteredOrders = sampleOrders.filter(order => {
        // Search Matching
        const matchesSearch = !searchTerm ||
            order.orderNumber.toLowerCase().includes(searchTerm) ||
            order.customer.name.toLowerCase().includes(searchTerm) ||
            order.customer.email.toLowerCase().includes(searchTerm) ||
            order.items.some(item => item.title.toLowerCase().includes(searchTerm));

        // Filter Matching
        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
        const matchesPaymentStatus = paymentStatusFilter === "ALL" || order.paymentStatus === paymentStatusFilter;
        const matchesPaymentMethod = paymentMethodFilter === "ALL" || order.paymentMethod === paymentMethodFilter;
        const matchesPrice = order.total >= minPrice && order.total <= maxPrice;

        // Date Range Logic
        let matchesDate = true;
        const orderDate = new Date(order.orderDate);
        const today = new Date("2026-08-24"); // Baseline fixed current mock date

        if (dateRange === "TODAY") {
            matchesDate = order.orderDate === "2026-08-24";
        } else if (dateRange === "LAST_7") {
            const diffTime = Math.abs(today - orderDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            matchesDate = diffDays <= 7;
        } else if (dateRange === "LAST_30") {
            const diffTime = Math.abs(today - orderDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            matchesDate = diffDays <= 30;
        } else if (dateRange === "THIS_YEAR") {
            matchesDate = orderDate.getFullYear() === 2026;
        }

        return matchesSearch && matchesStatus && matchesPaymentStatus && matchesPaymentMethod && matchesPrice && matchesDate;
    });

    // Sorting Engine
    filteredOrders.sort((a, b) => {
        if (sortBy === "NEWEST") return new Date(b.orderDate) - new Date(a.orderDate);
        if (sortBy === "OLDEST") return new Date(a.orderDate) - new Date(b.orderDate);
        if (sortBy === "TOTAL_DESC") return b.total - a.total;
        if (sortBy === "TOTAL_ASC") return a.total - b.total;
        if (sortBy === "CUSTOMER_ASC") return a.customer.name.localeCompare(b.customer.name);
        if (sortBy === "CUSTOMER_DESC") return b.customer.name.localeCompare(a.customer.name);
        return 0;
    });

    currentPage = 1;
    renderTable();
}

// Master Table Render Loop
function renderTable() {
    const tbody = $("#ordersTableBody");
    tbody.empty();

    if (filteredOrders.length === 0) {
        $("#ordersTable").addClass("hidden");
        $("#emptyState").removeClass("hidden");
        $(".pagination-footer").addClass("hidden");
        return;
    }

    $("#ordersTable").removeClass("hidden");
    $("#emptyState").addClass("hidden");
    $(".pagination-footer").removeClass("hidden");

    // Pagination Calculations
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredOrders.length);
    const paginatedItems = filteredOrders.slice(startIndex, endIndex);

    paginatedItems.forEach(order => {
        const row = `
            <tr>
                <td><strong>${escapeHtml(order.orderNumber)}</strong></td>
                <td class="customer-cell">
                    <strong>${escapeHtml(order.customer.name)}</strong>
                    <span>${escapeHtml(order.customer.email)}</span>
                </td>
                <td>${formatDate(order.orderDate)}</td>
                <td>${order.items.length} Book${order.items.length > 1 ? 's' : ''}</td>
                <td><strong>Rs. ${order.total.toLocaleString()}</strong></td>
                <td>
                    <div>${formatPaymentMethod(order.paymentMethod)}</div>
                    <span class="badge-payment ${order.paymentStatus}">${order.paymentStatus}</span>
                </td>
                <td>
                    <span class="badge-status ${order.status}">${order.status}</span>
                </td>
                <td>
                    <select class="form-control quick-status-select" data-id="${order.id}">
                        <option value="PENDING" ${order.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                        <option value="CONFIRMED" ${order.status === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
                        <option value="PROCESSING" ${order.status === 'PROCESSING' ? 'selected' : ''}>PROCESSING</option>
                        <option value="SHIPPED" ${order.status === 'SHIPPED' ? 'selected' : ''}>SHIPPED</option>
                        <option value="DELIVERED" ${order.status === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
                        <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-secondary view-order-btn" data-id="${order.id}">
                        <i class="fa-solid fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });

    renderPagination(filteredOrders.length, startIndex, endIndex);
}

// Pagination Controls Generation
function renderPagination(totalItems, startIndex, endIndex) {
    $("#paginationInfo").text(`Showing ${totalItems > 0 ? startIndex + 1 : 0}–${endIndex} of ${totalItems} orders`);
    const container = $("#paginationControls");
    container.empty();

    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return;

    // Previous Button
    container.append(`<button class="page-btn" id="prevPage" ${currentPage === 1 ? 'disabled' : ''}>← Previous</button>`);

    // Numeric Buttons
    for (let i = 1; i <= totalPages; i++) {
        container.append(`<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`);
    }

    // Next Button
    container.append(`<button class="page-btn" id="nextPage" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>`);
}

// Order Detailed Modal Engine
function openOrderModal(orderId) {
    const order = sampleOrders.find(o => o.id === orderId);
    if (!order) return;

    activeOrderForModal = order;
    $("#modalOrderNumber").text(order.orderNumber);
    $("#modalOrderDate").text(`Placed on ${formatDate(order.orderDate)}`);
    $("#modalStatusSelect").val(order.status);
    $("#viewCustomerLink").attr("href", `customers.html?id=${order.customer.id}`);

    // Render Timeline Progress
    renderTimeline(order.status);

    // Customer & Address Setup
    $("#customerInfoBody").html(`
        <p><strong>Name:</strong> ${escapeHtml(order.customer.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(order.customer.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(order.customer.phone)}</p>
    `);

    const addr = order.shippingAddress;
    $("#shippingAddressBody").html(`
        <p><strong>Recipient:</strong> ${escapeHtml(addr.recipientName)}</p>
        <p>${escapeHtml(addr.addressLine1)} ${addr.addressLine2 ? ', ' + escapeHtml(addr.addressLine2) : ''}</p>
        <p>${escapeHtml(addr.city)}, ${escapeHtml(addr.postalCode)}</p>
        <p>${escapeHtml(addr.country)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(addr.phone)}</p>
    `);

    // Payment Details
    $("#paymentDetailsBody").html(`
        <p><strong>Method:</strong> ${formatPaymentMethod(order.paymentMethod)}</p>
        <p><strong>Status:</strong> <span class="badge-payment ${order.paymentStatus}">${order.paymentStatus}</span></p>
        <p><strong>Transaction ID:</strong> ${order.transactionId ? escapeHtml(order.transactionId) : 'Not Available'}</p>
    `);

    // Items Breakdown Table
    const itemsTbody = $("#modalItemsTableBody");
    itemsTbody.empty();
    order.items.forEach(item => {
        itemsTbody.append(`
            <tr>
                <td>
                    <div class="form-row align-center">
                        <img src="${item.coverImage}" class="book-thumb" alt="Cover">
                        <strong>${escapeHtml(item.title)}</strong>
                    </div>
                </td>
                <td>${escapeHtml(item.author)}</td>
                <td>${item.quantity}</td>
                <td>Rs. ${item.unitPrice.toLocaleString()}</td>
                <td><strong>Rs. ${item.subtotal.toLocaleString()}</strong></td>
            </tr>
        `);
    });

    // Summary Calculations
    $("#summarySubtotal").text(`Rs. ${order.subtotal.toLocaleString()}`);
    $("#summaryDiscount").text(`-Rs. ${order.discount.toLocaleString()}`);
    $("#summaryDelivery").text(`Rs. ${order.deliveryFee.toLocaleString()}`);
    $("#summaryTotal").text(`Rs. ${order.total.toLocaleString()}`);

    // Cancel Button Visibility Constraint Logic
    if (order.status === "PENDING" || order.status === "CONFIRMED") {
        $("#modalCancelOrderBtn").removeClass("hidden");
    } else {
        $("#modalCancelOrderBtn").addClass("hidden");
    }

    $("#orderDetailsModal").removeClass("hidden");
}

// Timeline Dynamic Render
function renderTimeline(status) {
    const stages = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
    const labels = ["Order Placed", "Confirmed", "Processing", "Shipped", "Delivered"];
    const container = $("#orderTimeline");
    container.empty();

    if (status === "CANCELLED") {
        container.html(`<div class="badge-status CANCELLED" style="margin: 0 auto;">THIS ORDER HAS BEEN CANCELLED</div>`);
        return;
    }

    const currentIdx = stages.indexOf(status);

    stages.forEach((stage, idx) => {
        let stateClass = "";
        let iconHtml = idx + 1;

        if (idx < currentIdx) {
            stateClass = "completed";
            iconHtml = `<i class="fa-solid fa-check"></i>`;
        } else if (idx === currentIdx) {
            stateClass = "active";
            iconHtml = `<i class="fa-solid fa-circle"></i>`;
        }

        container.append(`
            <div class="timeline-step ${stateClass}">
                <div class="step-icon">${iconHtml}</div>
                <span class="step-label">${labels[idx]}</span>
            </div>
        `);
    });
}

// Business Logic Guard for Allowed Status Transitions
function validateStatusTransition(currentStatus, targetStatus) {
    if (currentStatus === targetStatus) return { valid: true };

    if (currentStatus === "DELIVERED" && (targetStatus === "PROCESSING" || targetStatus === "SHIPPED")) {
        return { valid: false, message: "Cannot revert a DELIVERED order back to Processing or Shipped." };
    }

    if (currentStatus === "CANCELLED" && (targetStatus === "PROCESSING" || targetStatus === "SHIPPED" || targetStatus === "CONFIRMED")) {
        return { valid: false, message: "Cannot transition a CANCELLED order back to active states." };
    }

    return { valid: true };
}

// Event Bindings
function bindEvents() {
    // Theme Toggle
    $("#themeToggle").on("click", function () {
        const currentTheme = $("body").hasClass("dark-mode") ? "light-mode" : "dark-mode";
        $("body").removeClass("light-mode dark-mode").addClass(currentTheme);
        localStorage.setItem("theme", currentTheme);
        updateThemeIcon(currentTheme);
    });

    // Mobile Sidebar
    $("#sidebarToggle").on("click", function () {
        $("#sidebar").toggleClass("open");
    });

    // Mobile Filters Toggle
    $("#toggleFilterBtn").on("click", function () {
        $("#filterBody").toggleClass("open");
    });

    // Live Search with Clear Trigger
    $("#searchInput").on("input", function () {
        const val = $(this).val();
        if (val) $("#clearSearchBtn").removeClass("hidden");
        else $("#clearSearchBtn").addClass("hidden");
        applyFiltersAndSort();
    });

    $("#clearSearchBtn").on("click", function () {
        $("#searchInput").val("");
        $(this).addClass("hidden");
        applyFiltersAndSort();
    });

    // Filter Buttons
    $("#applyFiltersBtn").on("click", applyFiltersAndSort);

    $("#clearFiltersBtn, #resetStateBtn").on("click", function () {
        $("#filterStatus").val("ALL");
        $("#filterPaymentStatus").val("ALL");
        $("#filterPaymentMethod").val("ALL");
        $("#filterDate").val("ALL");
        $("#filterMinPrice").val("");
        $("#filterMaxPrice").val("");
        $("#sortBy").val("NEWEST");
        $("#searchInput").val("");
        $("#clearSearchBtn").addClass("hidden");
        applyFiltersAndSort();
    });

    // Quick Select Table Status Update Event
    $(document).on("change", ".quick-status-select", function () {
        const select = $(this);
        const orderId = Number(select.data("id"));
        const targetStatus = select.val();
        const order = sampleOrders.find(o => o.id === orderId);

        const check = validateStatusTransition(order.status, targetStatus);
        if (!check.valid) {
            showToast(check.message, "error");
            select.val(order.status); // Revert select value
            return;
        }

        pendingStatusUpdate = { orderId, targetStatus, selectElement: select };
        showConfirmationDialog("Confirm Status Update", `Are you sure you want to change order ${order.orderNumber} status to ${targetStatus}?`, executeStatusUpdate);
    });

    // View Order Modal Triggers
    $(document).on("click", ".view-order-btn", function () {
        const orderId = Number($(this).data("id"));
        openOrderModal(orderId);
    });

    $(".close-modal-btn").on("click", function () {
        $("#orderDetailsModal").addClass("hidden");
    });

    // Update Status within Modal
    $("#modalUpdateStatusBtn").on("click", function () {
        if (!activeOrderForModal) return;

        const targetStatus = $("#modalStatusSelect").val();
        const check = validateStatusTransition(activeOrderForModal.status, targetStatus);

        if (!check.valid) {
            showToast(check.message, "error");
            $("#modalStatusSelect").val(activeOrderForModal.status);
            return;
        }

        pendingStatusUpdate = { orderId: activeOrderForModal.id, targetStatus, fromModal: true };
        showConfirmationDialog("Confirm Status Update", `Are you sure you want to change order ${activeOrderForModal.orderNumber} status to ${targetStatus}?`, executeStatusUpdate);
    });

    // Modal Cancel Order Trigger
    $("#modalCancelOrderBtn").on("click", function () {
        if (!activeOrderForModal) return;
        pendingStatusUpdate = { orderId: activeOrderForModal.id, targetStatus: "CANCELLED", fromModal: true };
        showConfirmationDialog("Cancel Order", `Are you sure you want to cancel order ${activeOrderForModal.orderNumber}?`, executeStatusUpdate);
    });

    // Pagination Events
    $(document).on("click", ".page-btn", function () {
        const btn = $(this);
        if (btn.attr("id") === "prevPage") {
            if (currentPage > 1) currentPage--;
        } else if (btn.attr("id") === "nextPage") {
            const maxPage = Math.ceil(filteredOrders.length / pageSize);
            if (currentPage < maxPage) currentPage++;
        } else {
            currentPage = Number(btn.data("page"));
        }
        renderTable();
    });

    // Logout Modal
    $("#logoutBtn").on("click", function () {
        $("#logoutModal").removeClass("hidden");
    });

    $("#cancelLogoutBtn").on("click", function () {
        $("#logoutModal").addClass("hidden");
    });

    $("#confirmLogoutBtn").on("click", function () {
        localStorage.setItem("managerLoggedIn", "false");
        window.location.href = "manager-login.html";
    });

    // AI Floating Assistant Handlers
    $("#aiToggleBtn").on("click", function () {
        $("#aiChatCard").toggleClass("hidden");
    });

    $("#closeAiBtn").on("click", function () {
        $("#aiChatCard").addClass("hidden");
    });

    $("#sendAiBtn").on("click", function () {
        handleAiSubmit($("#aiInput").val().trim());
    });

    $("#aiInput").on("keypress", function (e) {
        if (e.which === 13) handleAiSubmit($(this).val().trim());
    });

    $(".ai-suggestions").on("click", ".ai-chip", function () {
        handleAiSubmit($(this).text());
    });
}

// Confirmation Dialog Prompt Handler
function showConfirmationDialog(title, message, onConfirm) {
    $("#confirmTitle").text(title);
    $("#confirmMessage").text(message);
    $("#confirmationModal").removeClass("hidden");

    $("#confirmActionBtn").off("click").on("click", function () {
        $("#confirmationModal").addClass("hidden");
        onConfirm();
    });

    $("#cancelActionBtn").off("click").on("click", function () {
        $("#confirmationModal").addClass("hidden");
        // Revert quick select if cancelled
        if (pendingStatusUpdate && pendingStatusUpdate.selectElement) {
            const order = sampleOrders.find(o => o.id === pendingStatusUpdate.orderId);
            pendingStatusUpdate.selectElement.val(order.status);
        }
    });
}

// Perform Async Status Update Call
async function executeStatusUpdate() {
    if (!pendingStatusUpdate) return;

    const { orderId, targetStatus } = pendingStatusUpdate;
    const res = await API.updateOrderStatus(orderId, targetStatus);

    if (res.success) {
        showToast(`Order status updated to ${targetStatus} successfully.`, "success");
        updateStatistics(sampleOrders);
        applyFiltersAndSort();

        if ($("#orderDetailsModal").is(":visible") && activeOrderForModal && activeOrderForModal.id === orderId) {
            openOrderModal(orderId); // Refresh modal view
        }
    } else {
        showToast("Failed to update status.", "error");
    }

    pendingStatusUpdate = null;
}

// Helper Utilities
function showLoading(show) {
    if (show) $("#loadingState").removeClass("hidden");
    else $("#loadingState").addClass("hidden");
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatPaymentMethod(pm) {
    if (pm === "CASH_ON_DELIVERY") return "Cash on Delivery";
    if (pm === "CARD") return "Card";
    if (pm === "ONLINE") return "Online Payment";
    return pm;
}

// AI Message Handler
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

// Toast Notification Popup Helper
function showToast(message, type = "success") {
    const toast = $(`
        <div class="toast ${type}">
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
            <span>${escapeHtml(message)}</span>
        </div>
    `);

    $("#toastContainer").append(toast);

    setTimeout(() => {
        toast.fadeOut(300, function () { $(this).remove(); });
    }, 3000);
}

// Helper to sanitize HTML
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}