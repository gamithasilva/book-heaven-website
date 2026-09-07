/**
 * BookHaven Manager Portal - Profile Management Module
 */

// Global Profile & Activity State
let managerProfile = {
    id: "MGR-001",
    firstName: "Manager",
    lastName: "BookHaven",
    email: "manager@bookhaven.com",
    phone: "0771234567",
    dob: "1995-05-10",
    role: "MANAGER",
    status: "ACTIVE",
    createdDate: "2026-01-10",
    lastLogin: "2026-08-24 20:42:00",
    avatar: "https://ui-avatars.com/api/?name=Manager+BookHaven&background=4f46e5&color=fff"
};

let activitySummary = {
    booksAdded: 124,
    booksUpdated: 356,
    ordersProcessed: 842,
    customersViewed: 1240
};

let recentActivities = [
    { type: "book_add", title: "Added a new book", desc: '"Clean Code"', time: "Today, 10:32 AM", icon: "fa-book" },
    { type: "order_update", title: "Updated order", desc: '"BH-2026-00125"', time: "Today, 09:45 AM", icon: "fa-box" },
    { type: "stock_update", title: "Updated book stock", desc: '"Atomic Habits"', time: "Yesterday, 04:20 PM", icon: "fa-layer-group" },
    { type: "customer_view", title: "Viewed customer", desc: '"Kaveesha Silva"', time: "Yesterday, 02:15 PM", icon: "fa-user" },
    { type: "setting_update", title: "Updated system settings", desc: "Shipping Rates", time: "Aug 22, 2026", icon: "fa-sliders" }
];

let pendingConfirmAction = null;

// ==========================================================================
// 1. Authentication & Page Initialization
// ==========================================================================
$(document.body).ready(function() {
    checkManagerAuth();
    initTheme();
    loadProfileData();
    bindEvents();
});

function checkManagerAuth() {
    const managerToken = localStorage.getItem("managerToken") || sessionStorage.getItem("managerToken");
    if (managerToken === "unauthenticated") {
        window.location.href = "manager-login.html";
    }
}

// ==========================================================================
// 2. API Preparation Wrappers (Spring Boot Mock Targets)
// ==========================================================================
function apiFetchProfile() {
    // GET /api/v1/manager/profile
    return new Promise((resolve) => resolve({ ...managerProfile }));
}

function apiUpdateProfile(payload) {
    // PUT /api/v1/manager/profile
    return new Promise((resolve) => {
        managerProfile = { ...managerProfile, ...payload };
        resolve({ success: true, profile: managerProfile });
    });
}

function apiChangePassword(payload) {
    // PUT /api/v1/manager/password
    return new Promise((resolve) => resolve({ success: true }));
}

function apiUploadProfileImage(file) {
    // POST /api/v1/manager/profile-image
    return new Promise((resolve) => resolve({ success: true }));
}

function apiLogoutAllDevices() {
    // POST /api/v1/manager/logout-all
    return new Promise((resolve) => resolve({ success: true }));
}

// ==========================================================================
// 3. Populate Profile UI Components
// ==========================================================================
function loadProfileData() {
    apiFetchProfile().then(profile => {
        // Render Header & Navigation
        updateHeaderAndAvatar(profile);

        // Populate Form Fields
        $('#firstName').val(profile.firstName);
        $('#lastName').val(profile.lastName);
        $('#email').val(profile.email);
        $('#phone').val(profile.phone);
        $('#dob').val(profile.dob);

        // Populate Account Details Card
        $('#accId').text(profile.id);
        $('#accCreated').text(formatDate(profile.createdDate));
        $('#accLastLogin').text(formatDate(profile.lastLogin));

        // Render Activity Data
        renderActivitySummary();
        renderRecentActivityTimeline();
    });
}

function updateHeaderAndAvatar(profile) {
    const fullName = `${profile.firstName} ${profile.lastName}`;
    $('#headerFullName').text(fullName);
    $('#topNavManagerName').text(profile.firstName);
    $('#headerEmail').html(`<i class="fa-solid fa-envelope"></i> ${profile.email}`);
    $('#profileHeaderAvatar').attr('src', profile.avatar);
    $('#topNavAvatar').attr('src', profile.avatar);
}

function renderActivitySummary() {
    $('#statBooksAdded').text(activitySummary.booksAdded.toLocaleString());
    $('#statBooksUpdated').text(activitySummary.booksUpdated.toLocaleString());
    $('#statOrdersProcessed').text(activitySummary.ordersProcessed.toLocaleString());
    $('#statCustomersViewed').text(activitySummary.customersViewed.toLocaleString());
}

function renderRecentActivityTimeline() {
    const $timeline = $('#activityTimeline');
    $timeline.empty();

    recentActivities.forEach(act => {
        const item = `
            <div class="timeline-item">
                <div class="timeline-icon"><i class="fa-solid ${act.icon}"></i></div>
                <div class="timeline-title">${act.title}</div>
                <div class="timeline-desc">${act.desc}</div>
                <div class="timeline-time">${act.time}</div>
            </div>
        `;
        $timeline.append(item);
    });
}

// ==========================================================================
// 4. Personal Information Editing Workflow
// ==========================================================================
function enableProfileEdit(enable) {
    $('#firstName, #lastName, #phone, #dob').prop('disabled', !enable);
    if (enable) {
        $('#personalInfoActions').removeClass('hidden');
        $('#btnEditProfile').addClass('hidden');
    } else {
        $('#personalInfoActions').addClass('hidden');
        $('#btnEditProfile').removeClass('hidden');
        clearValidationErrors();
    }
}

function saveProfileChanges(e) {
    e.preventDefault();
    clearValidationErrors();

    const firstName = $('#firstName').val().trim();
    const lastName = $('#lastName').val().trim();
    const phone = $('#phone').val().trim();
    const dob = $('#dob').val();

    let isValid = true;

    if (firstName.length < 2) {
        showFieldError('errFirstName', 'firstName', 'First Name must be at least 2 characters.');
        isValid = false;
    }

    if (lastName.length < 2) {
        showFieldError('errLastName', 'lastName', 'Last Name must be at least 2 characters.');
        isValid = false;
    }

    const phoneRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    if (phone && !phoneRegex.test(phone.replace(/\s+/g, ''))) {
        showFieldError('errPhone', 'phone', 'Please enter a valid phone number format.');
        isValid = false;
    }

    if (!isValid) return;

    const payload = { firstName, lastName, phone, dob };

    apiUpdateProfile(payload).then(() => {
        updateHeaderAndAvatar(managerProfile);
        enableProfileEdit(false);
        showToast("Profile updated successfully.", "success");
    });
}

// ==========================================================================
// 5. Change Password Mechanics & Validation
// ==========================================================================
function handlePasswordChange(e) {
    e.preventDefault();
    clearValidationErrors();

    const currentPw = $('#currentPassword').val();
    const newPw = $('#newPassword').val();
    const confirmPw = $('#confirmPassword').val();

    let isValid = true;

    if (!currentPw) {
        showFieldError('errCurrentPassword', 'currentPassword', 'Current password is required.');
        isValid = false;
    }

    // Validation: min 8 chars, uppercase, lowercase, number
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!pwRegex.test(newPw)) {
        showFieldError('errNewPassword', 'newPassword', 'Must be at least 8 characters with uppercase, lowercase & number.');
        isValid = false;
    }

    if (newPw !== confirmPw) {
        showFieldError('errConfirmPassword', 'confirmPassword', 'Passwords do not match.');
        isValid = false;
    }

    if (!isValid) return;

    apiChangePassword({ currentPw, newPw }).then(() => {
        $('#changePasswordForm')[0].reset();
        $('#strengthMeter').addClass('hidden');
        showToast("Password changed successfully.", "success");
    });
}

function calculatePasswordStrength(password) {
    const $meter = $('#strengthMeter');
    const $fill = $('#strengthFill');
    const $text = $('#strengthText');

    if (!password) {
        $meter.addClass('hidden');
        return;
    }

    $meter.removeClass('hidden');

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    $fill.removeClass('weak medium strong');

    if (score <= 2) {
        $fill.addClass('weak');
        $text.text('Weak').css('color', 'var(--color-danger)');
    } else if (score === 3) {
        $fill.addClass('medium');
        $text.text('Medium').css('color', 'var(--color-warning)');
    } else {
        $fill.addClass('strong');
        $text.text('Strong').css('color', 'var(--color-success)');
    }
}

// ==========================================================================
// 6. Profile Image Upload Handling
// ==========================================================================
function handlePhotoSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showToast("Only JPG, JPEG, PNG, and WEBP formats allowed.", "danger");
        return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
        showToast("Image size must be less than 5 MB.", "danger");
        return;
    }

    // Instant Preview Render
    const reader = new FileReader();
    reader.onload = function(evt) {
        const previewUrl = evt.target.result;
        $('#profileHeaderAvatar').attr('src', previewUrl);
        $('#topNavAvatar').attr('src', previewUrl);
        managerProfile.avatar = previewUrl;

        apiUploadProfileImage(file).then(() => {
            showToast("Profile photo updated successfully.", "success");
        });
    };
    reader.readAsDataURL(file);
}

// ==========================================================================
// 7. Event Binding & Interactivity
// ==========================================================================
function bindEvents() {
    // Profile Edit Triggers
    $('#btnEditProfile').on('click', () => enableProfileEdit(true));
    $('#btnCancelEdit').on('click', () => {
        loadProfileData(); // Reset form values
        enableProfileEdit(false);
    });
    $('#personalInfoForm').on('submit', saveProfileChanges);

    // Password Form & Realtime Strength Calculation
    $('#changePasswordForm').on('submit', handlePasswordChange);
    $('#newPassword').on('input', function() {
        calculatePasswordStrength($(this).val());
    });

    // Password Show/Hide Toggle Button
    $('.btn-toggle-pw').on('click', function(e) {
        e.preventDefault();
        const $input = $(this).siblings('input');
        const type = $input.attr('type') === 'password' ? 'text' : 'password';
        $input.attr('type', type);
        $(this).find('i').toggleClass('fa-eye fa-eye-slash');
    });

    // Photo Change Trigger
    $('#btnChangePhoto').on('click', () => $('#photoInput').click());
    $('#photoInput').on('change', handlePhotoSelect);

    // Security - Logout All Devices Trigger
    $('#btnLogoutAllDevices').on('click', function() {
        openConfirmModal(
            "Logout From All Devices",
            "Are you sure you want to sign out from all other devices?",
            () => {
                apiLogoutAllDevices().then(() => {
                    showToast("Signed out from all other devices.", "success");
                });
            }
        );
    });

    // Danger Zone - Current Session Logout
    $('#btnDangerLogout, #logoutBtn').on('click', function(e) {
        e.preventDefault();
        openConfirmModal(
            "Confirm Logout",
            "Are you sure you want to logout?",
            () => {
                localStorage.removeItem("managerToken");
                window.location.href = "manager-login.html";
            }
        );
    });

    // Confirmation Modal Execution
    $('#btnExecuteConfirm').on('click', function() {
        if (typeof pendingConfirmAction === 'function') {
            pendingConfirmAction();
        }
        $('#confirmModal').addClass('hidden');
    });

    $('#btnCloseConfirmModal, #btnCancelConfirm').on('click', function() {
        $('#confirmModal').addClass('hidden');
    });

    // Mobile Navigation & Sidebar Controls
    $('#sidebarToggle').on('click', function() {
        $('#sidebar').toggleClass('open');
        $('#sidebarOverlay').toggleClass('open');
    });

    $('#sidebarOverlay').on('click', function() {
        $('#sidebar').removeClass('open');
        $('#sidebarOverlay').removeClass('open');
    });

    // Theme Switcher Event
    $('#themeToggle').on('click', toggleTheme);

    // AI Assistant Floating Interface
    $('#aiTriggerBtn').on('click', () => $('#aiChatWindow').toggleClass('hidden'));
    $('#btnAiClose').on('click', () => $('#aiChatWindow').addClass('hidden'));
    $('#btnAiSend').on('click', () => handleAiQuery($('#aiInput').val()));
    $('#aiInput').on('keyup', function(e) {
        if (e.key === 'Enter') handleAiQuery($(this).val());
    });
    $('.suggestion-chip').on('click', function() {
        handleAiQuery($(this).data('query'));
    });
}

// ==========================================================================
// 8. AI Assistant Bot Handler (Demo)
// ==========================================================================
function handleAiQuery(queryText) {
    if (!queryText.trim()) return;

    const $chatMessages = $('#aiChatMessages');
    $chatMessages.append(`<div class="ai-msg ai-msg-user">${escapeHtml(queryText)}</div>`);
    $('#aiInput').val('');

    $chatMessages.scrollTop($chatMessages[0].scrollHeight);

    setTimeout(() => {
        let reply = "I am ready to assist with your Manager inquiries.";
        const q = queryText.toLowerCase();

        if (q.includes("today's sales")) {
            reply = "Today's total gross sales are Rs. 142,500 across 18 completed orders.";
        } else if (q.includes("pending")) {
            reply = "There are currently 6 pending orders awaiting processing.";
        } else if (q.includes("low in stock")) {
            reply = "3 titles are low in stock: 'Design Patterns', 'Refactoring', and 'Clean Code'.";
        } else if (q.includes("recent activity")) {
            reply = "Your latest action: Added new book 'Clean Code' today at 10:32 AM.";
        }

        $chatMessages.append(`<div class="ai-msg ai-msg-bot">${reply}</div>`);
        $chatMessages.scrollTop($chatMessages[0].scrollHeight);
    }, 400);
}

// ==========================================================================
// 9. Utilities & Form Validation Support
// ==========================================================================
function openConfirmModal(title, message, onConfirm) {
    $('#confirmModalTitle').text(title);
    $('#confirmModalMessage').text(message);
    pendingConfirmAction = onConfirm;
    $('#confirmModal').removeClass('hidden');
}

function showFieldError(errorSpanId, inputId, message) {
    $(`#${errorSpanId}`).text(message);
    $(`#${inputId}`).addClass('is-invalid');
}

function clearValidationErrors() {
    $('.error-msg').text('');
    $('.form-control').removeClass('is-invalid');
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    updateThemeIcon(targetTheme);
}

function updateThemeIcon(theme) {
    const $icon = $('#themeToggle i');
    if (theme === 'dark') {
        $icon.removeClass('fa-moon').addClass('fa-sun');
    } else {
        $icon.removeClass('fa-sun').addClass('fa-moon');
    }
}

function showToast(message, type = 'success') {
    const toast = `<div class="toast ${type}"><i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i> ${message}</div>`;
    const $toast = $(toast);
    $('#toastContainer').append($toast);
    setTimeout(() => {
        $toast.fadeOut(300, function() { $(this).remove(); });
    }, 3000);
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}