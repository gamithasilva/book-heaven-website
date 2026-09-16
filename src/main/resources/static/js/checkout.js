/**
 * BookHaven - Checkout Page Engine (API connected)
 *
 * Endpoints used
 *   GET    /api/customer/cart
 *   DELETE /api/customer/cart/clear
 *   GET    /api/v1/books/{id}                         (Buy Now mode)
 *   GET    /api/customer/addresses/customer/{customerId}
 *   POST   /api/customer/addresses
 *   DELETE /api/customer/addresses/{id}
 *   PUT    /api/customer/addresses/{addressId}/default/{customerId}
 *   POST   /api/customer/orders
 *
 * All responses are CommonResponse => { status, body, message }
 */

// ==========================================================================
// Config / State
// ==========================================================================
const API = {
    CART: '/api/customer/cart',
    CART_CLEAR: '/api/customer/cart/clear',
    BOOK: (id) => `/api/v1/books/${id}`,
    ADDRESSES: '/api/customer/addresses',
    ADDRESSES_BY_CUSTOMER: (cid) => `/api/customer/addresses/customer/${cid}`,
    ADDRESS: (id) => `/api/customer/addresses/${id}`,
    ADDRESS_DEFAULT: (aid, cid) => `/api/customer/addresses/${aid}/default/${cid}`,
    ORDERS: '/api/customer/orders'
};

const PLACEHOLDER_COVER =
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600";

let state = {
    cart: [],
    addresses: [],
    selectedAddressId: null,
    customerId: null,
    deliveryMethod: 'STANDARD',      // STANDARD | EXPRESS
    paymentMethod: 'CREDIT_CARD',    // CREDIT_CARD | CASH_ON_DELIVERY | BANK_TRANSFER
    discountRate: 0,
    appliedCoupon: '',
    deliveryFee: 350,
    buyNowMode: false
};

// ==========================================================================
// Auth helpers
// ==========================================================================
function getToken() {
    return localStorage.getItem('token');
}

function authHeaders() {
    const token = getToken();
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

/** Decode the JWT payload without any external library. */
function decodeToken() {
    const token = getToken();
    if (!token || token.split('.').length !== 3) return null;
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(decodeURIComponent(
            atob(payload).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
        ));
    } catch (e) {
        return null;
    }
}

/** Customer id is needed by the address endpoints. */
function resolveCustomerId() {
    const stored = localStorage.getItem('customerId');
    if (stored) return Number(stored);

    const claims = decodeToken();
    if (claims) {
        const id = claims.customerId ?? claims.userId ?? claims.id ?? claims.uid;
        if (id !== undefined && id !== null) {
            localStorage.setItem('customerId', id);
            return Number(id);
        }
    }
    return null;
}

function requireAuth() {
    if (!getToken()) {
        showToast('Please sign in to continue to checkout.', 'danger');
        setTimeout(() => { window.location.href = 'login.html?redirect=checkout.html'; }, 1200);
        return false;
    }
    return true;
}

function apiMessage(xhr, fallback) {
    return (xhr && xhr.responseJSON && xhr.responseJSON.message) || fallback;
}

// ==========================================================================
// Initialization
// ==========================================================================
$(document).ready(function () {
    initTheme();
    setupEventListeners();

    if (!requireAuth()) return;

    state.customerId = resolveCustomerId();

    loadCheckoutData();
    loadAddresses();
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
// Cart loading
// ==========================================================================
function loadCheckoutData() {
    const params = new URLSearchParams(window.location.search);
    const buyNowId = params.get('buyNowId');
    const buyNowQty = parseInt(params.get('qty')) || 1;

    const wishlist = JSON.parse(localStorage.getItem('bookhaven_wishlist') || '[]');
    $('#wishlist-badge').text(wishlist.length);

    if (buyNowId) {
        state.buyNowMode = true;
        loadSingleBookForCheckout(buyNowId, buyNowQty);
    } else {
        loadFullCartForCheckout();
    }
}

function loadSingleBookForCheckout(bookId, quantity) {
    $.ajax({
        url: API.BOOK(bookId),
        type: 'GET',
        headers: authHeaders(),
        success: function (response) {
            const book = response && response.body;
            state.cart = book ? [normalizeCartItem({ ...book, bookId: book.id, quantity })] : [];
            updateCheckoutUI();
        },
        error: function (xhr) {
            state.cart = [];
            showToast(apiMessage(xhr, 'Could not load this book.'), 'danger');
            updateCheckoutUI();
        }
    });
}

function loadFullCartForCheckout() {
    $.ajax({
        url: API.CART,
        type: 'GET',
        headers: authHeaders(),
        success: function (response) {
            const items = (response && response.body && response.body.items) || [];
            state.cart = items.map(normalizeCartItem);
            updateCheckoutUI();
        },
        error: function (xhr) {
            if (xhr.status === 401 || xhr.status === 403) {
                requireAuth();
                return;
            }
            state.cart = [];
            showToast(apiMessage(xhr, 'Could not load your cart.'), 'danger');
            updateCheckoutUI();
        }
    });
}

/** Maps CartItemDTO (or a BookDTO in Buy Now mode) into the shape the UI uses. */
function normalizeCartItem(item) {
    return {
        id: Number(item.bookId ?? item.id),
        cartItemId: item.id,
        title: item.title,
        author: item.author,
        category: item.category || 'General',
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        stock: item.stock !== undefined ? item.stock : 10,
        coverImage: item.coverImage || PLACEHOLDER_COVER
    };
}

function updateCheckoutUI() {
    const totalCartItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    $('#cart-badge').text(totalCartItems);

    if (!state.cart.length) {
        $('#checkout-main-layout').hide();
        $('#empty-checkout-state').fadeIn(200);
    } else {
        $('#empty-checkout-state').hide();
        $('#checkout-main-layout').show();
        renderCheckoutSummary();
    }
}

// ==========================================================================
// Address Management (API backed)
// ==========================================================================
function loadAddresses() {
    if (!state.customerId) {
        showToast('Could not identify your account. Please sign in again.', 'danger');
        return;
    }

    $.ajax({
        url: API.ADDRESSES_BY_CUSTOMER(state.customerId),
        type: 'GET',
        headers: authHeaders(),
        success: function (response) {
            state.addresses = (response && response.body) || [];

            const def = state.addresses.find(a => a.isDefault);
            state.selectedAddressId = def ? def.id
                : (state.addresses.length ? state.addresses[0].id : null);

            renderAddresses();

            if (!state.addresses.length) {
                $('#new-address-form').slideDown();
            }
        },
        error: function (xhr) {
            state.addresses = [];
            renderAddresses();
            showToast(apiMessage(xhr, 'Could not load your saved addresses.'), 'danger');
        }
    });
}

function renderAddresses() {
    const grid = $('#saved-addresses-grid').empty();

    if (!state.addresses.length) {
        grid.append(`<p class="empty-hint">No saved addresses yet. Add one below.</p>`);
        return;
    }

    state.addresses.forEach(addr => {
        const isSelected = Number(addr.id) === Number(state.selectedAddressId);
        grid.append(`
            <div class="address-card ${isSelected ? 'selected' : ''}" onclick="selectAddress(${addr.id})">
                <span class="address-tag">${addr.isDefault ? 'Default' : 'Saved'}</span>
                <strong>${addr.recipientName || ''}</strong>
                <p>${addr.addressLine1 || ''}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}</p>
                <p>${addr.city || ''}, ${addr.postalCode || ''}, ${addr.country || ''}</p>
                <p class="phone">${addr.phone || ''}</p>
                <div class="address-card-actions">
                    ${addr.isDefault ? '' :
            `<button type="button" class="btn-link" onclick="event.stopPropagation(); makeDefaultAddress(${addr.id})">Set default</button>`}
                    <button type="button" class="btn-link danger" onclick="event.stopPropagation(); deleteAddress(${addr.id})">Delete</button>
                </div>
            </div>
        `);
    });
}

function selectAddress(id) {
    state.selectedAddressId = Number(id);
    renderAddresses();
}

function makeDefaultAddress(addressId) {
    $.ajax({
        url: API.ADDRESS_DEFAULT(addressId, state.customerId),
        type: 'PUT',
        headers: authHeaders(),
        success: function () {
            showToast('Default address updated', 'success');
            loadAddresses();
        },
        error: function (xhr) {
            showToast(apiMessage(xhr, 'Could not update the default address.'), 'danger');
        }
    });
}

function deleteAddress(addressId) {
    if (!confirm('Delete this address?')) return;

    $.ajax({
        url: API.ADDRESS(addressId),
        type: 'DELETE',
        headers: authHeaders(),
        success: function () {
            if (Number(state.selectedAddressId) === Number(addressId)) {
                state.selectedAddressId = null;
            }
            showToast('Address deleted', 'success');
            loadAddresses();
        },
        error: function (xhr) {
            showToast(apiMessage(xhr, 'Could not delete this address.'), 'danger');
        }
    });
}

function validateNewAddressForm() {
    let isValid = true;
    $('.form-group').removeClass('has-error');

    const fields = [
        { id: '#addr-first-name', err: '#err-first-name', name: 'First name' },
        { id: '#addr-last-name', err: '#err-last-name', name: 'Last name' },
        { id: '#addr-phone', err: '#err-phone', name: 'Phone number' },
        { id: '#addr-line1', err: '#err-line1', name: 'Address line 1' },
        { id: '#addr-city', err: '#err-city', name: 'City' },
        { id: '#addr-postal', err: '#err-postal', name: 'Postal code' },
        { id: '#addr-country', err: '#err-country', name: 'Country' }
    ];

    fields.forEach(f => {
        const val = ($(f.id).val() || '').trim();
        if (!val) {
            $(f.id).closest('.form-group').addClass('has-error');
            $(f.err).text(`${f.name} is required.`);
            isValid = false;
        }
    });

    return isValid;
}

/** Builds an AddressDTO from the form. recipientName = first + last name. */
function buildAddressPayload() {
    return {
        customerId: state.customerId,
        recipientName: `${$('#addr-first-name').val().trim()} ${$('#addr-last-name').val().trim()}`.trim(),
        addressLine1: $('#addr-line1').val().trim(),
        addressLine2: $('#addr-line2').val().trim() || null,
        city: $('#addr-city').val().trim(),
        postalCode: $('#addr-postal').val().trim(),
        country: $('#addr-country').val().trim(),
        phone: $('#addr-phone').val().trim(),
        isDefault: $('#save-address-check').is(':checked') && state.addresses.length === 0
    };
}

/**
 * Saves the address through the API.
 * onDone(addressId) runs after a successful save — used by the order flow.
 */
function saveNewAddress(onDone) {
    if (!validateNewAddressForm()) return;

    $('#save-address-btn').prop('disabled', true);

    $.ajax({
        url: API.ADDRESSES,
        type: 'POST',
        contentType: 'application/json',
        headers: authHeaders(),
        data: JSON.stringify(buildAddressPayload()),
        success: function (response) {
            const saved = response && response.body;
            $('#save-address-btn').prop('disabled', false);

            if (!saved || saved.id === undefined) {
                showToast('Address saved but no id returned.', 'danger');
                return;
            }

            state.addresses.push(saved);
            state.selectedAddressId = saved.id;
            renderAddresses();
            clearAddressForm();
            $('#new-address-form').slideUp();
            showToast('Address saved successfully', 'success');

            if (typeof onDone === 'function') onDone(saved.id);
        },
        error: function (xhr) {
            $('#save-address-btn').prop('disabled', false);
            showToast(apiMessage(xhr, 'Could not save the address.'), 'danger');
        }
    });
}

function clearAddressForm() {
    $('#addr-first-name, #addr-last-name, #addr-phone, #addr-line1, #addr-line2, #addr-city, #addr-postal, #addr-country').val('');
    $('.form-group').removeClass('has-error');
    $('#err-first-name, #err-last-name, #err-phone, #err-line1, #err-city, #err-postal, #err-country').text('');
}

// ==========================================================================
// Payment Form Validation
// ==========================================================================
function validateCardForm() {
    let isValid = true;
    $('.form-group').removeClass('has-error');

    const holder = $('#card-holder').val().trim();
    const number = $('#card-number').val().replace(/\s+/g, '');
    const expiry = $('#card-expiry').val().trim();
    const cvv = $('#card-cvv').val().trim();

    if (!holder) {
        $('#card-holder').closest('.form-group').addClass('has-error');
        $('#err-card-holder').text('Cardholder name is required.');
        isValid = false;
    }

    if (!number || number.length < 15 || !/^\d+$/.test(number)) {
        $('#card-number').closest('.form-group').addClass('has-error');
        $('#err-card-number').text('Enter a valid card number.');
        isValid = false;
    }

    if (!expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        $('#card-expiry').closest('.form-group').addClass('has-error');
        $('#err-card-expiry').text('Format MM/YY required.');
        isValid = false;
    }

    if (!cvv || cvv.length < 3 || !/^\d+$/.test(cvv)) {
        $('#card-cvv').closest('.form-group').addClass('has-error');
        $('#err-card-cvv').text('CVV 3-4 digits required.');
        isValid = false;
    }

    return isValid;
}

// ==========================================================================
// Summary Calculation
// ==========================================================================
function renderCheckoutSummary() {
    const list = $('#checkout-cart-items').empty();
    let rawSubtotal = 0;

    state.cart.forEach(item => {
        const itemSub = item.price * item.quantity;
        rawSubtotal += itemSub;

        list.append(`
            <div class="summary-item-row">
                <img src="${item.coverImage}" alt="${item.title}" class="summary-item-thumb">
                <div class="summary-item-info">
                    <div class="summary-item-title">${item.title}</div>
                    <div class="summary-item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="summary-item-price">Rs. ${itemSub.toLocaleString()}</div>
            </div>
        `);
    });

    const discountAmt = rawSubtotal * state.discountRate;

    if (rawSubtotal >= 10000) {
        $('#free-shipping-banner').show();
        $('#standard-price-label').html('<span class="text-success">FREE</span>');
        state.deliveryFee = (state.deliveryMethod === 'STANDARD') ? 0 : 750;
    } else {
        $('#free-shipping-banner').hide();
        $('#standard-price-label').text('Rs. 350');
        state.deliveryFee = (state.deliveryMethod === 'EXPRESS') ? 750 : 350;
    }

    const finalTotal = rawSubtotal - discountAmt + state.deliveryFee;

    $('#summary-subtotal').text(`Rs. ${rawSubtotal.toLocaleString()}`);

    if (state.discountRate > 0) {
        $('#applied-coupon-code').text(`(${state.appliedCoupon})`);
        $('#summary-discount').text(`-Rs. ${discountAmt.toLocaleString()}`);
        $('#discount-display-row').show();
    } else {
        $('#discount-display-row').hide();
    }

    if (state.deliveryFee === 0) {
        $('#summary-delivery').html('<span class="text-success">FREE</span>');
    } else {
        $('#summary-delivery').text(`Rs. ${state.deliveryFee.toLocaleString()}`);
    }

    $('#summary-total').text(`Rs. ${finalTotal.toLocaleString()}`);
    $('#btn-text').text(`Place Order — Rs. ${finalTotal.toLocaleString()}`);
}

function applyCoupon(code) {
    const cleanCode = code.trim().toUpperCase();

    if (cleanCode === 'BOOK10') {
        state.discountRate = 0.10;
        state.appliedCoupon = 'BOOK10';
        showCouponMessage('Discount applied successfully! (10% OFF)', 'success');
    } else if (cleanCode === 'SAVE20') {
        state.discountRate = 0.20;
        state.appliedCoupon = 'SAVE20';
        showCouponMessage('Discount applied successfully! (20% OFF)', 'success');
    } else {
        showCouponMessage('Invalid discount code.', 'error');
        return;
    }

    renderCheckoutSummary();
}

function showCouponMessage(msg, type) {
    $('#coupon-message').text(msg).attr('class', `coupon-message ${type}`);
}

// ==========================================================================
// Place Order — POST /api/customer/orders
// ==========================================================================
function processOrderPlacement() {
    if (!state.cart.length) {
        showToast('Your cart is empty', 'danger');
        return;
    }

    if (state.paymentMethod === 'CREDIT_CARD' && !validateCardForm()) {
        showToast('Please fix payment information errors.', 'danger');
        return;
    }

    // A new address must be persisted first so the API gets a real addressId.
    if ($('#new-address-form').is(':visible')) {
        saveNewAddress(function (newId) {
            submitOrder(newId);
        });
        return;
    }

    if (!state.selectedAddressId) {
        showToast('Please select or add a delivery address.', 'danger');
        return;
    }

    submitOrder(state.selectedAddressId);
}

function submitOrder(addressId) {
    const orderPayload = {
        addressId: Number(addressId),
        paymentMethod: state.paymentMethod,
        deliveryMethod: state.deliveryMethod,
        couponCode: state.appliedCoupon || null,
        notes: ($('#order-notes').val() || '').trim(),
        items: state.cart.map(item => ({
            bookId: item.id,
            quantity: item.quantity
        }))
    };

    setOrderButtonLoading(true);

    $.ajax({
        url: API.ORDERS,
        type: 'POST',
        contentType: 'application/json',
        headers: authHeaders(),
        data: JSON.stringify(orderPayload),
        success: function (response) {
            setOrderButtonLoading(false);

            const order = (response && response.body) || {};
            showConfirmation(order);

            // Only the full-cart flow clears the server cart.
            if (!state.buyNowMode) clearServerCart();

            state.cart = [];
            $('#cart-badge').text(0);
        },
        error: function (xhr) {
            setOrderButtonLoading(false);

            if (xhr.status === 401 || xhr.status === 403) {
                requireAuth();
                return;
            }
            showToast(apiMessage(xhr, 'Order could not be placed. Please try again.'), 'danger');
        }
    });
}

function showConfirmation(order) {
    const total = order.total !== undefined && order.total !== null
        ? `Rs. ${Number(order.total).toLocaleString()}`
        : $('#summary-total').text();

    $('#confirm-order-id').text(order.orderNumber || order.id || '—');
    $('#confirm-order-total').text(total);
    $('#confirm-payment-method').text(
        formatPaymentName((order.payment && order.payment.paymentMethod) || state.paymentMethod)
    );
    $('#confirm-delivery-time').text(
        state.deliveryMethod === 'EXPRESS' ? '1–2 business days' : '2–5 business days'
    );

    $('#confirmation-modal').fadeIn(200);
}

function clearServerCart() {
    $.ajax({
        url: API.CART_CLEAR,
        type: 'DELETE',
        headers: authHeaders()
    });
}

function setOrderButtonLoading(loading) {
    $('#place-order-btn').prop('disabled', loading);
    $('#btn-text').toggle(!loading);
    $('#btn-spinner').toggle(loading);
}

function formatPaymentName(method) {
    if (method === 'CREDIT_CARD') return 'Credit / Debit Card';
    if (method === 'CASH_ON_DELIVERY') return 'Cash on Delivery';
    return 'Bank Transfer';
}

function showToast(message, type = 'info') {
    const toast = $(`<div class="toast ${type}"><i class="fa-solid fa-circle-info"></i> ${message}</div>`);
    $('#toast-container').append(toast);
    setTimeout(() => {
        toast.fadeOut(300, function () { $(this).remove(); });
    }, 3000);
}

// ==========================================================================
// Event Listeners
// ==========================================================================
function setupEventListeners() {
    $('#theme-toggle').on('click', function () {
        const currentTheme = $('html').attr('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        $('html').attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    $('#mobile-menu-btn').on('click', function () {
        $('#mobile-nav').slideToggle();
    });

    $('#toggle-address-form-btn').on('click', function () {
        $('#new-address-form').slideDown();
    });

    $('#cancel-address-btn').on('click', function () {
        clearAddressForm();
        $('#new-address-form').slideUp();
    });

    $('#save-address-btn').on('click', function () {
        saveNewAddress();
    });

    $('input[name="deliveryMethod"]').on('change', function () {
        $('.delivery-options-grid .radio-option-card').removeClass('selected');
        $(this).closest('.radio-option-card').addClass('selected');
        state.deliveryMethod = $(this).val();
        renderCheckoutSummary();
    });

    $('input[name="paymentMethod"]').on('change', function () {
        $('.payment-options-list .radio-option-card').removeClass('selected');
        $(this).closest('.radio-option-card').addClass('selected');
        state.paymentMethod = $(this).val();

        $('#card-payment-fields, #cod-info-fields, #bank-info-fields').hide();
        if (state.paymentMethod === 'CREDIT_CARD') $('#card-payment-fields').show();
        if (state.paymentMethod === 'CASH_ON_DELIVERY') $('#cod-info-fields').show();
        if (state.paymentMethod === 'BANK_TRANSFER') $('#bank-info-fields').show();
    });

    $('#apply-coupon-btn').on('click', function () {
        const val = $('#coupon-code-input').val();
        if (val) applyCoupon(val);
    });

    $('#place-order-btn').on('click', function () {
        processOrderPlacement();
    });

    // AI Assistant Widget
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

// ==========================================================================
// AI Assistant Chat
// ==========================================================================
function handleAIChatSend(userText) {
    const body = $('#ai-chat-body');
    body.append(`<div class="ai-message user-message">${userText}</div>`);
    $('#ai-input').val('');
    body.scrollTop(body[0].scrollHeight);

    setTimeout(() => {
        let response = "I'm here to assist with your checkout!";
        const q = userText.toLowerCase();

        if (q.includes('payment method') || q.includes('payment')) {
            response = "We accept Credit/Debit Cards (Visa, MasterCard, Amex), Cash on Delivery, and Direct Bank Transfers.";
        } else if (q.includes('how long') || q.includes('delivery')) {
            response = "Standard delivery takes 2–5 business days. Express delivery takes 1–2 business days.";
        } else if (q.includes('total')) {
            response = `Your current order total is ${$('#summary-total').text()}.`;
        } else if (q.includes('address')) {
            response = "You can select a saved address or click '+ Add New Address' to enter a new delivery location.";
        }

        body.append(`<div class="ai-message bot-message">${response}</div>`);
        body.scrollTop(body[0].scrollHeight);
    }, 450);
}