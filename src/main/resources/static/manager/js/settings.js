/**
 * BookHaven - Manager Settings Management Logic
 */

// 1. Core Default Configuration Blueprint
const DEFAULT_SETTINGS = {
    language: "en",
    currency: "LKR",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12H",
    timezone: "Asia/Colombo",

    theme: "system",
    sidebar: "expanded",

    notifications: {
        newOrders: true,
        orderStatus: true,
        lowStock: true,
        outOfStock: true,
        newCustomers: true,
        ai: true
    },

    inventory: {
        lowStockThreshold: 5,
        lowStockAlerts: true
    },

    dashboard: {
        period: "week",
        salesChart: true,
        recentOrders: true,
        lowStockBooks: true,
        recentCustomers: true,
        topSellingBooks: true
    },

    ai: {
        enabled: true,
        position: "bottom-right",
        suggestions: true,
        notifications: true,
        responseStyle: "balanced"
    },

    security: {
        sessionTimeout: 30
    }
};

// Global App State
let currentSettings = {};
let hasUnsavedChanges = false;
let pendingNavigationUrl = null;

$(document).ready(function() {
    checkManagerAuth();
    loadSavedSettings();
    initThemeHandling();
    populateFormValues();
    bindEventHandlers();
    setupUnsavedChangesGuard();
});

// ==========================================================================
// Authentication Verification
// ==========================================================================
function checkManagerAuth() {
    const isAuth = localStorage.getItem("bookhaven_manager_token") || sessionStorage.getItem("bookhaven_manager_token");
    // For demo purposes, if missing set a placeholder.
    if (!isAuth) {
        localStorage.setItem("bookhaven_manager_token", "demo-manager-jwt-token-active");
    }
}

// ==========================================================================
// Settings Data Persistence & Synchronization
// ==========================================================================
function loadSavedSettings() {
    const stored = localStorage.getItem("bookhaven_manager_settings");
    if (stored) {
        try {
            currentSettings = $.extend(true, {}, DEFAULT_SETTINGS, JSON.parse(stored));
        } catch (e) {
            currentSettings = $.extend(true, {}, DEFAULT_SETTINGS);
        }
    } else {
        currentSettings = $.extend(true, {}, DEFAULT_SETTINGS);
    }
}

function persistSettings(updatedSection, data) {
    if (updatedSection) {
        currentSettings[updatedSection] = $.extend(true, {}, currentSettings[updatedSection], data);
    }
    localStorage.setItem("bookhaven_manager_settings", JSON.stringify(currentSettings));
    markFormClean();
    showToast("Settings saved successfully.", "success");
    applyActivePreferences();
}

function applyActivePreferences() {
    // Theme application
    applyTheme(currentSettings.theme);
    
    // Sidebar state application
    if (currentSettings.sidebar === "collapsed") {
        $("#sidebar").addClass("collapsed");
    } else {
        $("#sidebar").removeClass("collapsed");
    }

    // AI widget configuration
    const $aiWidget = $("#aiWidget");
    if (currentSettings.ai.enabled) {
        $aiWidget.show();
    } else {
        $aiWidget.hide();
    }

    $aiWidget.removeClass("bottom-right bottom-left").addClass(currentSettings.ai.position);

    if (currentSettings.ai.suggestions) {
        $("#aiSuggestionsContainer").show();
    } else {
        $("#aiSuggestionsContainer").hide();
    }
}

// ==========================================================================
// Populate UI Controls from State
// ==========================================================================
function populateFormValues() {
    // General Form
    $("#languageSelect").val(currentSettings.language);
    $("#dateFormatSelect").val(currentSettings.dateFormat);
    $("#timeFormatSelect").val(currentSettings.timeFormat);
    $("#timezoneSelect").val(currentSettings.timezone);

    // Appearance Form
    $(`input[name="themeRadio"][value="${currentSettings.theme}"]`).prop("checked", true);
    $("#sidebarStateSelect").val(currentSettings.sidebar);

    // Notifications Form
    $("#notifNewOrders").prop("checked", currentSettings.notifications.newOrders);
    $("#notifOrderStatus").prop("checked", currentSettings.notifications.orderStatus);
    $("#notifLowStock").prop("checked", currentSettings.notifications.lowStock);
    $("#notifOutOfStock").prop("checked", currentSettings.notifications.outOfStock);
    $("#notifNewCustomers").prop("checked", currentSettings.notifications.newCustomers);
    $("#notifAi").prop("checked", currentSettings.notifications.ai);

    // Inventory Form
    $("#lowStockThresholdInput").val(currentSettings.inventory.lowStockThreshold);
    $("#enableLowStockAlerts").prop("checked", currentSettings.inventory.lowStockAlerts);

    // Dashboard Form
    $("#dashPeriodSelect").val(currentSettings.dashboard.period);
    $("#dashSalesChart").prop("checked", currentSettings.dashboard.salesChart);
    $("#dashRecentOrders").prop("checked", currentSettings.dashboard.recentOrders);
    $("#dashLowStockBooks").prop("checked", currentSettings.dashboard.lowStockBooks);
    $("#dashRecentCustomers").prop("checked", currentSettings.dashboard.recentCustomers);
    $("#dashTopSellingBooks").prop("checked", currentSettings.dashboard.topSellingBooks);

    // AI Form
    $("#aiEnabled").prop("checked", currentSettings.ai.enabled);
    $("#aiPositionSelect").val(currentSettings.ai.position);
    $("#aiSuggestions").prop("checked", currentSettings.ai.suggestions);
    $("#aiNotifications").prop("checked", currentSettings.ai.notifications);
    $("#aiStyleSelect").val(currentSettings.ai.responseStyle);

    // Security Form
    $("#sessionTimeoutSelect").val(currentSettings.security.sessionTimeout);

    applyActivePreferences();
}

// ==========================================================================
// Theme Management Engine
// ==========================================================================
function initThemeHandling() {
    applyTheme(currentSettings.theme);
}

function applyTheme(themeChoice) {
    if (themeChoice === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        $("html").attr("data-theme", prefersDark ? "dark" : "light");
    } else {
        $("html").attr("data-theme", themeChoice);
    }
    
    // Update quick toggle button icon
    const activeTheme = $("html").attr("data-theme");
    if (activeTheme === "dark") {
        $("#quickThemeToggle i").removeClass("fa-moon").addClass("fa-sun");
    } else {
        $("#quickThemeToggle i").removeClass("fa-sun").addClass("fa-moon");
    }
}

// ==========================================================================
// UI Event Listeners & Form Submissions
// ==========================================================================
function bindEventHandlers() {
    // Topbar & Sidebar Interactions
    $("#sidebarToggle").on("click", function() {
        $("#sidebar").toggleClass("collapsed mobile-open");
    });

    $("#quickThemeToggle").on("click", function() {
        const current = $("html").attr("data-theme");
        const nextTheme = current === "dark" ? "light" : "dark";
        currentSettings.theme = nextTheme;
        $(`input[name="themeRadio"][value="${nextTheme}"]`).prop("checked", true);
        persistSettings(null, {});
    });

    // Smooth Scroll Navigation Tabs
    $("#settingsNav .nav-item").on("click", function(e) {
        e.preventDefault();
        const targetSection = $(this).attr("href");
        
        $("#settingsNav .nav-item").removeClass("active");
        $(this).addClass("active");

        $("html, body").animate({
            scrollTop: $(targetSection).offset().top - 30
        }, 400);
    });

    // Track Unsaved Changes
    $("form :input").on("change input", function() {
        markFormDirty();
    });

    // Immediate Theme Feedback on Radio Select
    $('input[name="themeRadio"]').on("change", function() {
        applyTheme($(this).val());
    });

    // Save General Settings
    $("#generalForm").on("submit", function(e) {
        e.preventDefault();
        currentSettings.language = $("#languageSelect").val();
        currentSettings.dateFormat = $("#dateFormatSelect").val();
        currentSettings.timeFormat = $("#timeFormatSelect").val();
        currentSettings.timezone = $("#timezoneSelect").val();

        saveGeneralSettingsAPI(currentSettings)
            .then(() => persistSettings(null, {}))
            .catch(() => showToast("Failed to save general settings.", "danger"));
    });

    // Save Appearance Settings
    $("#appearanceForm").on("submit", function(e) {
        e.preventDefault();
        currentSettings.theme = $('input[name="themeRadio"]:checked').val();
        currentSettings.sidebar = $("#sidebarStateSelect").val();

        saveAppearanceSettingsAPI({ theme: currentSettings.theme, sidebar: currentSettings.sidebar })
            .then(() => persistSettings(null, {}))
            .catch(() => showToast("Failed to save appearance settings.", "danger"));
    });

    // Save Notification Settings
    $("#notificationsForm").on("submit", function(e) {
        e.preventDefault();
        currentSettings.notifications = {
            newOrders: $("#notifNewOrders").is(":checked"),
            orderStatus: $("#notifOrderStatus").is(":checked"),
            lowStock: $("#notifLowStock").is(":checked"),
            outOfStock: $("#notifOutOfStock").is(":checked"),
            newCustomers: $("#notifNewCustomers").is(":checked"),
            ai: $("#notifAi").is(":checked")
        };

        saveNotificationSettingsAPI(currentSettings.notifications)
            .then(() => persistSettings(null, {}))
            .catch(() => showToast("Failed to save notifications.", "danger"));
    });

    // Save Inventory Settings
    $("#inventoryForm").on("submit", function(e) {
        e.preventDefault();
        const val = parseInt($("#lowStockThresholdInput").val(), 10);

        if (isNaN(val) || val < 1 || val > 100) {
            showToast("Threshold must be a whole number between 1 and 100.", "warning");
            return;
        }

        currentSettings.inventory = {
            lowStockThreshold: val,
            lowStockAlerts: $("#enableLowStockAlerts").is(":checked")
        };

        saveInventorySettingsAPI(currentSettings.inventory)
            .then(() => persistSettings(null, {}))
            .catch(() => showToast("Failed to save inventory settings.", "danger"));
    });

    // Save Dashboard Settings
    $("#dashboardForm").on("submit", function(e) {
        e.preventDefault();
        currentSettings.dashboard = {
            period: $("#dashPeriodSelect").val(),
            salesChart: $("#dashSalesChart").is(":checked"),
            recentOrders: $("#dashRecentOrders").is(":checked"),
            lowStockBooks: $("#dashLowStockBooks").is(":checked"),
            recentCustomers: $("#dashRecentCustomers").is(":checked"),
            topSellingBooks: $("#dashTopSellingBooks").is(":checked")
        };

        saveDashboardSettingsAPI(currentSettings.dashboard)
            .then(() => persistSettings(null, {}))
            .catch(() => showToast("Failed to save dashboard preferences.", "danger"));
    });

    // Save AI Settings
    $("#aiForm").on("submit", function(e) {
        e.preventDefault();
        currentSettings.ai = {
            enabled: $("#aiEnabled").is(":checked"),
            position: $("#aiPositionSelect").val(),
            suggestions: $("#aiSuggestions").is(":checked"),
            notifications: $("#aiNotifications").is(":checked"),
            responseStyle: $("#aiStyleSelect").val()
        };

        saveAISettingsAPI(currentSettings.ai)
            .then(() => persistSettings(null, {}))
            .catch(() => showToast("Failed to save AI preferences.", "danger"));
    });

    // Save Security Options
    $("#securityForm").on("submit", function(e) {
        e.preventDefault();
        currentSettings.security.sessionTimeout = parseInt($("#sessionTimeoutSelect").val(), 10);
        persistSettings(null, {});
    });

    // Logout All Devices Action
    $("#logoutAllBtn").on("click", function() {
        showConfirmationModal(
            "Logout From All Devices",
            "Are you sure you want to sign out from all other active sessions?",
            function() {
                logoutAllDevicesAPI()
                    .then(() => showToast("Successfully logged out of all other sessions.", "success"))
                    .catch(() => showToast("Error executing session reset.", "danger"));
            }
        );
    });

    // Global Reset Settings Action
    $("#resetDefaultsBtn").on("click", function() {
        showConfirmationModal(
            "Reset All Preferences",
            "Are you sure you want to restore all settings to default values? This cannot be undone.",
            function() {
                currentSettings = $.extend(true, {}, DEFAULT_SETTINGS);
                localStorage.setItem("bookhaven_manager_settings", JSON.stringify(currentSettings));
                populateFormValues();
                markFormClean();
                showToast("Settings restored to default.", "success");
            }
        );
    });

    // Logout Trigger
    $("#logoutBtn").on("click", function(e) {
        e.preventDefault();
        showConfirmationModal(
            "Confirm Logout",
            "Are you sure you want to logout of BookHaven Portal?",
            function() {
                localStorage.removeItem("bookhaven_manager_token");
                sessionStorage.removeItem("bookhaven_manager_token");
                window.location.href = "manager-login.html";
            }
        );
    });

    // Modal Generic Listeners
    $("#modalCloseBtn, #modalCancelBtn").on("click", hideModal);

    // AI Chat UI Listeners
    initAiWidgetEvents();
}

// ==========================================================================
// Unsaved Changes Tracking Guard
// ==========================================================================
function markFormDirty() {
    hasUnsavedChanges = true;
    $("#topSaveIndicator")
        .css({ opacity: 1, color: "var(--warning)", backgroundColor: "rgba(245, 158, 11, 0.1)" })
        .html('<i class="fa-solid fa-triangle-exclamation"></i> <span>Unsaved changes</span>');
}

function markFormClean() {
    hasUnsavedChanges = false;
    $("#topSaveIndicator")
        .css({ opacity: 1, color: "var(--success)", backgroundColor: "rgba(16, 185, 129, 0.1)" })
        .html('<i class="fa-solid fa-circle-check"></i> <span>All changes saved</span>');
        
    setTimeout(() => {
        if (!hasUnsavedChanges) {
            $("#topSaveIndicator").css("opacity", 0);
        }
    }, 3000);
}

function setupUnsavedChangesGuard() {
    window.addEventListener("beforeunload", function(e) {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
            return e.returnValue;
        }
    });

    // Intercept internal link clicks
    $("a").not('[href="#"]').not('[href^="#"]').on("click", function(e) {
        if (hasUnsavedChanges) {
            e.preventDefault();
            const targetHref = $(this).attr("href");
            showConfirmationModal(
                "Unsaved Changes",
                "You have unsaved changes. Are you sure you want to leave without saving?",
                function() {
                    hasUnsavedChanges = false;
                    window.location.href = targetHref;
                }
            );
        }
    });
}

// ==========================================================================
// AI Assistant Module (Front-end Demo + API Mock)
// ==========================================================================
function initAiWidgetEvents() {
    $("#aiToggleBtn").on("click", function() {
        $("#aiChatWindow").toggleClass("hidden");
    });

    $("#aiCloseBtn").on("click", function() {
        $("#aiChatWindow").addClass("hidden");
    });

    $(".suggestion-chip").on("click", function() {
        const text = $(this).text();
        $("#aiInput").val(text);
        sendAiMessage();
    });

    $("#aiSendBtn").on("click", sendAiMessage);

    $("#aiInput").on("keypress", function(e) {
        if (e.which === 13) sendAiMessage();
    });
}

function sendAiMessage() {
    const query = $("#aiInput").val().trim();
    if (!query) return;

    appendChatMessage(query, "user");
    $("#aiInput").val("");

    sendAiChatAPI(query).then(response => {
        appendChatMessage(response.reply, "bot");
    });
}

function appendChatMessage(text, sender) {
    const icon = sender === "bot" ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>';
    const html = `
        <div class="ai-message ${sender}">
            <div class="avatar">${icon}</div>
            <div class="message-content">${text}</div>
        </div>
    `;
    $("#aiChatBody").append(html);
    $("#aiChatBody").scrollTop($("#aiChatBody")[0].scrollHeight);
}

// ==========================================================================
// UI Helpers: Modals & Toasts
// ==========================================================================
function showToast(message, type = "success") {
    const toastId = "toast_" + Date.now();
    const iconMap = {
        success: "fa-circle-check",
        warning: "fa-triangle-exclamation",
        danger: "fa-circle-xmark"
    };

    const toastHtml = `
        <div id="${toastId}" class="toast toast-${type}">
            <i class="fa-solid ${iconMap[type]}"></i>
            <span>${message}</span>
        </div>
    `;

    $("#toastContainer").append(toastHtml);

    setTimeout(() => {
        $(`#${toastId}`).fadeOut(300, function() { $(this).remove(); });
    }, 4000);
}

function showConfirmationModal(title, message, onConfirm) {
    $("#modalTitle").text(title);
    $("#modalMessage").text(message);
    $("#modalBackdrop").removeClass("hidden");
    $("#confirmModal").removeClass("hidden");

    $("#modalConfirmBtn").off("click").on("click", function() {
        hideModal();
        if (typeof onConfirm === "function") onConfirm();
    });
}

function hideModal() {
    $("#modalBackdrop").addClass("hidden");
    $("#confirmModal").addClass("hidden");
}

// ==========================================================================
// API Layer Preparation (Spring Boot REST API Stubs)
// ==========================================================================

function fetchManagerSettingsAPI() {
    // GET /api/v1/manager/settings
    return Promise.resolve(currentSettings);
}

function saveGeneralSettingsAPI(data) {
    // PUT /api/v1/manager/settings/general
    return Promise.resolve({ status: 200, message: "General settings updated." });
}

function saveAppearanceSettingsAPI(data) {
    // PUT /api/v1/manager/settings/appearance
    return Promise.resolve({ status: 200, message: "Appearance updated." });
}

function saveNotificationSettingsAPI(data) {
    // PUT /api/v1/manager/settings/notifications
    return Promise.resolve({ status: 200, message: "Notifications updated." });
}

function saveInventorySettingsAPI(data) {
    // PUT /api/v1/manager/settings/inventory
    return Promise.resolve({ status: 200, message: "Inventory settings updated." });
}

function saveDashboardSettingsAPI(data) {
    // PUT /api/v1/manager/settings/dashboard
    return Promise.resolve({ status: 200, message: "Dashboard settings updated." });
}

function saveAISettingsAPI(data) {
    // PUT /api/v1/manager/settings/ai
    return Promise.resolve({ status: 200, message: "AI settings updated." });
}

function logoutAllDevicesAPI() {
    // POST /api/v1/manager/logout-all
    return Promise.resolve({ status: 200, message: "All other sessions terminated." });
}

function sendAiChatAPI(message) {
    // MOCK POST /api/v1/ai/chat
    let reply = "I can help you monitor inventory, analyze sales, and manage store settings.";
    const lower = message.toLowerCase();

    if (lower.includes("low in stock") || lower.includes("stock")) {
        reply = "Currently, there are 4 books below your threshold (5 units): 'Madol Doova', 'The Catcher in the Rye', 'Atomic Habits', and 'Java: The Complete Reference'.";
    } else if (lower.includes("sales") || lower.includes("today")) {
        reply = "Today's total sales volume is 42,500 LKR across 14 processed orders.";
    } else if (lower.includes("pending") || lower.includes("orders")) {
        reply = "There are currently 6 pending orders awaiting manager confirmation.";
    } else if (lower.includes("best") || lower.includes("selling")) {
        reply = "The top-selling book this month is 'Atomic Habits' with 84 copies sold.";
    } else if (lower.includes("summary")) {
        reply = "BookHaven Summary: 1,240 Total Books, 14 Daily Orders, LKR 42,500 Sales Today, System Status: Optimal.";
    }

    return new Promise(resolve => {
        setTimeout(() => resolve({ reply: reply }), 500);
    });
}