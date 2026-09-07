/**
 * BookHaven Manager Login Module
 * Provides form validation, UI state handling, dark/light theme switching,
 * modal dialogs, toast notifications, and preparation for REST API JWT authentication.
 */

$(document).ready(function () {

    // ------------------------------------------------------------------
    // 1. Theme Initialization & Toggle Logic
    // ------------------------------------------------------------------
    initTheme();

    $('#theme-toggle').on('click', function () {
        const currentTheme = $('html').attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        $('html').attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleIcon(newTheme);
    });

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        $('html').attr('data-theme', savedTheme);
        updateThemeToggleIcon(savedTheme);
    }

    function updateThemeToggleIcon(theme) {
        const icon = $('#theme-toggle').find('i');
        if (theme === 'dark') {
            icon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            icon.removeClass('fa-sun').addClass('fa-moon');
        }
    }

    // ------------------------------------------------------------------
    // 2. Password Visibility Toggle
    // ------------------------------------------------------------------
    $('#toggle-password').on('click', function () {
        const passwordInput = $('#password');
        const icon = $('#password-toggle-icon');
        const type = passwordInput.attr('type') === 'password' ? 'text' : 'password';
        
        passwordInput.attr('type', type);
        icon.toggleClass('fa-eye fa-eye-slash');
    });

    // Clear inline error formatting on input
    $('#email, #password').on('input', function () {
        $(this).closest('.form-group').removeClass('has-error');
        $('#global-error').addClass('hidden');
    });

    // ------------------------------------------------------------------
    // 3. Form Validation & Submission Handler
    // ------------------------------------------------------------------
    $('#manager-login-form').on('submit', function (e) {
        e.preventDefault();

        const email = $('#email').val().trim();
        const password = $('#password').val();
        const rememberMe = $('#remember-me').is(':checked');

        // Reset errors
        $('.form-group').removeClass('has-error');
        $('#global-error').addClass('hidden');

        let isValid = true;

        // Email validation rules
        if (!email) {
            showFieldError('#email', '#email-error', 'Please enter your email address.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('#email', '#email-error', 'Please enter a valid email address format.');
            isValid = false;
        }

        // Password validation rules
        if (!password) {
            showFieldError('#password', '#password-error', 'Please enter your password.');
            isValid = false;
        } else if (password.length < 6) {
            showFieldError('#password', '#password-error', 'Password must be at least 6 characters.');
            isValid = false;
        }

        if (!isValid) return;

        // Enter Loading State
        setLoadingState(true);

        // API Endpoint Payload Structure
        const loginPayload = {
            email: email,
            password: password
        };

        /* ==================================================================
           FUTURE SPRING BOOT REST BACKEND INTEGRATION
           Endpoint: POST /api/v1/auth/manager/login
           ================================================================== */
        const USE_BACKEND_API = false; // Toggle when backend is live

        if (USE_BACKEND_API) {
            $.ajax({
                url: '/api/v1/auth/manager/login',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(loginPayload),
                success: function (response) {
                    setLoadingState(false);
                    // Store JWT Authentication token
                    localStorage.setItem('token', response.token);
                    if (rememberMe) {
                        localStorage.setItem('remembered_manager_email', email);
                    }
                    showToast('Login successful. Welcome to the Manager Portal.', 'success');
                    setTimeout(() => {
                        window.location.href = '../manager/dashboard.html';
                    }, 1200);
                },
                error: function (xhr) {
                    setLoadingState(false);
                    if (xhr.status === 401) {
                        showGlobalError('Invalid manager credentials.');
                    } else if (xhr.status === 403) {
                        showGlobalError('Access denied. Account lacks Manager privileges.');
                    } else {
                        showGlobalError('Unable to connect to the server.');
                    }
                }
            });
        } else {
            // DEMO SIMULATION FLOW (For testing without backend)
            setTimeout(() => {
                setLoadingState(false);

                // Demo Credential Check
                if (email === 'manager@bookhaven.com' && password === 'password') {
                    // Demo Successful JWT Storage Simulation
                    const fakeJwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYW5hZ2VyQGJvb2toYXZlbi5jb20iLCJyb2xlIjoiUk9MRV9NQU5BR0VSIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
                    localStorage.setItem('token', fakeJwtToken);

                    showToast('Login successful. Welcome to the Manager Portal.', 'success');
                    setTimeout(() => {
                        window.location.href = '../manager/dashboard.html';
                    }, 1200);
                } else {
                    showGlobalError('Invalid manager credentials.');
                    showToast('Authentication failed.', 'error');
                }
            }, 1000);
        }
    });

    // ------------------------------------------------------------------
    // 4. Forgot Password Modal Handler
    // ------------------------------------------------------------------
    $('#forgot-password-link').on('click', function (e) {
        e.preventDefault();
        $('#forgot-password-modal').removeClass('hidden');
    });

    $('#modal-close, #modal-ok-btn').on('click', function () {
        $('#forgot-password-modal').addClass('hidden');
    });

    // Close modal when clicking background overlay
    $('#forgot-password-modal').on('click', function (e) {
        if ($(e.target).hasClass('modal-overlay')) {
            $(this).addClass('hidden');
        }
    });

    // ------------------------------------------------------------------
    // 5. Helper & UI Utility Functions
    // ------------------------------------------------------------------
    function showFieldError(inputSel, errorSel, message) {
        $(inputSel).closest('.form-group').addClass('has-error');
        $(errorSel).text(message);
    }

    function showGlobalError(message) {
        $('#global-error-text').text(message);
        $('#global-error').removeClass('hidden');
    }

    function setLoadingState(isLoading) {
        const btn = $('#btn-submit');
        if (isLoading) {
            btn.prop('disabled', true);
            btn.find('.btn-text').addClass('hidden');
            btn.find('.btn-spinner').removeClass('hidden');
        } else {
            btn.prop('disabled', false);
            btn.find('.btn-text').removeClass('hidden');
            btn.find('.btn-spinner').addClass('hidden');
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showToast(message, type = 'success') {
        const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
        const toast = $(`
            <div class="toast toast-${type}">
                <i class="fa-solid ${iconClass}"></i>
                <span>${message}</span>
            </div>
        `);

        $('#toast-container').append(toast);

        setTimeout(() => {
            toast.fadeOut(300, function () {
                $(this).remove();
            });
        }, 3000);
    }

});