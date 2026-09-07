/**
 * BookHaven Manager Dashboard Logic
 * Coordinates statistics rendering, custom sales chart, AI chat, dropdowns,
 * theme management, and modular API endpoint preparation.
 */

$(document).ready(function () {

    // ------------------------------------------------------------------
    // 1. Authorization Guard Check (Demo Simulation)
    // ------------------------------------------------------------------
    checkAuthentication();

    function checkAuthentication() {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if no authentication token is present
            window.location.href = 'manager-login.html';
        }
    }

    // ------------------------------------------------------------------
    // 2. Theme Initialization & Control
    // ------------------------------------------------------------------
    initTheme();

    $('#theme-toggle').on('click', function () {
        const currentTheme = $('html').attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        $('html').attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
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

    // ------------------------------------------------------------------
    // 3. Navigation & Dropdown Event Listeners
    // ------------------------------------------------------------------
    $('#mobile-toggle').on('click', function () {
        $('#sidebar').toggleClass('open');
        $('#sidebar-overlay').toggleClass('active');
    });

    $('#sidebar-overlay').on('click', function () {
        $('#sidebar').removeClass('open');
        $(this).removeClass('active');
    });

    // Topbar Dropdowns Toggle
    $('#notification-btn').on('click', function (e) {
        e.stopPropagation();
        $('#profile-dropdown').removeClass('active');
        $('#notification-dropdown').toggleClass('active');
    });

    $('#profile-dropdown-btn').on('click', function (e) {
        e.stopPropagation();
        $('#notification-dropdown').removeClass('active');
        $('#profile-dropdown').toggleClass('active');
    });

    $(document).on('click', function () {
        $('.dropdown-menu').removeClass('active');
    });

    $('#mark-read-btn').on('click', function (e) {
        e.stopPropagation();
        $('#notif-badge').text('0').hide();
        $('.notif-item').removeClass('unread');
    });

    // Logout Confirmation Logic
    $('#btn-sidebar-logout, #dropdown-logout').on('click', function (e) {
        e.preventDefault();
        $('#logout-modal').removeClass('hidden');
    });

    $('#logout-cancel-btn, #logout-cancel-x').on('click', function () {
        $('#logout-modal').addClass('hidden');
    });

    $('#logout-confirm-btn').on('click', function () {
        localStorage.removeItem('token');
        window.location.href = 'manager-login.html';
    });

    // ------------------------------------------------------------------
    // 4. API Endpoints Prep & Data Fetching Execution
    // ------------------------------------------------------------------
    loadDashboardData();

    function loadDashboardData() {
        // Toggle this flag when live Spring Boot REST Endpoints are available
        const USE_LIVE_API = false;

        if (USE_LIVE_API) {
            fetchLiveDashboardData();
        } else {
            fetchMockDashboardData();
        }
    }

    /* Standard Spring Boot REST Integration Methods */
    function fetchLiveDashboardData() {
        const headers = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
        
        $.ajax({ url: '/api/v1/manager/dashboard', headers: headers, success: renderStats });
        $.ajax({ url: '/api/v1/manager/sales', headers: headers, success: renderSalesChart });
        $.ajax({ url: '/api/v1/orders', headers: headers, success: renderOrdersSection });
        $.ajax({ url: '/api/v1/books/low-stock', headers: headers, success: renderLowStockSection });
        $.ajax({ url: '/api/v1/customers', headers: headers, success: renderCustomersTable });
        $.ajax({ url: '/api/v1/manager/notifications', headers: headers, success: renderNotifications });
    }

    /* Fallback Mock Data Execution */
    function fetchMockDashboardData() {
        setTimeout(() => {
            renderStats({
                books: "1,248",
                orders: "356",
                customers: "2,845",
                revenue: "Rs. 1,245,600"
            });

            renderSalesChart([
                { day: "Mon", amount: 45000 },
                { day: "Tue", amount: 62000 },
                { day: "Wed", amount: 51000 },
                { day: "Thu", amount: 75000 },
                { day: "Fri", amount: 68000 },
                { day: "Sat", amount: 92000 },
                { day: "Sun", amount: 81000 }
            ]);

            renderOrderStatusOverview({
                Pending: 24,
                Confirmed: 35,
                Processing: 42,
                Shipped: 28,
                Delivered: 215,
                Cancelled: 12
            });

            renderLowStockSection([
                { title: "Clean Code", stock: 3 },
                { title: "The Hobbit", stock: 2 },
                { title: "Atomic Habits", stock: 4 },
                { title: "The Pragmatic Programmer", stock: 1 }
            ]);

            renderRecentOrders([
                { id: "BH-2026-00125", customer: "Kaveesha Silva", date: "Aug 23, 2026", items: "2 Books", total: "Rs. 9,850", payment: "Cash on Delivery", status: "SHIPPED" },
                { id: "BH-2026-00124", customer: "Nimal Perera", date: "Aug 23, 2026", items: "1 Book", total: "Rs. 4,500", payment: "Card", status: "PROCESSING" },
                { id: "BH-2026-00123", customer: "Sarah Fernando", date: "Aug 22, 2026", items: "3 Books", total: "Rs. 12,400", payment: "Card", status: "DELIVERED" }
            ]);

            renderTopSellingBooks([
                { title: "Clean Code", author: "Robert C. Martin", sold: "124 sold", revenue: "Rs. 558,000", cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=100" },
                { title: "Atomic Habits", author: "James Clear", sold: "98 sold", revenue: "Rs. 294,000", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=100" },
                { title: "The Psychology of Money", author: "Morgan Housel", sold: "86 sold", revenue: "Rs. 258,000", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=100" }
            ]);

            renderRecentCustomers([
                { name: "Kaveesha Silva", email: "kaveesha@example.com", joined: "Today" },
                { name: "Nimal Perera", email: "nimal@example.com", joined: "Yesterday" },
                { name: "Sarah Fernando", email: "sarah@example.com", joined: "Aug 21, 2026" }
            ]);

            renderNotifications([
                { text: "5 new orders received.", time: "10 mins ago", unread: true },
                { text: "Clean Code is running low on stock.", time: "1 hour ago", unread: true },
                { text: "Order BH-2026-00125 has been shipped.", time: "2 hours ago", unread: true }
            ]);

        }, 600);
    }

    // ------------------------------------------------------------------
    // 5. UI Renderers
    // ------------------------------------------------------------------
    function renderStats(data) {
        $('.stat-card').removeClass('skeleton-loading');
        $('#stat-books').text(data.books);
        $('#stat-orders').text(data.orders);
        $('#stat-customers').text(data.customers);
        $('#stat-revenue').text(data.revenue);
    }

    function renderSalesChart(data) {
        const chartContainer = $('#sales-chart');
        chartContainer.empty();
        const maxAmount = Math.max(...data.map(d => d.amount));

        data.forEach(item => {
            const heightPercentage = (item.amount / maxAmount) * 100;
            const barHtml = `
                <div class="chart-bar-wrapper">
                    <div class="chart-bar" style="height: ${heightPercentage}%;" data-value="Rs. ${item.amount.toLocaleString()}"></div>
                    <span class="chart-label">${item.day}</span>
                </div>
            `;
            chartContainer.append(barHtml);
        });
    }

    function renderOrderStatusOverview(statusData) {
        const container = $('#order-status-container');
        container.empty();
        const total = Object.values(statusData).reduce((a, b) => a + b, 0);

        for (const [status, count] of Object.entries(statusData)) {
            const percent = Math.round((count / total) * 100);
            container.append(`
                <div class="status-progress-item">
                    <div class="status-progress-label">
                        <span>${status}</span>
                        <strong>${count}</strong>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${percent}%;"></div>
                    </div>
                </div>
            `);
        }
    }

    function renderLowStockSection(items) {
        const list = $('#low-stock-items');
        list.empty();
        if (items.length > 0) {
            $('#low-stock-alert').removeClass('hidden');
            $('#alert-low-count').text(items.length);
        }

        items.forEach(item => {
            list.append(`
                <li class="low-stock-item">
                    <span>${item.title}</span>
                    <span class="stock-tag">Stock: ${item.stock}</span>
                </li>
            `);
        });
    }

    function renderRecentOrders(orders) {
        const tbody = $('#recent-orders-body');
        tbody.empty();
        orders.forEach(o => {
            tbody.append(`
                <tr>
                    <td><strong>${o.id}</strong></td>
                    <td>${o.customer}</td>
                    <td>${o.date}</td>
                    <td>${o.items}</td>
                    <td>${o.total}</td>
                    <td>${o.payment}</td>
                    <td><span class="badge-status status-${o.status.toLowerCase()}">${o.status}</span></td>
                    <td><a href="orders.html" class="link-btn">View</a></td>
                </tr>
            `);
        });
    }

    function renderTopSellingBooks(books) {
        const container = $('#top-selling-books');
        container.empty();
        books.forEach(b => {
            container.append(`
                <div class="top-book-item">
                    <img src="${b.cover}" alt="${b.title}" class="top-book-cover">
                    <div class="top-book-details">
                        <h4>${b.title}</h4>
                        <p>${b.author}</p>
                    </div>
                    <div class="top-book-stats">
                        <span class="sold">${b.sold}</span>
                        <span class="revenue">${b.revenue}</span>
                    </div>
                </div>
            `);
        });
    }

    function renderRecentCustomers(customers) {
        const tbody = $('#recent-customers-body');
        tbody.empty();
        customers.forEach(c => {
            tbody.append(`
                <tr>
                    <td><strong>${c.name}</strong></td>
                    <td>${c.email}</td>
                    <td>${c.joined}</td>
                </tr>
            `);
        });
    }

    function renderNotifications(notifs) {
        const list = $('#notification-list');
        list.empty();
        notifs.forEach(n => {
            list.append(`
                <div class="notif-item ${n.unread ? 'unread' : ''}">
                    <div class="notif-icon"><i class="fa-solid fa-bell"></i></div>
                    <div class="notif-details">
                        <p>${n.text}</p>
                        <span class="notif-time">${n.time}</span>
                    </div>
                </div>
            `);
        });
    }

    // ------------------------------------------------------------------
    // 6. Floating AI Assistant Chat Implementation
    // ------------------------------------------------------------------
    $('#ai-toggle-btn').on('click', function () {
        $('#ai-chat-window').toggleClass('hidden');
    });

    $('#ai-close-btn').on('click', function () {
        $('#ai-chat-window').addClass('hidden');
    });

    $(document).on('click', '.ai-prompt-chip', function () {
        const question = $(this).text();
        submitAiQuestion(question);
    });

    $('#ai-send-btn').on('click', function () {
        const input = $('#ai-input');
        const question = input.val().trim();
        if (question) {
            submitAiQuestion(question);
            input.val('');
        }
    });

    $('#ai-input').on('keypress', function (e) {
        if (e.which === 13) {
            $('#ai-send-btn').click();
        }
    });

    function submitAiQuestion(question) {
        const chatBody = $('#ai-chat-body');
        
        // Append User Question
        chatBody.append(`<div class="chat-bubble user-bubble">${question}</div>`);
        chatBody.scrollTop(chatBody[0].scrollHeight);

        // Prepare Mock Response Matrix
        setTimeout(() => {
            let answer = "I am processing store analytics. Here is what I found for your request.";
            const q = question.toLowerCase();

            if (q.includes("low in stock") || q.includes("restocked")) {
                answer = "There are currently 12 books below minimum stock. Critical titles: Clean Code (3 left), The Hobbit (2 left).";
            } else if (q.includes("today's sales") || q.includes("sales summary")) {
                answer = "Today's total revenue stands at Rs. 81,000 across 24 completed orders.";
            } else if (q.includes("best-selling")) {
                answer = "The top-selling book this month is 'Clean Code' by Robert C. Martin with 124 units sold.";
            } else if (q.includes("pending")) {
                answer = "You have 24 pending orders awaiting manager confirmation.";
            }

            chatBody.append(`<div class="chat-bubble ai-bubble">${answer}</div>`);
            chatBody.scrollTop(chatBody[0].scrollHeight);
        }, 500);
    }

});