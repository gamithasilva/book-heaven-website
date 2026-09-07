/**
 * BookHaven Customer Account Management Module
 * Uses jQuery for UI interactions, form validations, dynamic content rendering,
 * and localStorage state management.
 */

$(document).ready(function () {
    
    // ------------------------------------------------------------------
    // 1. Initial Authentication Guard & Setup
    // ------------------------------------------------------------------
    checkAuthentication();
    initTheme();
    loadProfileData();
    loadWishlistData();
    loadAddressesData();
    loadRecentOrdersData();
    updateBadges();

    // ------------------------------------------------------------------
    // 2. Navigation & Sidebar Tabs Logic
    // ------------------------------------------------------------------
    $('.sidebar-menu .menu-item[data-section]').on('click', function (e) {
        e.preventDefault();
        const targetSection = $(this).data('section');

        $('.sidebar-menu .menu-item').removeClass('active');
        $(this).addClass('active');

        $('.tab-content').removeClass('active');
        $('#' + targetSection).addClass('active');
    });

    // ------------------------------------------------------------------
    // 3. Dark/Light Theme Switcher
    // ------------------------------------------------------------------
    $('#theme-toggle').on('click', function () {
        const currentTheme = $('html').attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        $('html').attr('data-theme', newTheme);
        localStorage.setItem('bh_theme', newTheme);
        $(this).find('i').toggleClass('fa-moon fa-sun');
    });

    function initTheme() {
        const savedTheme = localStorage.getItem('bh_theme') || 'light';
        $('html').attr('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            $('#theme-toggle i').removeClass('fa-moon').addClass('fa-sun');
        }
    }

    // ------------------------------------------------------------------
    // 4. Personal Information Management & Inline Validation
    // ------------------------------------------------------------------
    $('#btn-edit-profile').on('click', function () {
        $('#form-profile input').prop('disabled', false);
        $('#profile-form-actions').removeClass('hidden');
        $(this).hide();
    });

    $('#btn-cancel-profile').on('click', function () {
        loadProfileData();
        disableProfileForm();
    });

    $('#form-profile').on('submit', function (e) {
        e.preventDefault();
        if (validateProfileForm()) {
            const updatedProfile = {
                firstName: $('#firstName').val().trim(),
                lastName: $('#lastName').val().trim(),
                email: $('#email').val().trim(),
                phone: $('#phone').val().trim()
            };

            // Future REST API integration spot: API.updateProfile(updatedProfile)
            localStorage.setItem('bh_user_profile', JSON.stringify(updatedProfile));
            
            showToast('Profile updated successfully.');
            $('#welcome-first-name').text(updatedProfile.firstName);
            $('#sidebar-user-name').text(`${updatedProfile.firstName} ${updatedProfile.lastName}`);
            $('#sidebar-user-email').text(updatedProfile.email);
            disableProfileForm();
        }
    });

    function disableProfileForm() {
        $('#form-profile input').prop('disabled', true);
        $('.form-group').removeClass('has-error');
        $('#profile-form-actions').addClass('hidden');
        $('#btn-edit-profile').show();
    }

    function validateProfileForm() {
        let isValid = true;
        
        const firstName = $('#firstName').val().trim();
        const lastName = $('#lastName').val().trim();
        const email = $('#email').val().trim();
        const phone = $('#phone').val().trim();

        $('.form-group').removeClass('has-error');

        if (!firstName) {
            showInputError('#firstName', 'First name is required');
            isValid = false;
        }
        if (!lastName) {
            showInputError('#lastName', 'Last name is required');
            isValid = false;
        }
        if (!email || !validateEmail(email)) {
            showInputError('#email', 'Please enter a valid email address');
            isValid = false;
        }
        if (!phone || !validatePhone(phone)) {
            showInputError('#phone', 'Please enter a valid Sri Lankan mobile number');
            isValid = false;
        }

        return isValid;
    }

    // ------------------------------------------------------------------
    // 5. Avatar / Profile Picture Handler
    // ------------------------------------------------------------------
    $('#btn-trigger-upload').on('click', function () {
        $('#avatar-input').click();
    });

    $('#avatar-input').on('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showToast('File size exceeds 2MB limit.', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = function (evt) {
                const imgData = evt.target.result;
                $('#sidebar-avatar').attr('src', imgData);
                localStorage.setItem('bh_user_avatar', imgData);
                showToast('Profile photo updated.');
            };
            reader.readAsDataURL(file);
        }
    });

    // ------------------------------------------------------------------
    // 6. Saved Addresses & Modal Handling
    // ------------------------------------------------------------------
    $('#btn-add-address').on('click', function () {
        $('#form-address')[0].reset();
        $('#addressId').val('');
        $('#address-modal-title').text('Add New Address');
        openModal('#address-modal');
    });

    $(document).on('click', '.btn-edit-address', function () {
        const id = $(this).data('id');
        const addresses = getStoredAddresses();
        const item = addresses.find(a => a.id === id);
        if (item) {
            $('#addressId').val(item.id);
            $('#addrLabel').val(item.label);
            $('#recipientName').val(item.recipientName);
            $('#addrPhone').val(item.phone);
            $('#addrLine1').val(item.line1);
            $('#addrLine2').val(item.line2);
            $('#addrCity').val(item.city);
            $('#addrPostal').val(item.postalCode);
            $('#addrCountry').val(item.country);
            $('#isDefaultAddr').prop('checked', item.isDefault);
            $('#address-modal-title').text('Edit Address');
            openModal('#address-modal');
        }
    });

    $('#form-address').on('submit', function (e) {
        e.preventDefault();
        let addresses = getStoredAddresses();
        const id = $('#addressId').val();
        const isDefault = $('#isDefaultAddr').is(':checked');

        if (isDefault) {
            addresses.forEach(a => a.isDefault = false);
        }

        const addressData = {
            id: id ? parseInt(id) : Date.now(),
            label: $('#addrLabel').val().trim(),
            recipientName: $('#recipientName').val().trim(),
            phone: $('#addrPhone').val().trim(),
            line1: $('#addrLine1').val().trim(),
            line2: $('#addrLine2').val().trim(),
            city: $('#addrCity').val().trim(),
            postalCode: $('#addrPostal').val().trim(),
            country: $('#addrCountry').val().trim(),
            isDefault: isDefault
        };

        if (id) {
            const index = addresses.findIndex(a => a.id === parseInt(id));
            addresses[index] = addressData;
        } else {
            addresses.push(addressData);
        }

        localStorage.setItem('bh_addresses', JSON.stringify(addresses));
        closeModal('#address-modal');
        loadAddressesData();
        showToast('Address saved successfully.');
    });

    $(document).on('click', '.btn-delete-address', function () {
        const id = $(this).data('id');
        $('#confirm-modal-title').text('Delete Address');
        $('#confirm-modal-message').text('Are you sure you want to delete this address?');
        openModal('#confirm-modal');

        $('#btn-confirm-yes').off('click').on('click', function () {
            let addresses = getStoredAddresses();
            addresses = addresses.filter(a => a.id !== id);
            localStorage.setItem('bh_addresses', JSON.stringify(addresses));
            closeModal('#confirm-modal');
            loadAddressesData();
            showToast('Address deleted successfully.');
        });
    });

    // ------------------------------------------------------------------
    // 7. Wishlist Operations
    // ------------------------------------------------------------------
    $(document).on('click', '.btn-add-cart', function () {
        const bookId = $(this).data('id');
        let cart = JSON.parse(localStorage.getItem('bh_cart') || '[]');
        cart.push(bookId);
        localStorage.setItem('bh_cart', JSON.stringify(cart));
        updateBadges();
        showToast('Book added to cart successfully.');
    });

    $(document).on('click', '.btn-remove-wishlist', function () {
        const bookId = $(this).data('id');
        let wishlist = getStoredWishlist();
        wishlist = wishlist.filter(b => b.id !== bookId);
        localStorage.setItem('bh_wishlist', JSON.stringify(wishlist));
        loadWishlistData();
        updateBadges();
        showToast('Item removed from wishlist.');
    });

    // ------------------------------------------------------------------
    // 8. Password Change & Security Options
    // ------------------------------------------------------------------
    $('.btn-toggle-password').on('click', function () {
        const input = $(this).siblings('input');
        const type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
        $(this).find('i').toggleClass('fa-eye fa-eye-slash');
    });

    $('#newPassword').on('keyup', function () {
        const val = $(this).val();
        let strength = 0;
        if (val.length >= 6) strength += 33;
        if (val.match(/[A-Z]/) && val.match(/[0-9]/)) strength += 33;
        if (val.match(/[$@#&!]/)) strength += 34;

        const bar = $('#strength-bar');
        const txt = $('#strength-text');

        if (strength <= 33) {
            bar.css({ 'width': '33%', 'background-color': '#ef4444' });
            txt.text('Weak password');
        } else if (strength <= 66) {
            bar.css({ 'width': '66%', 'background-color': '#f59e0b' });
            txt.text('Medium password');
        } else {
            bar.css({ 'width': '100%', 'background-color': '#10b981' });
            txt.text('Strong password');
        }
    });

    $('#form-change-password').on('submit', function (e) {
        e.preventDefault();
        const curr = $('#currentPassword').val();
        const newP = $('#newPassword').val();
        const conf = $('#confirmPassword').val();

        $('.form-group').removeClass('has-error');

        if (!curr) { showInputError('#currentPassword', 'Current password required'); return; }
        if (!newP) { showInputError('#newPassword', 'New password required'); return; }
        if (newP !== conf) { showInputError('#confirmPassword', 'Passwords do not match'); return; }

        // Future REST API Integration Placeholder: API.updatePassword(curr, newP)
        showToast('Password changed successfully.');
        this.reset();
        $('#strength-bar').css('width', '0%');
        $('#strength-text').text('Password strength');
    });

    $('#btn-enable-2fa').on('click', function () {
        showToast('Two-Factor Authentication configuration modal triggered (Placeholder).');
    });

    // ------------------------------------------------------------------
    // 9. Notification Preference Switches
    // ------------------------------------------------------------------
    $('.toggle-item input[type="checkbox"]').on('change', function () {
        const prefs = {
            orderUpdates: $('#pref-order-updates').is(':checked'),
            deliveryNotif: $('#pref-delivery-notif').is(':checked'),
            newBooks: $('#pref-new-books').is(':checked'),
            offers: $('#pref-offers').is(':checked'),
            aiRecom: $('#pref-ai-recom').is(':checked')
        };
        localStorage.setItem('bh_notification_prefs', JSON.stringify(prefs));
        showToast('Preferences updated.');
    });

    // ------------------------------------------------------------------
    // 10. Logout Handling
    // ------------------------------------------------------------------
    $('#btn-logout').on('click', function () {
        $('#confirm-modal-title').text('Logout Confirmation');
        $('#confirm-modal-message').text('Are you sure you want to logout?');
        openModal('#confirm-modal');

        $('#btn-confirm-yes').off('click').on('click', function () {
            localStorage.removeItem('bh_jwt_token');
            localStorage.removeItem('bh_auth');
            window.location.href = 'login.html';
        });
    });

    // ------------------------------------------------------------------
    // 11. BookHaven AI Widget Assistant
    // ------------------------------------------------------------------
    $('#ai-toggle-btn').on('click', function () {
        $('#ai-chat-window').toggleClass('hidden');
    });

    $('#ai-close-btn').on('click', function () {
        $('#ai-chat-window').addClass('hidden');
    });

    $('.ai-chip').on('click', function () {
        const text = $(this).text();
        sendAiMessage(text);
    });

    $('#ai-send-btn').on('click', function () {
        const input = $('#ai-input-field');
        const text = input.val().trim();
        if (text) {
            sendAiMessage(text);
            input.val('');
        }
    });

    function sendAiMessage(message) {
        $('#ai-chat-body').append(`<div class="ai-msg ai-msg-user">${message}</div>`);
        scrollToAiBottom();

        // Simulate AI Bot Processing (Prepared for POST /api/v1/ai/chat)
        setTimeout(() => {
            let response = "I'm happy to assist you with that! Browse our popular catalog for recommendations.";
            if (message.includes('purchased')) {
                response = "You have purchased 24 books so far, including 'Clean Code' and 'Atomic Habits'.";
            } else if (message.includes('3000')) {
                response = "Here are top books under Rs. 3000: 'The Hobbit' (Rs. 2,200) and 'The Psychology of Money' (Rs. 2,850).";
            }
            $('#ai-chat-body').append(`<div class="ai-msg ai-msg-bot">${response}</div>`);
            scrollToAiBottom();
        }, 700);
    }

    function scrollToAiBottom() {
        const body = document.getElementById('ai-chat-body');
        body.scrollTop = body.scrollHeight;
    }

    // Modal close helpers
    $('.close-modal').on('click', function () {
        $('.modal').removeClass('active');
    });

});

// ==========================================================================
// Helper & Rendering Data Functions
// ==========================================================================

function checkAuthentication() {
    const token = localStorage.getItem('bh_jwt_token');
    const auth = localStorage.getItem('bh_auth');
    // Defaulting demo login if not set for frictionless UI testing
    if (!token && !auth) {
        localStorage.setItem('bh_auth', 'true');
    }
}

function loadProfileData() {
    const defaultData = { firstName: 'Kaveesha', lastName: 'Silva', email: 'kaveesha@example.com', phone: '0771234567' };
    const user = JSON.parse(localStorage.getItem('bh_user_profile')) || defaultData;

    $('#firstName').val(user.firstName);
    $('#lastName').val(user.lastName);
    $('#email').val(user.email);
    $('#phone').val(user.phone);

    $('#welcome-first-name').text(user.firstName);
    $('#sidebar-user-name').text(`${user.firstName} ${user.lastName}`);
    $('#sidebar-user-email').text(user.email);

    const savedAvatar = localStorage.getItem('bh_user_avatar');
    if (savedAvatar) {
        $('#sidebar-avatar').attr('src', savedAvatar);
    }

    $('#stat-total-orders').text('12');
    $('#stat-books-purchased').text('24');
}

function loadWishlistData() {
    const wishlist = getStoredWishlist();
    $('#stat-wishlist-count').text(wishlist.length);

    const container = $('#wishlist-grid');
    container.empty();

    if (wishlist.length === 0) {
        container.html('<p class="text-muted">Your wishlist is empty.</p>');
        return;
    }

    wishlist.forEach(item => {
        const card = `
            <div class="wishlist-card">
                <div>
                    <img src="${item.cover}" alt="${item.title}">
                    <h4>${item.title}</h4>
                    <p class="author">By ${item.author}</p>
                    <div class="rating"><i class="fa-solid fa-star"></i> ${item.rating}</div>
                    <div class="price-tag">Rs. ${item.price.toLocaleString()}</div>
                    <div class="stock-status ${item.inStock ? 'stock-in' : 'stock-out'}">
                        ${item.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                </div>
                <div class="wishlist-actions">
                    <button class="btn btn-primary btn-add-cart" data-id="${item.id}"><i class="fa-solid fa-cart-shopping"></i> Add to Cart</button>
                    <button class="btn btn-outline btn-remove-wishlist" data-id="${item.id}"><i class="fa-solid fa-trash"></i> Remove</button>
                </div>
            </div>
        `;
        container.append(card);
    });
}

function getStoredWishlist() {
    const defaultWishlist = [
        { id: 101, title: 'The Hobbit', author: 'J.R.R. Tolkien', rating: 4.8, price: 2200, inStock: true, cover: 'https://images.unsplash.com/photo-1629992101753-56d196c8aced?auto=format&fit=crop&q=80&w=300' },
        { id: 102, title: 'Atomic Habits', author: 'James Clear', rating: 4.9, price: 3400, inStock: true, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300' },
        { id: 103, title: 'The Psychology of Money', author: 'Morgan Housel', rating: 4.7, price: 2850, inStock: true, cover: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=300' },
        { id: 104, title: 'Clean Code', author: 'Robert C. Martin', rating: 4.8, price: 4500, inStock: false, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300' }
    ];
    return JSON.parse(localStorage.getItem('bh_wishlist')) || defaultWishlist;
}

function loadAddressesData() {
    const addresses = getStoredAddresses();
    const container = $('#addresses-grid');
    container.empty();

    addresses.forEach(item => {
        const card = `
            <div class="address-card ${item.isDefault ? 'default-border' : ''}">
                <div class="address-header">
                    <strong>${item.label}</strong>
                    ${item.isDefault ? '<span class="badge-role">Default</span>' : ''}
                </div>
                <p><strong>${item.recipientName}</strong></p>
                <p>${item.line1}${item.line2 ? ', ' + item.line2 : ''}</p>
                <p>${item.city}, ${item.postalCode}</p>
                <p>${item.country}</p>
                <p>${item.phone}</p>
                <div class="address-actions">
                    <button class="btn-outline-sm btn-edit-address" data-id="${item.id}">Edit</button>
                    <button class="btn-outline-sm btn-delete-address" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `;
        container.append(card);
    });
}

function getStoredAddresses() {
    const defaultAddresses = [
        { id: 1, label: 'Home', recipientName: 'Kaveesha Silva', phone: '0771234567', line1: '25 Main Street', line2: '', city: 'Colombo 01', postalCode: '00100', country: 'Sri Lanka', isDefault: true }
    ];
    return JSON.parse(localStorage.getItem('bh_addresses')) || defaultAddresses;
}

function loadRecentOrdersData() {
    const recentOrders = [
        { id: 'BH-2026-00125', date: 'August 20, 2026', amount: 'Rs. 9,850', status: 'SHIPPED' },
        { id: 'BH-2026-00089', date: 'July 14, 2026', amount: 'Rs. 4,200', status: 'DELIVERED' },
        { id: 'BH-2026-00012', date: 'May 02, 2026', amount: 'Rs. 6,100', status: 'DELIVERED' }
    ];

    const tbody = $('#recent-orders-list');
    tbody.empty();

    recentOrders.forEach(o => {
        tbody.append(`
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.date}</td>
                <td>${o.amount}</td>
                <td><span class="badge-success">${o.status}</span></td>
            </tr>
        `);
    });
}

function updateBadges() {
    const wishlist = getStoredWishlist();
    const cart = JSON.parse(localStorage.getItem('bh_cart') || '[]');
    $('#nav-wishlist-badge').text(wishlist.length);
    $('#nav-cart-badge').text(cart.length);
}

function showToast(message, type = 'success') {
    const toast = $(`<div class="toast"><i class="fa-solid fa-circle-info"></i> ${message}</div>`);
    $('#toast-container').append(toast);
    setTimeout(() => {
        toast.fadeOut(400, function () { $(this).remove(); });
    }, 3000);
}

function openModal(selector) { $(selector).addClass('active'); }
function closeModal(selector) { $(selector).removeClass('active'); }

function showInputError(selector, msg) {
    const group = $(selector).closest('.form-group');
    group.addClass('has-error');
    group.find('.error-message').text(msg);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^0\d{9}$/.test(phone);
}

/* ==========================================================================
   Future Backend Spring Boot API Abstraction Layer
   ========================================================================== */
const API = {
    baseUrl: '/api/v1',
    getAuthHeader() {
        return { 'Authorization': 'Bearer ' + localStorage.getItem('bh_jwt_token') };
    },
    async getProfile() { return $.ajax({ url: `${this.baseUrl}/users/me`, headers: this.getAuthHeader() }); },
    async updateProfile(data) { return $.ajax({ url: `${this.baseUrl}/users/me`, method: 'PUT', headers: this.getAuthHeader(), contentType: 'application/json', data: JSON.stringify(data) }); },
    async updatePassword(currentPassword, newPassword) { return $.ajax({ url: `${this.baseUrl}/users/me/password`, method: 'PATCH', headers: this.getAuthHeader(), contentType: 'application/json', data: JSON.stringify({ currentPassword, newPassword }) }); },
    async getAddresses() { return $.ajax({ url: `${this.baseUrl}/addresses`, headers: this.getAuthHeader() }); },
    async addAddress(data) { return $.ajax({ url: `${this.baseUrl}/addresses`, method: 'POST', headers: this.getAuthHeader(), contentType: 'application/json', data: JSON.stringify(data) }); },
    async getWishlist() { return $.ajax({ url: `${this.baseUrl}/wishlist`, headers: this.getAuthHeader() }); },
    async postAiChat(message) { return $.ajax({ url: `${this.baseUrl}/ai/chat`, method: 'POST', headers: this.getAuthHeader(), contentType: 'application/json', data: JSON.stringify({ message }) }); }
};