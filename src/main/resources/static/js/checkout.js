/**
 * BookHaven - Checkout Page Engine
 * Handles cart loading, delivery address selection, payment validation,
 * dynamic subtotal calculations, and mock order submission.
 */

// Sample Default User Addresses
const initialAddresses = [
    {
        id: "addr_1",
        type: "Home",
        firstName: "Kaveesha",
        lastName: "Silva",
        addressLine1: "25 Main Street",
        addressLine2: "",
        city: "Colombo 01",
        postalCode: "00100",
        country: "Sri Lanka",
        phone: "0771234567"
    },
    {
        id: "addr_2",
        type: "Work",
        firstName: "Kaveesha",
        lastName: "Silva",
        addressLine1: "100 Business Road",
        addressLine2: "Floor 4",
        city: "Colombo 03",
        postalCode: "00300",
        country: "Sri Lanka",
        phone: "0771234567"
    }
];

// Checkout State
let state = {
    cart: [],
    addresses: [],
    selectedAddressId: null,
    deliveryMethod: 'STANDARD', // STANDARD or EXPRESS
    paymentMethod: 'CREDIT_CARD', // CREDIT_CARD, CASH_ON_DELIVERY, BANK_TRANSFER
    discountRate: 0,
    appliedCoupon: '',
    deliveryFee: 350
};

// ==========================================================================
// Initialization
// ==========================================================================
$(document).ready(function () {
    initTheme();
    loadCheckoutData();
    setupEventListeners();
    renderAddresses();
    renderCheckoutSummary();
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

function loadCheckoutData() {
    // Load Cart
    const storedCart = localStorage.getItem('bookhaven_cart');
    if (storedCart) {
        state.cart = JSON.parse(storedCart);
    } else {
        state.cart = [];
    }

    // Load Saved Addresses
    const storedAddresses = localStorage.getItem('bookhaven_addresses');
    if (storedAddresses) {
        state.addresses = JSON.parse(storedAddresses);
    } else {
        state.addresses = [...initialAddresses];
        localStorage.setItem('bookhaven_addresses', JSON.stringify(state.addresses));
    }

    if (state.addresses.length > 0) {
        state.selectedAddressId = state.addresses[0].id;
    }

    // Update Header Badges
    const wishlist = JSON.parse(localStorage.getItem('bookhaven_wishlist') || '[]');
    $('#wishlist-badge').text(wishlist.length);
    const totalCartItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    $('#cart-badge').text(totalCartItems);

    // Empty Cart Check
    if (state.cart.length === 0) {
        $('#checkout-main-layout').hide();
        $('#empty-checkout-state').fadeIn(200);
    }
}

// ==========================================================================
// Address Management UI Engine
// ==========================================================================
function renderAddresses() {
    const grid = $('#saved-addresses-grid').empty();

    state.addresses.forEach(addr => {
        const isSelected = addr.id === state.selectedAddressId;
        grid.append(`
            <div class="address-card ${isSelected ? 'selected' : ''}" onclick="selectAddress('${addr.id}')">
                <span class="address-tag">${addr.type}</span>
                <strong>${addr.firstName} ${addr.lastName}</strong>
                <p>${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}</p>
                <p>${addr.city}, ${addr.postalCode}, ${addr.country}</p>
                <p class="phone">${addr.phone}</p>
            </div>
        `);
    });
}

function selectAddress(id) {
    state.selectedAddressId = id;
    renderAddresses();
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
        const val = $(f.id).val().trim();
        if (!val) {
            $(f.id).closest('.form-group').addClass('has-error');
            $(f.err).text(`${f.name} is required.`);
            isValid = false;
        }
    });

    return isValid;
}

function saveNewAddress() {
    if (!validateNewAddressForm()) return;

    const newAddr = {
        id: 'addr_' + Date.now(),
        type: 'New',
        firstName: $('#addr-first-name').val().trim(),
        lastName: $('#addr-last-name').val().trim(),
        addressLine1: $('#addr-line1').val().trim(),
        addressLine2: $('#addr-line2').val().trim(),
        city: $('#addr-city').val().trim(),
        postalCode: $('#addr-postal').val().trim(),
        country: $('#addr-country').val().trim(),
        phone: $('#addr-phone').val().trim()
    };

    if ($('#save-address-check').is(':checked')) {
        state.addresses.push(newAddr);
        localStorage.setItem('bookhaven_addresses', JSON.stringify(state.addresses));
    }

    state.selectedAddressId = newAddr.id;
    renderAddresses();
    $('#new-address-form').slideUp();
    showToast('Address applied successfully', 'success');
}

// ==========================================================================
// Payment Form Engine
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
// Dynamic Summary Calculation Engine
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

    // Discount Calculation
    const discountAmt = rawSubtotal * state.discountRate;

    // Free Shipping Threshold Check (Rs. 10,000)
    if (rawSubtotal >= 10000) {
        $('#free-shipping-banner').show();
        $('#standard-price-label').html('<span class="text-success">FREE</span>');
        if (state.deliveryMethod === 'STANDARD') {
            state.deliveryFee = 0;
        } else {
            state.deliveryFee = 750;
        }
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
// Place Order Submission
// ==========================================================================
function processOrderPlacement() {
    if (state.cart.length === 0) {
        showToast('Your cart is empty', 'danger');
        return;
    }

    if (!state.selectedAddressId && $('#new-address-form').is(':hidden')) {
        showToast('Please select or add a delivery address.', 'danger');
        return;
    }

    // If New Address Form active, validate first
    if ($('#new-address-form').is(':visible')) {
        if (!validateNewAddressForm()) return;
        saveNewAddress();
    }

    // Validate Card if Card option selected
    if (state.paymentMethod === 'CREDIT_CARD') {
        if (!validateCardForm()) {
            showToast('Please fix payment information errors.', 'danger');
            return;
        }
    }

    // Prepare API Payload Contract
    const orderPayload = {
        addressId: state.selectedAddressId,
        paymentMethod: state.paymentMethod,
        deliveryMethod: state.deliveryMethod,
        couponCode: state.appliedCoupon || null,
        notes: $('#order-notes').val().trim(),
        items: state.cart.map(item => ({
            bookId: item.id,
            quantity: item.quantity
        }))
    };

    console.log("Submitting Order Payload to API Endpoint POST /api/v1/orders:", orderPayload);

    // UI Loading State
    $('#place-order-btn').prop('disabled', true);
    $('#btn-text').hide();
    $('#btn-spinner').show();

    // Simulated API Call
    setTimeout(() => {
        /* Future Spring Boot Call:
        $.ajax({
            url: '/api/v1/orders',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderPayload),
            success: function(res) { ... }
        });
        */

        const generatedOrderId = "BH-2026-" + Math.floor(10000 + Math.random() * 90000);
        const finalTotalText = $('#summary-total').text();

        $('#confirm-order-id').text(generatedOrderId);
        $('#confirm-order-total').text(finalTotalText);
        $('#confirm-payment-method').text(formatPaymentName(state.paymentMethod));
        $('#confirm-delivery-time').text(state.deliveryMethod === 'EXPRESS' ? '1–2 business days' : '2–5 business days');

        // Reset Cart Storage
        localStorage.removeItem('bookhaven_cart');
        state.cart = [];

        $('#btn-spinner').hide();
        $('#btn-text').show();
        $('#place-order-btn').prop('disabled', false);

        $('#confirmation-modal').fadeIn(200);
    }, 1200);
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

    // Mobile Navigation Toggle
    $('#mobile-menu-btn').on('click', function () {
        $('#mobile-nav').slideToggle();
    });

    // Address Form Toggle
    $('#toggle-address-form-btn').on('click', function () {
        $('#new-address-form').slideDown();
    });

    $('#cancel-address-btn').on('click', function () {
        $('#new-address-form').slideUp();
    });

    $('#save-address-btn').on('click', function () {
        saveNewAddress();
    });

    // Delivery Radio Change
    $('input[name="deliveryMethod"]').on('change', function () {
        $('.delivery-options-grid .radio-option-card').removeClass('selected');
        $(this).closest('.radio-option-card').addClass('selected');
        state.deliveryMethod = $(this).val();
        renderCheckoutSummary();
    });

    // Payment Radio Change
    $('input[name="paymentMethod"]').on('change', function () {
        $('.payment-options-list .radio-option-card').removeClass('selected');
        $(this).closest('.radio-option-card').addClass('selected');
        state.paymentMethod = $(this).val();

        // Sub-form Toggle
        $('#card-payment-fields, #cod-info-fields, #bank-info-fields').hide();
        if (state.paymentMethod === 'CREDIT_CARD') $('#card-payment-fields').show();
        if (state.paymentMethod === 'CASH_ON_DELIVERY') $('#cod-info-fields').show();
        if (state.paymentMethod === 'BANK_TRANSFER') $('#bank-info-fields').show();
    });

    // Coupon Handler
    $('#apply-coupon-btn').on('click', function () {
        const val = $('#coupon-code-input').val();
        if (val) applyCoupon(val);
    });

    // Place Order Button
    $('#place-order-btn').on('click', function () {
        processOrderPlacement();
    });

    // AI Assistant Widget Handlers
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

// AI Assistant Chat Logic
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