$(document).ready(function() {

    // --- 1. Tab Switching Functionality ---
    $('.tab-btn').on('click', function() {
        const targetFormId = $(this).data('target');

        $('.tab-btn').removeClass('active');
        $(this).addClass('active');

        $('.form-pane').removeClass('active');
        $('#' + targetFormId).addClass('active');

        clearValidationErrors();
    });

    $('#switch-to-register').on('click', function(e) {
        e.preventDefault();
        $('#tab-register').trigger('click');
    });

    $('#switch-to-login').on('click', function(e) {
        e.preventDefault();
        $('#tab-login').trigger('click');
    });

    // --- 2. Password Visibility Toggle ---
    $(document).on('click', '.toggle-password', function() {
        const $input = $(this).siblings('input');
        const $icon = $(this).find('i');

        if ($input.attr('type') === 'password') {
            $input.attr('type', 'text');
            $icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            $input.attr('type', 'password');
            $icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // --- 3. Registration Password Strength Indicator ---
    $('#reg-password').on('input', function() {
        const val = $(this).val();
        const $fill = $('#strength-bar');
        const $text = $('#strength-text');

        $fill.removeClass('weak medium strong');

        if (!val) {
            $text.text('Password strength');
            return;
        }

        let score = 0;
        if (val.length >= 6) score++;
        if (val.length >= 10) score++;
        if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        if (score <= 1) {
            $fill.addClass('weak');
            $text.text('Weak password');
        } else if (score === 2 || score === 3) {
            $fill.addClass('medium');
            $text.text('Medium strength');
        } else {
            $fill.addClass('strong');
            $text.text('Strong password');
        }
    });

    // --- 4. Dark / Light Mode Toggle ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        $('html').attr('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    $('#theme-toggle').on('click', function() {
        const currentTheme = $('html').attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        $('html').attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const $icon = $('#theme-toggle i');
        if (theme === 'dark') {
            $icon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            $icon.removeClass('fa-sun').addClass('fa-moon');
        }
    }

    // --- 5. Form Validation & Submission ---

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^[0-9+\s-]{9,15}$/.test(phone);
    }

    function showError($input, $errorEl, message) {
        $input.closest('.input-wrapper').addClass('has-error');
        $errorEl.text(message);
    }

    function clearError($input, $errorEl) {
        $input.closest('.input-wrapper').removeClass('has-error');
        $errorEl.text('');
    }

    function clearValidationErrors() {
        $('.input-wrapper').removeClass('has-error');
        $('.field-error').text('');
    }

    function showToast(message) {
        $('#toast-message').text(message);
        $('#toast').removeClass('hidden');
        setTimeout(() => {
            $('#toast').addClass('hidden');
        }, 3000);
    }

    // Login Form Validation & Action
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        const email = $('#login-email').val().trim();
        const password = $('#login-password').val();

        // Email validation
        if (!email) {
            showError($('#login-email'), $('#login-email-error'), 'Email address is required.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError($('#login-email'), $('#login-email-error'), 'Please enter a valid email format.');
            isValid = false;
        } else {
            clearError($('#login-email'), $('#login-email-error'));
        }

        // Password validation
        if (!password) {
            showError($('#login-password'), $('#login-password-error'), 'Password is required.');
            isValid = false;
        } else {
            clearError($('#login-password'), $('#login-password-error'));
        }

        if (isValid) {
            // Prepared Payload for POST /api/v1/auth/login
            const loginPayload = {
                email: email,
                password: password
            };

            $.ajax({
                url : "http://localhost:8080/api/auth/login",
                type : "POST",
                contentType: "application/json",
                data : JSON.stringify(loginPayload),

                success : function(response) {
                    console.log('Login successful:', response);
                    if(response.status === 200){
                        const user = response.body;

                        localStorage.setItem("token", user.token);
                        localStorage.setItem("userId", user.id);
                        localStorage.setItem("username", user.email);
                        localStorage.setItem("role", user.role);

                        console.log(localStorage.getItem("token"));

                        console.log('Sending login payload to /api/v1/auth/login:', loginPayload);
                        showToast('Login successful! Redirecting... ' + localStorage.getItem("token"));

                        // Demo redirect to store homepage
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);


                    }
                }
            })

        }
    });

    // Registration Form Validation & Action
    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        const firstName = $('#reg-first-name').val().trim();
        const lastName = $('#reg-last-name').val().trim();
        const email = $('#reg-email').val().trim();
        const phone = $('#reg-phone').val().trim();
        const password = $('#reg-password').val();
        const confirmPassword = $('#reg-confirm-password').val();
        const termsAccepted = $('#reg-terms').is(':checked');

        // First Name
        if (!firstName) {
            showError($('#reg-first-name'), $('#reg-first-name-error'), 'First name is required.');
            isValid = false;
        } else {
            clearError($('#reg-first-name'), $('#reg-first-name-error'));
        }

        // Last Name
        if (!lastName) {
            showError($('#reg-last-name'), $('#reg-last-name-error'), 'Last name is required.');
            isValid = false;
        } else {
            clearError($('#reg-last-name'), $('#reg-last-name-error'));
        }

        // Email
        if (!email) {
            showError($('#reg-email'), $('#reg-email-error'), 'Email address is required.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError($('#reg-email'), $('#reg-email-error'), 'Please enter a valid email.');
            isValid = false;
        } else {
            clearError($('#reg-email'), $('#reg-email-error'));
        }

        // Phone
        if (!phone) {
            showError($('#reg-phone'), $('#reg-phone-error'), 'Phone number is required.');
            isValid = false;
        } else if (!isValidPhone(phone)) {
            showError($('#reg-phone'), $('#reg-phone-error'), 'Please enter a valid phone number.');
            isValid = false;
        } else {
            clearError($('#reg-phone'), $('#reg-phone-error'));
        }

        // Password
        if (!password) {
            showError($('#reg-password'), $('#reg-password-error'), 'Password is required.');
            isValid = false;
        } else if (password.length < 6) {
            showError($('#reg-password'), $('#reg-password-error'), 'Password must be at least 6 characters.');
            isValid = false;
        } else {
            clearError($('#reg-password'), $('#reg-password-error'));
        }

        // Confirm Password
        if (!confirmPassword) {
            showError($('#reg-confirm-password'), $('#reg-confirm-password-error'), 'Please confirm password.');
            isValid = false;
        } else if (confirmPassword !== password) {
            showError($('#reg-confirm-password'), $('#reg-confirm-password-error'), 'Passwords do not match.');
            isValid = false;
        } else {
            clearError($('#reg-confirm-password'), $('#reg-confirm-password-error'));
        }

        // Terms Checkbox
        if (!termsAccepted) {
            $('#reg-terms-error').text('You must agree to the Terms & Conditions.');
            isValid = false;
        } else {
            $('#reg-terms-error').text('');
        }

        if (isValid) {
            // Prepared Payload for POST /api/v1/auth/register
            const registerPayload = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                password: password
            };

            console.log('Sending registration payload to /api/v1/auth/register:', registerPayload);

            $.ajax({
                url : "http://localhost:8080/api/auth/register",
                type : "POST",
                contentType: "application/json",
                data : JSON.stringify(registerPayload),
                success : function(response) {
                    console.log('Registration successful:', response);
                    if(response.status === 200){
                        const user = response.body;

                        localStorage.setItem("token", user.token);
                        localStorage.setItem("userId", user.id);
                        localStorage.setItem("username", user.email);
                        localStorage.setItem("role", user.role);

                        console.log(localStorage.getItem("token"));



                    }
                }
            })
            showToast('Account created successfully! Switching to login...');

            // // Transition to Login Tab on successful creation
            // setTimeout(() => {
            //     $('#tab-login').trigger('click');
            //     $('#login-email').val(email);
            // }, 1800);

            setTimeout(function () {

                window.location.href =
                    "index.html";

            }, 1000);
        }
    });

});