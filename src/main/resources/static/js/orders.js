/**
 * BookHaven - Orders Management & Tracking Engine
 * Integrated with Spring Boot REST API endpoints
 */

// App State
let ordersData = [];
let filteredOrders = [];
let activeCancelOrderId = null;

// ==========================================================================
// Initialization
// ==========================================================================
$(document).ready(function () {
    initTheme();
    setupEventListeners();
    loadOrders();
    updateHeaderBadges();
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
    loadCartBadgeAPI();
    loadWishlistBadgeAPI();
}

function loadCartBadgeAPI() {
    const token = localStorage.getItem('token');
    if (!token) {
        $('#cart-badge').text('0');
        return;
    }

    $.ajax({
        url: 'api/customer/cart',
        type: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
        success: function (response) {
            if (response.status === 200 && response.body) {
                const items = response.body.items || [];
                const totalQty = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
                $('#cart-badge').text(totalQty);
            } else {
                $('#cart-badge').text('0');
            }
        },
        error: function () {
            $('#cart-badge').text('0');
        }
    });
}

function loadWishlistBadgeAPI() {
    const token = localStorage.getItem('token');
    if (!token) {
        $('#wishlist-badge').text('0');
        return;
    }

    $.ajax({
        url: 'api/v1/wishlist',
        type: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
        success: function (response) {
            if (response.status === 200 && response.body) {
                const items = response.body.wishlistItemDTOS || [];
                $('#wishlist-badge').text(items.length);
            } else {
                $('#wishlist-badge').text('0');
            }
        },
        error: function () {
            $('#wishlist-badge').text('0');
        }
    });
}

// ==========================================================================
// API & Data Fetching Engine
// ==========================================================================
function loadOrders() {
    const token = localStorage.getItem('token');

    if (!token) {
        showToast('Please login to view your orders.', 'info');
        $('#orders-loading-state').hide();
        $('#empty-orders-state').fadeIn();
        return;
    }

    $('#orders-loading-state').show();
    $('#orders-error-state, #empty-orders-state, #orders-list-container, #pagination-container').hide();

    $.ajax({
        url: 'api/customer/orders/my-orders',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (response) {
            $('#orders-loading-state').hide();

            if (response.status === 200 && Array.isArray(response.body)) {
                ordersData = response.body;

                if (ordersData.length === 0) {
                    $('#stats-section').hide();
                    $('#empty-orders-state').fadeIn();
                } else {
                    $('#stats-section').show();
                    $('#orders-list-container').show();
                    calculateStatistics();
                    applyFiltersAndRender();
                }
            } else {
                ordersData = [];
                $('#empty-orders-state').fadeIn();
            }
        },
        error: function (xhr) {
            $('#orders-loading-state').hide();
            console.error('Failed to load orders:', xhr);

            if (xhr.status === 401 || xhr.status === 403) {
                showToast('Session expired. Please login again.', 'error');
            } else {
                $('#orders-error-state').show();
            }
        }
    });
}

// ==========================================================================
// Statistics Engine
// ==========================================================================
function calculateStatistics() {
    const total = ordersData.length;
    const pending = ordersData.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PROCESSING').length;
    const shipped = ordersData.filter(o => o.status === 'SHIPPED').length;
    const delivered = ordersData.filter(o => o.status === 'DELIVERED').length;

    $('#stat-total').text(total);
    $('#stat-pending').text(pending);
    $('#stat-shipped').text(shipped);
    $('#stat-delivered').text(delivered);
}

// ==========================================================================
// Filtering, Sorting & Search Engine
// ==========================================================================
function applyFiltersAndRender() {
    const searchVal = $('#search-input').val().toLowerCase().trim();
    const statusVal = $('#status-filter').val();
    const dateVal = $('#date-filter').val();
    const sortVal = $('#sort-filter').val();

    filteredOrders = ordersData.filter(order => {
        // Status Match
        if (statusVal !== 'ALL' && order.status !== statusVal) return false;

        // Search Match (Order number or book title)
        if (searchVal) {
            const matchesNum = order.orderNumber ? order.orderNumber.toLowerCase().includes(searchVal) : false;
            const matchesBook = order.items ? order.items.some(item => item.bookTitle && item.bookTitle.toLowerCase().includes(searchVal)) : false;
            if (!matchesNum && !matchesBook) return false;
        }

        // Date Range Match
        if (dateVal !== 'ALL' && order.orderDate) {
            const orderDate = new Date(order.orderDate);
            const now = new Date();
            const diffTime = Math.abs(now - orderDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (dateVal === '30_DAYS' && diffDays > 30) return false;
            if (dateVal === '3_MONTHS' && diffDays > 90) return false;
            if (dateVal === '6_MONTHS' && diffDays > 180) return false;
            if (dateVal === 'THIS_YEAR' && orderDate.getFullYear() !== now.getFullYear()) return false;
        }

        return true;
    });

    // Sorting Logic
    filteredOrders.sort((a, b) => {
        if (sortVal === 'NEWEST') return new Date(b.orderDate) - new Date(a.orderDate);
        if (sortVal === 'OLDEST') return new Date(a.orderDate) - new Date(b.orderDate);
        if (sortVal === 'HIGHEST') return (b.total || 0) - (a.total || 0);
        if (sortVal === 'LOWEST') return (a.total || 0) - (b.total || 0);
        return 0;
    });

    renderOrderCards(filteredOrders);
}

// ==========================================================================
// UI Card Rendering Engine
// ==========================================================================
function renderOrderCards(orders) {
    const container = $('#orders-list-container').empty();

    if (orders.length === 0) {
        container.html(`
            <div class="empty-state">
                <i class="fa-solid fa-filter-circle-xmark" style="font-size:2.5rem; color:var(--text-muted); margin-bottom:1rem;"></i>
                <h3>No Matching Orders Found</h3>
                <p>Try clearing your filters or search terms.</p>
            </div>
        `);
        $('#pagination-container').hide();
        return;
    }

    orders.forEach(order => {
        const statusBadgeHTML = getStatusBadgeHTML(order.status);
        const bookItemsHTML = renderBookItemsPreview(order.items || []);
        const isCancelable = (order.status === 'PENDING' || order.status === 'CONFIRMED');
        const isDelivered = (order.status === 'DELIVERED');

        container.append(`
            <div class="order-card" id="order-card-${order.id}">
                <div class="order-header-row">
                    <div class="order-meta-info">
                        <span class="order-number">${order.orderNumber}</span>
                        <span class="order-date">Placed: ${formatDate(order.orderDate)}</span>
                    </div>
                    <div>${statusBadgeHTML}</div>
                </div>

                <div class="order-items-preview">
                    ${bookItemsHTML}
                </div>

                <div class="order-footer-row">
                    <div class="order-price-summary-inline">
                        Total: <strong>Rs. ${(order.total || 0).toLocaleString()}</strong>
                    </div>
                    <div class="order-actions-group">
                        <button class="btn btn-outline btn-sm" onclick="openDetailsModal(${order.id})">
                            <i class="fa-regular fa-file-lines"></i> View Details
                        </button>
                        ${order.status !== 'CANCELLED' ? `
                            <button class="btn btn-outline btn-sm" onclick="openTrackingModal(${order.id})">
                                <i class="fa-solid fa-truck"></i> Track Order
                            </button>
                        ` : ''}
                        ${isDelivered ? `
                            <button class="btn btn-primary btn-sm" onclick="buyAgain(${order.id})">
                                <i class="fa-solid fa-rotate-right"></i> Buy Again
                            </button>
                        ` : ''}
                        ${isCancelable ? `
                            <button class="btn btn-danger btn-sm" onclick="openCancelModal(${order.id})">
                                Cancel Order
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `);
    });

    $('#pagination-container').show();
}

function renderBookItemsPreview(items) {
    const displayItems = items.slice(0, 3);
    const extraCount = items.length - 3;

    let html = displayItems.map(item => `
        <div class="book-preview-item">
            <img src="${item.coverImage || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200'}" alt="${item.bookTitle || 'Book'}" class="book-thumb">
            <div class="book-info">
                <div class="book-title">${item.bookTitle || 'Untitled Book'}</div>
                <div class="book-author">${item.author || 'Unknown Author'}</div>
            </div>
            <div class="book-qty">Qty: ${item.quantity}</div>
        </div>
    `).join('');

    if (extraCount > 0) {
        html += `<div class="more-items-tag">+ ${extraCount} more item(s)</div>`;
    }

    return html;
}

function getStatusBadgeHTML(status) {
    const configs = {
        PENDING: { class: 'pending', icon: 'fa-regular fa-clock', label: 'Pending' },
        CONFIRMED: { class: 'confirmed', icon: 'fa-regular fa-circle-check', label: 'Confirmed' },
        PROCESSING: { class: 'processing', icon: 'fa-solid fa-gear', label: 'Processing' },
        SHIPPED: { class: 'shipped', icon: 'fa-solid fa-truck-fast', label: 'Shipped' },
        DELIVERED: { class: 'delivered', icon: 'fa-solid fa-circle-check', label: 'Delivered' },
        CANCELLED: { class: 'cancelled', icon: 'fa-solid fa-ban', label: 'Cancelled' }
    };

    const cfg = configs[status] || configs.PENDING;
    return `<span class="status-badge ${cfg.class}"><i class="${cfg.icon}"></i> ${cfg.label}</span>`;
}

// ==========================================================================
// Tracking Modal Engine & Timelines
// ==========================================================================
function openTrackingModal(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;

    $('#track-order-num').text(`#${order.orderNumber}`);

    if (order.status === 'DELIVERED') {
        $('#track-eta-text').text(`Delivered on ${formatDate(order.updatedAt || order.orderDate)}`);
    } else {
        $('#track-eta-text').text(`Order Date: ${formatDate(order.orderDate)}`);
    }

    const steps = [
        { key: 'PENDING', label: 'Order Placed' },
        { key: 'CONFIRMED', label: 'Order Confirmed' },
        { key: 'PROCESSING', label: 'Processing' },
        { key: 'SHIPPED', label: 'Shipped' },
        { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
        { key: 'DELIVERED', label: 'Delivered' }
    ];

    const currentStatusIndex = getStatusIndex(order.status);
    const container = $('#tracking-timeline-container').empty();

    steps.forEach((step, idx) => {
        let isCompleted = idx <= currentStatusIndex;
        let isActive = idx === currentStatusIndex;

        container.append(`
            <div class="timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                <div class="step-marker">
                    ${isCompleted ? '<i class="fa-solid fa-check"></i>' : (idx + 1)}
                </div>
                <div class="step-title">${step.label}</div>
                <div class="step-date">${isCompleted ? formatDate(order.orderDate) : 'Pending'}</div>
            </div>
        `);
    });

    $('#tracking-modal').fadeIn(200);
}

function getStatusIndex(status) {
    switch (status) {
        case 'PENDING': return 0;
        case 'CONFIRMED': return 1;
        case 'PROCESSING': return 2;
        case 'SHIPPED': return 3;
        case 'DELIVERED': return 5;
        default: return 0;
    }
}

// ==========================================================================
// Order Details Modal Engine
// ==========================================================================
function openDetailsModal(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;

    $('#modal-order-number').text(order.orderNumber);
    $('#modal-order-date').text(formatDate(order.orderDate));
    $('#modal-order-status').html(getStatusBadgeHTML(order.status));
    $('#modal-payment-method').text(formatPaymentName(order.payment ? order.payment.paymentMethod : 'N/A'));
    $('#modal-payment-status').text(order.payment ? order.payment.paymentStatus : 'Pending');
    $('#modal-delivery-address').text(order.shippingAddress || 'N/A');

    const tbody = $('#modal-items-tbody').empty();
    (order.items || []).forEach(item => {
        const itemSubtotal = item.subtotal || (item.unitPrice * item.quantity);
        tbody.append(`
            <tr>
                <td>
                    <div class="book-preview-item">
                        <img src="${item.coverImage || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200'}" alt="${item.bookTitle}" class="book-thumb">
                        <div>
                            <strong>${item.bookTitle}</strong>
                            <div class="text-sm text-muted">${item.author || ''}</div>
                        </div>
                    </div>
                </td>
                <td>${item.quantity}</td>
                <td>Rs. ${(item.unitPrice || 0).toLocaleString()}</td>
                <td><strong>Rs. ${itemSubtotal.toLocaleString()}</strong></td>
            </tr>
        `);
    });

    $('#modal-summary-subtotal').text(`Rs. ${(order.subtotal || 0).toLocaleString()}`);
    $('#modal-summary-discount').text(`-Rs. ${(order.discount || 0).toLocaleString()}`);
    $('#modal-summary-delivery').text(`Rs. ${(order.deliveryFee || 0).toLocaleString()}`);
    $('#modal-summary-total').text(`Rs. ${(order.total || 0).toLocaleString()}`);

    $('#details-modal').fadeIn(200);
}

// ==========================================================================
// Order Cancellation Engine (API Call)
// ==========================================================================
function openCancelModal(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;

    activeCancelOrderId = orderId;
    $('#cancel-modal-ordernum').text(order.orderNumber);
    $('#cancel-modal').fadeIn(200);
}

function cancelOrder() {
    if (!activeCancelOrderId) return;

    const token = localStorage.getItem('token');
    if (!token) {
        showToast('Please login first!', 'error');
        return;
    }

    $.ajax({
        url: `api/customer/orders/${activeCancelOrderId}/cancel`,
        type: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (response) {
            if (response.status === 200) {
                showToast(response.message || 'Order cancelled successfully.', 'success');
                loadOrders(); // Refresh order list from backend
            }
        },
        error: function (xhr) {
            console.error('Failed to cancel order:', xhr);
            showToast('Failed to cancel order. Please try again.', 'error');
        },
        complete: function () {
            $('#cancel-modal').fadeOut(200);
            activeCancelOrderId = null;
        }
    });
}

// ==========================================================================
// Buy Again Cart Re-order Engine (API Call)
// ==========================================================================
function buyAgain(orderId) {
    const token = localStorage.getItem('token');

    if (!token) {
        showToast('Please login first!', 'info');
        return;
    }

    const order = ordersData.find(o => o.id === orderId);
    if (!order || !order.items || order.items.length === 0) {
        showToast('No items found to re-order.', 'error');
        return;
    }

    // Array of AJAX promises for each item in the order
    const requests = order.items.map(item => {
        return $.ajax({
            url: `api/customer/cart/items/${item.bookId}?quantity=${item.quantity}`,
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    });

    // Execute all add-to-cart requests concurrently
    $.when.apply($, requests)
        .done(function () {
            showToast(`Items from order ${order.orderNumber} added to cart! <a href="cart.html" style="text-decoration:underline; font-weight:bold; color:white; margin-left:8px;">View Cart</a>`, 'success');
            updateHeaderBadges();
        })
        .fail(function (xhr) {
            console.error('Failed to add items to cart:', xhr);
            showToast('Failed to add some items to your cart.', 'error');
            updateHeaderBadges();
        });
}

// ==========================================================================
// Event Listeners Binding
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

    // Mobile Menu Toggle
    $('#mobile-menu-btn').on('click', function () {
        $('#mobile-nav').slideToggle();
    });

    // Filter Controls
    $('#search-input').on('keyup', applyFiltersAndRender);
    $('#status-filter, #date-filter, #sort-filter').on('change', applyFiltersAndRender);

    $('#clear-filters-btn').on('click', function () {
        $('#search-input').val('');
        $('#status-filter').val('ALL');
        $('#date-filter').val('ALL');
        $('#sort-filter').val('NEWEST');
        applyFiltersAndRender();
    });

    // Modal Close Triggers
    $('.close-modal').on('click', function () {
        $('.modal-overlay').fadeOut(200);
    });

    $('#confirm-cancel-btn').on('click', cancelOrder);
    $('#retry-fetch-btn').on('click', loadOrders);

    // AI Assistant Listeners
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
        const txt = $('#ai-input').val().trim();
        if (txt) handleAIChatSend(txt);
    });
}

// Helper Formatting Functions
function formatDate(dateStr) {
    if (!dateStr || dateStr === '-') return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}

function formatPaymentName(method) {
    if (method === 'CREDIT_CARD') return 'Credit / Debit Card';
    if (method === 'CASH_ON_DELIVERY') return 'Cash on Delivery';
    if (method === 'BANK_TRANSFER') return 'Bank Transfer';
    return method || 'N/A';
}

function showToast(message, type = 'info') {
    const toast = $(`<div class="toast ${type}"><i class="fa-solid fa-circle-info"></i> ${message}</div>`);
    $('#toast-container').append(toast);
    setTimeout(() => {
        toast.fadeOut(300, function () { $(this).remove(); });
    }, 3500);
}

// AI Assistant Response Logic
function handleAIChatSend(userText) {
    const body = $('#ai-chat-body');
    body.append(`<div class="ai-message user-message">${userText}</div>`);
    $('#ai-input').val('');
    body.scrollTop(body[0].scrollHeight);

    setTimeout(() => {
        let response = "I can assist you with tracking orders or viewing order history!";
        const q = userText.toLowerCase();

        if (q.includes('latest order') || q.includes('where is')) {
            const latest = ordersData[0];
            if (latest) {
                response = `Your latest order is ${latest.orderNumber} (${latest.status}).`;
            }
        } else if (q.includes('arrive') || q.includes('when')) {
            response = "Delivery typically takes 2–5 business days for standard shipping and 1–2 days for express.";
        } else if (q.includes('recent')) {
            response = `You have ${ordersData.length} total orders registered in your account history.`;
        }

        body.append(`<div class="ai-message bot-message">${response}</div>`);
        body.scrollTop(body[0].scrollHeight);
    }, 450);
}