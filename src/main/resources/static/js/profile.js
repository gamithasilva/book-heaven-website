/**
 * BookHaven Customer Account Management Module
 * Integrated with Spring Boot CustomerController, AddressController, WishlistController & OrderController
 */

let currentCustomerId = null;

$(document).ready(function () {

    // ------------------------------------------------------------------
    // 1. Initial Authentication Guard & Setup
    // ------------------------------------------------------------------
    checkAuthentication();
    initTheme();
    loadProfileData();
    loadWishlistData();
    loadRecentOrdersData();

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

        if (targetSection === 'addresses-section') {
            loadAddressesData();
        } else if (targetSection === 'wishlist-section') {
            loadWishlistData();
        } else if (targetSection === 'orders-section') {
            loadRecentOrdersData();
        }
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
    // 4. Personal Information Management
    // ------------------------------------------------------------------
    $('#btn-edit-profile').on('click', function () {
        $('#firstName, #lastName, #phone').prop('disabled', false);
        $('#profile-form-actions').removeClass('hidden');
        $(this).hide();
    });

    $('#btn-cancel-profile').on('click', function () {
        loadProfileData();
        disableProfileForm();
    });

    $('#form-profile').on('submit', async function (e) {
        e.preventDefault();
        if (validateProfileForm()) {
            const updatedProfile = {
                id: currentCustomerId,
                firstName: $('#firstName').val().trim(),
                lastName: $('#lastName').val().trim(),
                email: $('#email').val().trim(),
                phone: $('#phone').val().trim()
            };

            try {
                const response = await API.updateProfile(updatedProfile);
                const user = response.body;

                showToast(response.message || 'Profile updated successfully.');
                updateProfileUI(user);
                disableProfileForm();
            } catch (err) {
                showToast(err.responseJSON?.message || 'Failed to update profile.', 'error');
            }
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
        if (!phone || !validatePhone(phone)) {
            showInputError('#phone', 'Please enter a valid mobile number');
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
            reader.onload = async function (evt) {
                const imageUrlString = evt.target.result;

                try {
                    const response = await API.updateAvatar(imageUrlString);
                    const updatedUser = response.body;

                    if (updatedUser && updatedUser.profileImage) {
                        $('#sidebar-avatar').attr('src', updatedUser.profileImage);
                    } else {
                        $('#sidebar-avatar').attr('src', imageUrlString);
                    }

                    showToast('Profile photo updated successfully.');
                } catch (err) {
                    showToast(err.responseJSON?.message || 'Failed to update profile photo.', 'error');
                }
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

    $(document).on('click', '.btn-edit-address', async function () {
        const id = $(this).data('id');
        try {
            const response = await API.getAddressById(id);
            const item = response.body;
            if (item) {
                $('#addressId').val(item.id);
                $('#recipientName').val(item.recipientName);
                $('#addrPhone').val(item.phone);
                $('#addrLine1').val(item.addressLine1);
                $('#addrLine2').val(item.addressLine2);
                $('#addrCity').val(item.city);
                $('#addrPostal').val(item.postalCode);
                $('#addrCountry').val(item.country);
                $('#isDefaultAddr').prop('checked', item.isDefault);
                $('#address-modal-title').text('Edit Address');
                openModal('#address-modal');
            }
        } catch (err) {
            showToast('Failed to fetch address details.', 'error');
        }
    });

    $('#form-address').on('submit', async function (e) {
        e.preventDefault();
        const id = $('#addressId').val();
        const isDefault = $('#isDefaultAddr').is(':checked');

        const addressDTO = {
            id: id ? parseInt(id) : null,
            customerId: currentCustomerId,
            recipientName: $('#recipientName').val().trim(),
            phone: $('#addrPhone').val().trim(),
            addressLine1: $('#addrLine1').val().trim(),
            addressLine2: $('#addrLine2').val().trim(),
            city: $('#addrCity').val().trim(),
            postalCode: $('#addrPostal').val().trim(),
            country: $('#addrCountry').val().trim(),
            isDefault: isDefault
        };

        try {
            let res;
            if (id) {
                res = await API.updateAddress(id, addressDTO);
            } else {
                res = await API.saveAddress(addressDTO);
            }

            if (isDefault && currentCustomerId) {
                const savedId = res.body?.id || id;
                if (savedId) {
                    await API.setDefaultAddress(savedId, currentCustomerId);
                }
            }

            closeModal('#address-modal');
            loadAddressesData();
            showToast('Address saved successfully.');
        } catch (err) {
            showToast(err.responseJSON?.message || 'Failed to save address.', 'error');
        }
    });

    $(document).on('click', '.btn-delete-address', function () {
        const id = $(this).data('id');
        $('#confirm-modal-title').text('Delete Address');
        $('#confirm-modal-message').text('Are you sure you want to delete this address?');
        openModal('#confirm-modal');

        $('#btn-confirm-yes').off('click').on('click', async function () {
            try {
                await API.deleteAddress(id);
                closeModal('#confirm-modal');
                loadAddressesData();
                showToast('Address deleted successfully.');
            } catch (err) {
                showToast(err.responseJSON?.message || 'Failed to delete address.', 'error');
            }
        });
    });

    // ------------------------------------------------------------------
    // 7. Wishlist Operations (REST API Integrated)
    // ------------------------------------------------------------------
    $(document).on('click', '.btn-add-cart', async function () {
        const bookId = $(this).data('id');
        try {
            await API.addToCart(bookId, 1);
            showToast('Book added to cart successfully.');
            updateBadges();
        } catch (err) {
            console.error('Add to cart error:', err);
            showToast('Failed to add book to cart.', 'error');
        }
    });

    $(document).on('click', '.btn-remove-wishlist', async function () {
        const bookId = $(this).data('id');
        try {
            await API.removeFromWishlist(bookId);
            showToast('Item removed from wishlist.');
            loadWishlistData();
        } catch (err) {
            console.error('Remove from wishlist error:', err);
            showToast('Failed to remove item from wishlist.', 'error');
        }
    });

    // ------------------------------------------------------------------
    // 8. Order Actions (Cancel Order Event Listener)
    // ------------------------------------------------------------------
    $(document).on('click', '.btn-cancel-order', function () {
        const orderId = $(this).data('id');
        $('#confirm-modal-title').text('Cancel Order');
        $('#confirm-modal-message').text(`Are you sure you want to cancel Order #${orderId}?`);
        openModal('#confirm-modal');

        $('#btn-confirm-yes').off('click').on('click', async function () {
            try {
                const response = await API.cancelOrder(orderId);
                closeModal('#confirm-modal');
                showToast(response.message || 'Order cancelled successfully.');
                loadRecentOrdersData();
            } catch (err) {
                showToast(err.responseJSON?.message || 'Failed to cancel order.', 'error');
            }
        });
    });

    // ------------------------------------------------------------------
    // 9. Password Change & Security Options
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

    $('#form-change-password').on('submit', async function (e) {
        e.preventDefault();
        const curr = $('#currentPassword').val();
        const newP = $('#newPassword').val();
        const conf = $('#confirmPassword').val();

        $('.form-group').removeClass('has-error');

        if (!curr) { showInputError('#currentPassword', 'Current password required'); return; }
        if (!newP) { showInputError('#newPassword', 'New password required'); return; }
        if (newP !== conf) { showInputError('#confirmPassword', 'Passwords do not match'); return; }

        try {
            await API.changePassword({
                currentPassword: curr,
                newPassword: newP,
                confirmPassword: conf
            });
            showToast('Password changed successfully.');
            this.reset();
            $('#strength-bar').css('width', '0%');
            $('#strength-text').text('Password strength');
        } catch (err) {
            showToast(err.responseJSON?.message || 'Failed to change password.', 'error');
        }
    });

    // ------------------------------------------------------------------
    // 10. Notification Preference Switches
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
    // 11. Logout Handling
    // ------------------------------------------------------------------
    $('#btn-logout, #logout-btn').on('click', function (e) {
        e.preventDefault();
        $('#confirm-modal-title').text('Logout Confirmation');
        $('#confirm-modal-message').text('Are you sure you want to logout?');
        openModal('#confirm-modal');

        $('#btn-confirm-yes').off('click').on('click', function () {
            localStorage.removeItem('token');
            localStorage.removeItem('bh_jwt_token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            window.location.href = 'login.html';
        });
    });

    // Modal close helpers
    $('.close-modal').on('click', function () {
        $('.modal').removeClass('active');
    });

});

// ==========================================================================
// API Communication Abstraction Layer (Spring Boot Back-End Integration)
// ==========================================================================
const API = {
    baseUrl: 'api',

    getAuthHeader() {
        const token = localStorage.getItem('token') || localStorage.getItem('bh_jwt_token');
        return token ? { 'Authorization': 'Bearer ' + token } : {};
    },

    // Customer Profile Operations
    async getProfile() {
        return $.ajax({
            url: `${this.baseUrl}/customer/profile`,
            method: 'GET',
            headers: this.getAuthHeader()
        });
    },

    async updateProfile(customerDTO) {
        return $.ajax({
            url: `${this.baseUrl}/customer/profile`,
            method: 'PUT',
            headers: this.getAuthHeader(),
            contentType: 'application/json',
            data: JSON.stringify(customerDTO)
        });
    },

    async updateAvatar(profileImageStringUrl) {
        return $.ajax({
            url: `${this.baseUrl}/customer/profile/avatar`,
            method: 'POST',
            headers: this.getAuthHeader(),
            contentType: 'application/json',
            data: JSON.stringify({
                profileImage: profileImageStringUrl
            })
        });
    },

    async changePassword(changePasswordDTO) {
        return $.ajax({
            url: `${this.baseUrl}/customer/change-password`,
            method: 'PUT',
            headers: this.getAuthHeader(),
            contentType: 'application/json',
            data: JSON.stringify(changePasswordDTO)
        });
    },

    // Address Operations
    async getAddressesByCustomer(customerId) {
        return $.ajax({
            url: `${this.baseUrl}/customer/addresses/customer/${customerId}`,
            method: 'GET',
            headers: this.getAuthHeader()
        });
    },

    async getAddressById(id) {
        return $.ajax({
            url: `${this.baseUrl}/customer/addresses/${id}`,
            method: 'GET',
            headers: this.getAuthHeader()
        });
    },

    async saveAddress(addressDTO) {
        return $.ajax({
            url: `${this.baseUrl}/customer/addresses`,
            method: 'POST',
            headers: this.getAuthHeader(),
            contentType: 'application/json',
            data: JSON.stringify(addressDTO)
        });
    },

    async updateAddress(id, addressDTO) {
        return $.ajax({
            url: `${this.baseUrl}/customer/addresses/${id}`,
            method: 'PUT',
            headers: this.getAuthHeader(),
            contentType: 'application/json',
            data: JSON.stringify(addressDTO)
        });
    },

    async deleteAddress(id) {
        return $.ajax({
            url: `${this.baseUrl}/customer/addresses/${id}`,
            method: 'DELETE',
            headers: this.getAuthHeader()
        });
    },

    async setDefaultAddress(addressId, customerId) {
        return $.ajax({
            url: `${this.baseUrl}/customer/addresses/${addressId}/default/${customerId}`,
            method: 'PUT',
            headers: this.getAuthHeader()
        });
    },

    // Wishlist API Operations
    async getWishlist() {
        return $.ajax({
            url: `${this.baseUrl}/v1/wishlist`,
            method: 'GET',
            headers: this.getAuthHeader()
        });
    },

    async addToWishlist(bookId) {
        return $.ajax({
            url: `${this.baseUrl}/v1/wishlist/items/${bookId}`,
            method: 'POST',
            headers: this.getAuthHeader()
        });
    },

    async removeFromWishlist(bookId) {
        return $.ajax({
            url: `${this.baseUrl}/v1/wishlist/items/${bookId}`,
            method: 'DELETE',
            headers: this.getAuthHeader()
        });
    },

    // Cart Operations
    async addToCart(bookId, quantity = 1) {
        return $.ajax({
            url: `${this.baseUrl}/customer/cart/items/${bookId}?quantity=${quantity}`,
            method: 'POST',
            headers: this.getAuthHeader()
        });
    },

    async getCart() {
        return $.ajax({
            url: `${this.baseUrl}/customer/cart`,
            method: 'GET',
            headers: this.getAuthHeader()
        });
    },

    // Order API Operations
    async createOrder(orderRequestDTO) {
        return $.ajax({
            url: `${this.baseUrl}/customer/orders`,
            method: 'POST',
            headers: this.getAuthHeader(),
            contentType: 'application/json',
            data: JSON.stringify(orderRequestDTO)
        });
    },

    async getMyOrders() {
        return $.ajax({
            url: `${this.baseUrl}/customer/orders/my-orders`,
            method: 'GET',
            headers: this.getAuthHeader()
        });
    },

    async getOrderById(id) {
        return $.ajax({
            url: `${this.baseUrl}/customer/orders/${id}`,
            method: 'GET',
            headers: this.getAuthHeader()
        });
    },

    async cancelOrder(id) {
        return $.ajax({
            url: `${this.baseUrl}/customer/orders/${id}/cancel`,
            method: 'PUT',
            headers: this.getAuthHeader()
        });
    }
};

// ==========================================================================
// Helper & Rendering Data Functions
// ==========================================================================

function checkAuthentication() {
    const token = localStorage.getItem('token') || localStorage.getItem('bh_jwt_token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

async function loadProfileData() {
    try {
        const response = await API.getProfile();
        const user = response.body;

        if (user) {
            currentCustomerId = user.id;
            updateProfileUI(user);
            loadAddressesData();
        } else {
            console.warn('User profile payload is empty.');
        }
    } catch (err) {
        console.error('Failed to load profile data:', err);
        showToast('Failed to load profile data from server.', 'error');
    }
}

function updateProfileUI(user) {
    if (!user) return;
    $('#firstName').val(user.firstName || '');
    $('#lastName').val(user.lastName || '');
    $('#email').val(user.email || '');
    $('#phone').val(user.phone || '');

    $('#welcome-first-name').text(user.firstName || '');
    $('#sidebar-user-name').text(`${user.firstName || ''} ${user.lastName || ''}`);
    $('#sidebar-user-email').text(user.email || '');

    if (user.profileImage) {
        $('#sidebar-avatar').attr('src', user.profileImage);
    }
}

async function loadAddressesData() {
    if (!currentCustomerId) return;

    try {
        const response = await API.getAddressesByCustomer(currentCustomerId);
        const addresses = response.body || [];
        const container = $('#addresses-grid');
        container.empty();

        if (addresses.length === 0) {
            container.html('<p class="text-muted">No saved addresses found.</p>');
            return;
        }

        addresses.forEach(item => {
            const card = `
                <div class="address-card ${item.isDefault ? 'default-border' : ''}">
                    <div class="address-header">
                        <strong>${item.city || 'Address'}</strong>
                        ${item.isDefault ? '<span class="badge-role">Default</span>' : ''}
                    </div>
                    <p><strong>${item.recipientName || ''}</strong></p>
                    <p>${item.addressLine1 || ''}${item.addressLine2 ? ', ' + item.addressLine2 : ''}</p>
                    <p>${item.city || ''}, ${item.postalCode || ''}</p>
                    <p>${item.country || ''}</p>
                    <p>${item.phone || ''}</p>
                    <div class="address-actions">
                        <button class="btn-outline-sm btn-edit-address" data-id="${item.id}">Edit</button>
                        <button class="btn-outline-sm btn-delete-address" data-id="${item.id}">Delete</button>
                    </div>
                </div>
            `;
            container.append(card);
        });
    } catch (err) {
        console.error('Failed to load addresses:', err);
        showToast('Failed to load addresses.', 'error');
    }
}

async function loadWishlistData() {
    try {
        const response = await API.getWishlist();
        const wishlistDTO = response.body || {};
        const items = wishlistDTO.wishlistItemDTOS || [];

        $('#stat-wishlist-count').text(items.length);
        $('#nav-wishlist-badge').text(items.length);

        const container = $('#wishlist-grid');
        container.empty();

        if (items.length === 0) {
            container.html('<p class="text-muted">Your wishlist is empty.</p>');
            return;
        }

        items.forEach(item => {
            const price = item.price ? Number(item.price).toLocaleString() : '0.00';
            const card = `
                <div class="wishlist-card">
                    <div>
                        <img src="${item.coverImage || 'images/default-book.jpg'}" alt="${item.title}">
                        <h4>${item.title || 'Untitled'}</h4>
                        <p class="author">By ${item.author || 'Unknown'}</p>
                        <div class="price-tag">Rs. ${price}</div>
                    </div>
                    <div class="wishlist-actions">
                        <button class="btn btn-primary btn-add-cart" data-id="${item.bookId}">
                            <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline btn-remove-wishlist" data-id="${item.bookId}">
                            <i class="fa-solid fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            container.append(card);
        });
    } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        $('#wishlist-grid').html('<p class="text-muted">Failed to load wishlist items.</p>');
        showToast('Failed to load wishlist items.', 'error');
    }
}

async function loadRecentOrdersData() {
    const tbody = $('#recent-orders-list');
    tbody.empty();

    try {
        const response = await API.getMyOrders();
        let orders = response.body || [];

        // Sort by ID descending to show newest first, then limit to recent 4
        orders.sort((a, b) => (b.id || 0) - (a.id || 0));
        const recentOrders = orders.slice(0, 4);

        if (recentOrders.length === 0) {
            tbody.append('<tr><td colspan="5" class="text-muted">No recent orders found.</td></tr>');
            return;
        }

        recentOrders.forEach(o => {
            const formattedDate = o.orderDate
                ? new Date(o.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                : 'N/A';

            // Matches `total` property in OrderDTO
            const rawAmount = o.total != null ? o.total : 0;
            const total = Number(rawAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            // Matches `status` property in OrderDTO
            const status = o.status || 'PENDING';
            const statusBadgeClass = getOrderStatusBadgeClass(status);

            const isCancelable = status === 'PENDING' || status === 'PROCESSING';
            const cancelBtn = isCancelable
                ? `<button class="btn-outline-sm btn-cancel-order" data-id="${o.id}" style="color: #ef4444; border-color: #ef4444; margin-left: 5px;">Cancel</button>`
                : '';

            tbody.append(`
                <tr>
                    <td><strong>${o.orderNumber || ('BH-' + o.id)}</strong></td>
                    <td>${formattedDate}</td>
                    <td>Rs. ${total}</td>
                    <td><span class="${statusBadgeClass}">${status}</span></td>
                    <td>
                        <button class="btn-outline-sm btn-view-order" data-id="${o.id}">View</button>
                        ${cancelBtn}
                    </td>
                </tr>
            `);
        });
    } catch (err) {
        console.error('Failed to load order history:', err);
        tbody.append('<tr><td colspan="5" class="text-muted">Failed to load order history.</td></tr>');
        showToast('Failed to fetch recent orders.', 'error');
    }
}
function getOrderStatusBadgeClass(status) {
    switch (status.toUpperCase()) {
        case 'DELIVERED':
        case 'COMPLETED':
            return 'badge-success';
        case 'SHIPPED':
        case 'PROCESSING':
            return 'badge-info';
        case 'CANCELLED':
        case 'FAILED':
            return 'badge-danger';
        default:
            return 'badge-warning'; // PENDING / Default
    }
}

async function updateBadges() {
    try {
        const cartRes = await API.getCart();
        const cartItems = cartRes.body?.items || [];
        let totalCartQuantity = 0;
        cartItems.forEach(i => totalCartQuantity += (i.quantity || 0));
        $('#nav-cart-badge').text(totalCartQuantity);
    } catch (err) {
        console.warn('Failed to update cart badge:', err);
    }
}

function showToast(message, type = 'success') {
    const toast = $(`<div class="toast"><i class="fa-solid fa-circle-info"></i> ${message}</div>`);
    if (type === 'error') toast.css('background-color', '#ef4444');
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

function validatePhone(phone) {
    return /^[0-9+\s-]{9,15}$/.test(phone);
}