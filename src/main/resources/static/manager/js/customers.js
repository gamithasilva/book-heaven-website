/**
 * BookHaven Manager Portal - Customer Management JavaScript Module
 */

// Global State
let customersData = [];
let filteredCustomers = [];
let currentPage = 1;
const pageSize = 10;
let activeTargetCustomerId = null;

// ==========================================================================
// 1. Initial Mock Customer Dataset (12 Realistic Records)
// ==========================================================================
const mockCustomers = [
    {
        id: 1,
        firstName: "Kaveesha",
        lastName: "Silva",
        email: "kaveesha@example.com",
        phone: "0771234567",
        role: "CUSTOMER",
        status: "ACTIVE",
        registeredDate: "2026-08-20",
        avatar: "https://ui-avatars.com/api/?name=Kaveesha+Silva&background=4f46e5&color=fff",
        address: {
            recipientName: "Kaveesha Silva",
            addressLine1: "25 Main Street",
            addressLine2: "Apt 4B",
            city: "Colombo",
            postalCode: "00100",
            country: "Sri Lanka",
            phone: "0771234567"
        },
        statistics: {
            totalOrders: 12,
            completedOrders: 9,
            pendingOrders: 1,
            cancelledOrders: 2,
            totalSpent: 45850,
            booksPurchased: 24,
            averageOrderValue: 3820,
            favoriteCategory: "Programming"
        },
        recentOrders: [
            { orderId: "BH-2026-00125", date: "2026-08-23", total: 7350, status: "SHIPPED" },
            { orderId: "BH-2026-00110", date: "2026-08-20", total: 4500, status: "DELIVERED" }
        ]
    },
    {
        id: 2,
        firstName: "Nimal",
        lastName: "Perera",
        email: "nimal@example.com",
        phone: "0712345678",
        role: "CUSTOMER",
        status: "ACTIVE",
        registeredDate: "2026-08-15",
        avatar: "https://ui-avatars.com/api/?name=Nimal+Perera&background=0D9488&color=fff",
        address: {
            recipientName: "Nimal Perera",
            addressLine1: "42 Temple Road",
            addressLine2: "",
            city: "Kandy",
            postalCode: "20000",
            country: "Sri Lanka",
            phone: "0712345678"
        },
        statistics: {
            totalOrders: 5,
            completedOrders: 5,
            pendingOrders: 0,
            cancelledOrders: 0,
            totalSpent: 18500,
            booksPurchased: 8,
            averageOrderValue: 3700,
            favoriteCategory: "Fiction"
        },
        recentOrders: [
            { orderId: "BH-2026-00098", date: "2026-08-15", total: 3500, status: "DELIVERED" }
        ]
    },
    {
        id: 3,
        firstName: "Dilani",
        lastName: "Fernando",
        email: "dilani.f@example.com",
        phone: "0759876543",
        role: "CUSTOMER",
        status: "INACTIVE",
        registeredDate: "2026-05-10",
        avatar: "https://ui-avatars.com/api/?name=Dilani+Fernando&background=E11D48&color=fff",
        address: {
            recipientName: "Dilani Fernando",
            addressLine1: "12 Beach Road",
            addressLine2: "",
            city: "Galle",
            postalCode: "80000",
            country: "Sri Lanka",
            phone: "0759876543"
        },
        statistics: {
            totalOrders: 1,
            completedOrders: 1,
            pendingOrders: 0,
            cancelledOrders: 0,
            totalSpent: 2400,
            booksPurchased: 1,
            averageOrderValue: 2400,
            favoriteCategory: "Biography"
        },
        recentOrders: [
            { orderId: "BH-2026-00012", date: "2026-05-11", total: 2400, status: "DELIVERED" }
        ]
    },
    {
        id: 4,
        firstName: "Kasun",
        lastName: "Rajapaksha",
        email: "kasun.r@example.com",
        phone: "0781112233",
        role: "CUSTOMER",
        status: "ACTIVE",
        registeredDate: "2026-08-24",
        avatar: "https://ui-avatars.com/api/?name=Kasun+Rajapaksha&background=D97706&color=fff",
        address: null, // Test case: No address saved
        statistics: {
            totalOrders: 0,
            completedOrders: 0,
            pendingOrders: 0,
            cancelledOrders: 0,
            totalSpent: 0,
            booksPurchased: 0,
            averageOrderValue: 0,
            favoriteCategory: "None"
        },
        recentOrders: []
    },
    {
        id: 5,
        firstName: "Saman",
        lastName: "Kumara",
        email: "saman.k@example.com",
        phone: "0704445566",
        role: "CUSTOMER",
        status: "ACTIVE",
        registeredDate: "2026-01-15",
        avatar: "https://ui-avatars.com/api/?name=Saman+Kumara&background=2563EB&color=fff",
        address: {
            recipientName: "Saman Kumara",
            addressLine1: "88 Galle Road",
            addressLine2: "Suite 3",
            city: "Dehiwala",
            postalCode: "10350",
            country: "Sri Lanka",
            phone: "0704445566"
        },
        statistics: {
            totalOrders: 20,
            completedOrders: 18,
            pendingOrders: 1,
            cancelledOrders: 1,
            totalSpent: 89000,
            booksPurchased: 45,
            averageOrderValue: 4450,
            favoriteCategory: "Science"
        },
        recentOrders: [
            { orderId: "BH-2026-00120", date: "2026-08-22", total: 9500, status: "PENDING" }
        ]
    },
    {
        id: 6,
        firstName: "Chathurika",
        lastName: "Jayasinghe",
        email: "chathurika@example.com",
        phone: "0723334455",
        role: "CUSTOMER",
        status: "ACTIVE",
        registeredDate: "2026-07-01",
        avatar: "https://ui-avatars.com/api/?name=Chathurika+Jayasinghe&background=7C3AED&color=fff",
        address: {
            recipientName: "Chathurika Jayasinghe",
            addressLine1: "15 Station Road",
            addressLine2: "",
            city: "Negombo",
            postalCode: "11500",
            country: "Sri Lanka",
            phone: "0723334455"
        },
        statistics: {
            totalOrders: 8,
            completedOrders: 8,
            pendingOrders: 0,
            cancelledOrders: 0,
            totalSpent: 32400,
            booksPurchased: 14,
            averageOrderValue: 4050,
            favoriteCategory: "Self-Help"
        },
        recentOrders: [
            { orderId: "BH-2026-00085", date: "2026-07-28", total: 4200, status: "DELIVERED" }
        ]
    },
    {
        id: 7,
        firstName: "Mahesh",
        lastName: "Pathirana",
        email: "mahesh.p@example.com",
        phone: "0765556677",
        role: "CUSTOMER",
        status: "INACTIVE",
        registeredDate: "2025-11-20",
        avatar: "https://ui-avatars.com/api/?name=Mahesh+Pathirana&background=475569&color=fff",
        address: {
            recipientName: "Mahesh Pathirana",
            addressLine1: "74 Lake Road",
            addressLine2: "",
            city: "Kurunegala",
            postalCode: "60000",
            country: "Sri Lanka",
            phone: "0765556677"
        },
        statistics: {
            totalOrders: 3,
            completedOrders: 2,
            pendingOrders: 0,
            cancelledOrders: 1,
            totalSpent: 9200,
            booksPurchased: 4,
            averageOrderValue: 3066,
            favoriteCategory: "History"
        },
        recentOrders: [
            { orderId: "BH-2025-00450", date: "2025-12-05", total: 3100, status: "DELIVERED" }
        ]
    },
    {
        id: 8,
        firstName: "Thilini",
        lastName: "Gunawardena",
        email: "thilini.g@example.com",
        phone: "0778889900",
        role: "CUSTOMER",
        status: "ACTIVE",
        registeredDate: "2026-08-05",
        avatar: "https://ui-avatars.com/api/?name=Thilini+Gunawardena&background=DB2777&color=fff",
        address: {
            recipientName: "Thilini Gunawardena",
            addressLine1: "10 Cross Street",
            addressLine2: "",
            city: "Nuwara Eliya",
            postalCode: "22200",
            country: "Sri Lanka",
            phone: "0778889900"
        },
        statistics: {
            totalOrders: 6,
            completedOrders: 6,
            pendingOrders: 0,
            cancelledOrders: 0,
            totalSpent: 21500,
            booksPurchased: 10,
            averageOrderValue: 3583,
            favoriteCategory: "Fiction"
        },
        recentOrders: [
            { orderId: "BH-2026-00104", date: "2026-08-18", total: 5400, status: "DELIVERED" }
        ]
    },
    {
        id: 9,
        firstName: "Roshan",
        lastName: "Ranasinghe",
        email: "roshan.r@example.com",
        phone: "0719990011",
        role: "CUSTOMER",
        status: "ACTIVE",
        registeredDate: "2026-06-12",
        avatar: "https://ui-avatars.com/api/?name=Roshan+Ranasinghe&background=059669&color=fff",
        address: {
            recipientName: "Roshan Ranasinghe",
            addressLine1: "55 Highlevel Road",
            addressLine2: "",
            city: "Maharagama",
            postalCode: "10280",
            country: "Sri Lanka",
            phone: "0719990011"
        },
        statistics: {
            totalOrders: 2,
            completedOrders: 1,
            pendingOrders: 1,
            cancelledOrders: 0,
            totalSpent: 6800,
            booksPurchased: 3,
            averageOrderValue: 3400,
            favoriteCategory: "Technology"
        },
        recentOrders: [
            { orderId: "BH-2026-00122", date: "2026-08-23", total: 3400, status: "PROCESSING" }
        ]
    },
    {
        id: 10,
        firstName: "Anusha",
        lastName: "Wickramasinghe",
        email: "anusha.w@example.com",
        phone: "0752223344",
        role: "CUSTOMER",
        status: "ACTIVE",
        registeredDate: "2026-08-22",
        avatar: "https://ui-avatars.com/api/?name=Anusha+Wickramasinghe&background=65A30D&color=fff",
        address: {
            recipientName: "Anusha Wickramasinghe",
            addressLine1: "33 New Road",
            addressLine2: "",
            city: "Matara",
            postalCode: "81000",
            country: "Sri Lanka",
            phone: "0752223344"
        },
        statistics: {
            totalOrders: 1,
            completedOrders: 0,
            pendingOrders: 1,
            cancelledOrders: 0,
            totalSpent: 4200,
            booksPurchased: 2,
            averageOrderValue: 4200,
            favoriteCategory: "Children"
        },
        recentOrders: [
            { orderId: "BH-2026-00124", date: "2026-08-23", total: 4200, status: "PENDING" }
        ]
    },
    {
        id: 11,
        firstName: "Pravin",
        lastName: "Sivakumar",
        email: "pravin.s@example.com",
        phone: "0773332211",
        role: "CUSTOMER",
        status: "ACTIVE",
        registeredDate: "2026-03-30",
        avatar: "https://ui-avatars.com/api/?name=Pravin+Sivakumar&background=DC2626&color=fff",
        address: {
            recipientName: "Pravin Sivakumar",
            addressLine1: "101 Point Pedro Road",
            addressLine2: "",
            city: "Jaffna",
            postalCode: "40000",
            country: "Sri Lanka",
            phone: "0773332211"
        },
        statistics: {
            totalOrders: 15,
            completedOrders: 14,
            pendingOrders: 0,
            cancelledOrders: 1,
            totalSpent: 62000,
            booksPurchased: 30,
            averageOrderValue: 4133,
            favoriteCategory: "Engineering"
        },
        recentOrders: [
            { orderId: "BH-2026-00090", date: "2026-08-01", total: 8200, status: "DELIVERED" }
        ]
    },
    {
        id: 12,
        firstName: "Hasini",
        lastName: "Fonseka",
        email: "hasini.f@example.com",
        phone: "0787776655",
        role: "CUSTOMER",
        status: "INACTIVE",
        registeredDate: "2026-02-14",
        avatar: "https://ui-avatars.com/api/?name=Hasini+Fonseka&background=9333EA&color=fff",
        address: null,
        statistics: {
            totalOrders: 0,
            completedOrders: 0,
            pendingOrders: 0,
            cancelledOrders: 0,
            totalSpent: 0,
            booksPurchased: 0,
            averageOrderValue: 0,
            favoriteCategory: "None"
        },
        recentOrders: []
    }
];

// ==========================================================================
// 2. Authentication & Initialization Check
// ==========================================================================
$(document.body).ready(function() {
    checkManagerAuth();
    initTheme();
    loadCustomersData();
    bindEvents();
});

function checkManagerAuth() {
    // Basic frontend authentication safeguard check
    const managerToken = localStorage.getItem("managerToken") || sessionStorage.getItem("managerToken");
    // Simulated check for demo purposes
    if (managerToken === "unauthenticated") {
        window.location.href = "manager-login.html";
    }
}

// ==========================================================================
// 3. API Preparation Functions (Spring Boot Mock Calls)
// ==========================================================================
function apiFetchCustomers() {
    // Ready for Spring Boot REST Endpoint: GET /api/v1/customers
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockCustomers]);
        }, 300);
    });
}

function apiUpdateCustomerStatus(customerId, newStatus) {
    // Ready for Spring Boot REST Endpoint: PATCH /api/v1/customers/{id}/status
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const customer = mockCustomers.find(c => c.id === customerId);
            if (customer) {
                customer.status = newStatus;
                resolve({ success: true, customer });
            } else {
                reject(new Error("Customer not found"));
            }
        }, 300);
    });
}

// ==========================================================================
// 4. Data Loading & Statistical Calculations
// ==========================================================================
function loadCustomersData() {
    showTableLoading(true);
    apiFetchCustomers().then(data => {
        customersData = data;
        calculateGlobalStatistics();
        applyFiltersAndRender();
        showTableLoading(false);
    }).catch(err => {
        showTableLoading(false);
        showToast("Unable to load customers.", "danger");
    });
}

function calculateGlobalStatistics() {
    const total = 2845; // Fixed dataset baseline matching user requirements
    const active = customersData.filter(c => c.status === "ACTIVE").length + 2720;
    const inactive = customersData.filter(c => c.status === "INACTIVE").length + 110;
    const newThisMonth = 186;

    $('#statTotalCustomers').text(total.toLocaleString());
    $('#statActiveCustomers').text(active.toLocaleString());
    $('#statInactiveCustomers').text(inactive.toLocaleString());
    $('#statNewCustomers').text(newThisMonth.toLocaleString());
}

// ==========================================================================
// 5. Filtering & Sorting Mechanics
// ==========================================================================
function applyFiltersAndRender() {
    const searchVal = $('#searchInput').val().toLowerCase().trim();
    const statusVal = $('#filterStatus').val();
    const regVal = $('#filterRegistration').val();
    const activityVal = $('#filterActivity').val();
    const spendingVal = $('#filterSpending').val();
    const sortVal = $('#sortBy').val();

    filteredCustomers = customersData.filter(customer => {
        // Search filter (Name, Email, Phone)
        const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
        const matchesSearch = !searchVal || 
            customer.firstName.toLowerCase().includes(searchVal) ||
            customer.lastName.toLowerCase().includes(searchVal) ||
            fullName.includes(searchVal) ||
            customer.email.toLowerCase().includes(searchVal) ||
            customer.phone.includes(searchVal);

        // Status filter
        const matchesStatus = (statusVal === "ALL") || (customer.status === statusVal);

        // Registration Date filter
        let matchesReg = true;
        const regDate = new Date(customer.registeredDate);
        const today = new Date("2026-08-24"); // Current System Time Context

        if (regVal === "TODAY") {
            matchesReg = regDate.toDateString() === today.toDateString();
        } else if (regVal === "LAST_7_DAYS") {
            const diffTime = Math.abs(today - regDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            matchesReg = diffDays <= 7;
        } else if (regVal === "LAST_30_DAYS") {
            const diffTime = Math.abs(today - regDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            matchesReg = diffDays <= 30;
        } else if (regVal === "THIS_YEAR") {
            matchesReg = regDate.getFullYear() === today.getFullYear();
        }

        // Order Activity Filter
        let matchesActivity = true;
        if (activityVal === "HAS_ORDERS") {
            matchesActivity = customer.statistics.totalOrders > 0;
        } else if (activityVal === "NO_ORDERS") {
            matchesActivity = customer.statistics.totalOrders === 0;
        }

        // Spending Filter
        let matchesSpending = true;
        const spent = customer.statistics.totalSpent;
        if (spendingVal === "UNDER_5000") matchesSpending = spent < 5000;
        else if (spendingVal === "5000_20000") matchesSpending = spent >= 5000 && spent <= 20000;
        else if (spendingVal === "20000_50000") matchesSpending = spent > 20000 && spent <= 50000;
        else if (spendingVal === "OVER_50000") matchesSpending = spent > 50000;

        return matchesSearch && matchesStatus && matchesReg && matchesActivity && matchesSpending;
    });

    // Sorting Engine
    filteredCustomers.sort((a, b) => {
        if (sortVal === "NEWEST") return new Date(b.registeredDate) - new Date(a.registeredDate);
        if (sortVal === "OLDEST") return new Date(a.registeredDate) - new Date(b.registeredDate);
        if (sortVal === "NAME_ASC") return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        if (sortVal === "NAME_DESC") return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        if (sortVal === "SPENDING_HIGH") return b.statistics.totalSpent - a.statistics.totalSpent;
        if (sortVal === "SPENDING_LOW") return a.statistics.totalSpent - b.statistics.totalSpent;
        if (sortVal === "ORDERS_MOST") return b.statistics.totalOrders - a.statistics.totalOrders;
        if (sortVal === "ORDERS_LEAST") return a.statistics.totalOrders - b.statistics.totalOrders;
        return 0;
    });

    currentPage = 1;
    renderTable();
}

// ==========================================================================
// 6. UI Table & Pagination Rendering
// ==========================================================================
function renderTable() {
    const $tbody = $('#customerTableBody');
    $tbody.empty();

    if (filteredCustomers.length === 0) {
        $('#customersTable').addClass('hidden');
        $('#paginationWrapper').addClass('hidden');
        $('#tableEmptyState').removeClass('hidden');
        return;
    }

    $('#customersTable').removeClass('hidden');
    $('#paginationWrapper').removeClass('hidden');
    $('#tableEmptyState').addClass('hidden');

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredCustomers.length);
    const pageData = filteredCustomers.slice(startIndex, endIndex);

    pageData.forEach(c => {
        const formattedDate = formatDate(c.registeredDate);
        const statusBadgeClass = c.status === "ACTIVE" ? "active" : "inactive";
        const statusIcon = c.status === "ACTIVE" ? "fa-circle-check" : "fa-circle-xmark";
        const toggleActionText = c.status === "ACTIVE" ? "Deactivate" : "Activate";

        const row = `
            <tr>
                <td>
                    <div class="customer-cell">
                        <img src="${c.avatar}" alt="${c.firstName}" class="avatar-img">
                        <div class="customer-info">
                            <span class="customer-name">${c.firstName} ${c.lastName}</span>
                            <span class="role-badge">CUSTOMER</span>
                        </div>
                    </div>
                </td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td>${formattedDate}</td>
                <td><strong>${c.statistics.totalOrders}</strong></td>
                <td><strong>Rs. ${c.statistics.totalSpent.toLocaleString()}</strong></td>
                <td>
                    <span class="status-badge ${statusBadgeClass}">
                        <i class="fa-solid ${statusIcon}"></i> ${c.status}
                    </span>
                </td>
                <td class="text-center">
                    <div style="display: flex; gap: 6px; justify-content: center;">
                        <button class="btn btn-secondary btn-sm btn-view-customer" data-id="${c.id}" title="View Details">
                            <i class="fa-solid fa-eye"></i> View
                        </button>
                        <a href="orders.html?customerId=${c.id}" class="btn btn-secondary btn-sm" title="View Orders">
                            <i class="fa-solid fa-box"></i> Orders
                        </a>
                        <button class="btn ${c.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'} btn-sm btn-toggle-status" data-id="${c.id}" data-status="${c.status}">
                            <i class="fa-solid ${c.status === 'ACTIVE' ? 'fa-pause' : 'fa-play'}"></i> ${toggleActionText}
                        </button>
                    </div>
                </td>
            </tr>
        `;
        $tbody.append(row);
    });

    renderPagination(startIndex + 1, endIndex, filteredCustomers.length);
}

function renderPagination(start, end, total) {
    $('#paginationInfo').text(`Showing ${start}–${end} of ${total} customers`);
    const $controls = $('#paginationControls');
    $controls.empty();

    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return;

    const prevBtn = `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} id="btnPrevPage"><i class="fa-solid fa-chevron-left"></i> Previous</button>`;
    $controls.append(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        $controls.append(`<button class="page-btn ${activeClass}" data-page="${i}">${i}</button>`);
    }

    const nextBtn = `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} id="btnNextPage">Next <i class="fa-solid fa-chevron-right"></i></button>`;
    $controls.append(nextBtn);
}

// ==========================================================================
// 7. Modals & Customer Details Rendering
// ==========================================================================
function openCustomerDetailsModal(customerId) {
    const customer = customersData.find(c => c.id === customerId);
    if (!customer) return;

    const addr = customer.address;
    const addressHtml = addr ? `
        <p><strong>${addr.recipientName}</strong></p>
        <p>${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}</p>
        <p>${addr.city}, ${addr.postalCode}</p>
        <p>${addr.country}</p>
        <p><i class="fa-solid fa-phone"></i> ${addr.phone}</p>
    ` : `<p class="text-muted">No saved address.</p>`;

    let ordersHtml = '';
    if (customer.recentOrders && customer.recentOrders.length > 0) {
        ordersHtml = `
            <table class="data-table" style="margin-top:8px;">
                <thead>
                    <tr>
                        <th>Order Number</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${customer.recentOrders.map(o => `
                        <tr>
                            <td><strong>${o.orderId}</strong></td>
                            <td>${formatDate(o.date)}</td>
                            <td>Rs. ${o.total.toLocaleString()}</td>
                            <td><span class="status-badge active">${o.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        ordersHtml = `<p class="text-muted">No recent orders found.</p>`;
    }

    const modalContent = `
        <div class="modal-profile-header">
            <img src="${customer.avatar}" alt="${customer.firstName}" class="modal-avatar">
            <div class="modal-profile-info">
                <h2>${customer.firstName} ${customer.lastName} <span class="role-badge">CUSTOMER</span></h2>
                <p><i class="fa-solid fa-envelope"></i> ${customer.email} | <i class="fa-solid fa-phone"></i> ${customer.phone}</p>
                <p>Joined: ${formatDate(customer.registeredDate)} | Status: <strong>${customer.status}</strong></p>
            </div>
        </div>

        <div class="modal-grid">
            <div class="modal-card">
                <div class="modal-card-title">Total Orders</div>
                <div class="modal-card-value">${customer.statistics.totalOrders}</div>
            </div>
            <div class="modal-card">
                <div class="modal-card-title">Completed Orders</div>
                <div class="modal-card-value text-success">${customer.statistics.completedOrders}</div>
            </div>
            <div class="modal-card">
                <div class="modal-card-title">Pending Orders</div>
                <div class="modal-card-value text-warning">${customer.statistics.pendingOrders}</div>
            </div>
            <div class="modal-card">
                <div class="modal-card-title">Cancelled Orders</div>
                <div class="modal-card-value text-danger">${customer.statistics.cancelledOrders}</div>
            </div>
        </div>

        <div>
            <h4 class="modal-section-title"><i class="fa-solid fa-location-dot"></i> Default Address</h4>
            <div class="modal-card">${addressHtml}</div>
        </div>

        <div>
            <h4 class="modal-section-title"><i class="fa-solid fa-chart-line"></i> Purchase Summary</h4>
            <div class="modal-grid">
                <div class="modal-card">
                    <div class="modal-card-title">Total Spent</div>
                    <div class="modal-card-value">Rs. ${customer.statistics.totalSpent.toLocaleString()}</div>
                </div>
                <div class="modal-card">
                    <div class="modal-card-title">Average Order Value</div>
                    <div class="modal-card-value">Rs. ${customer.statistics.averageOrderValue.toLocaleString()}</div>
                </div>
                <div class="modal-card">
                    <div class="modal-card-title">Books Purchased</div>
                    <div class="modal-card-value">${customer.statistics.booksPurchased}</div>
                </div>
                <div class="modal-card">
                    <div class="modal-card-title">Favorite Category</div>
                    <div class="modal-card-value">${customer.statistics.favoriteCategory}</div>
                </div>
            </div>
        </div>

        <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <h4 class="modal-section-title" style="margin-bottom:0;"><i class="fa-solid fa-clock-history"></i> Recent Orders</h4>
                <a href="orders.html?customerId=${customer.id}" class="btn btn-secondary btn-sm">View All Orders</a>
            </div>
            ${ordersHtml}
        </div>
    `;

    $('#modalDetailsContent').html(modalContent);
    $('#customerDetailsModal').removeClass('hidden');
}

// ==========================================================================
// 8. Activation / Deactivation Workflow
// ==========================================================================
function promptStatusChange(customerId, currentStatus) {
    activeTargetCustomerId = customerId;
    const isActivating = currentStatus === "INACTIVE";
    
    const title = isActivating ? "Activate Account" : "Deactivate Account";
    const msg = isActivating 
        ? "Activate this customer account?" 
        : "Are you sure you want to deactivate this customer account?";

    $('#statusModalTitle').text(title);
    $('#statusModalMessage').text(msg);
    
    const $confirmBtn = $('#btnConfirmStatus');
    $confirmBtn.text(isActivating ? "Activate" : "Deactivate");
    $confirmBtn.attr('class', isActivating ? 'btn btn-primary' : 'btn btn-danger');

    $('#statusConfirmModal').removeClass('hidden');
}

function executeStatusChange() {
    if (!activeTargetCustomerId) return;
    
    const customer = customersData.find(c => c.id === activeTargetCustomerId);
    if (!customer) return;

    const targetStatus = customer.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    apiUpdateCustomerStatus(activeTargetCustomerId, targetStatus).then(res => {
        $('#statusConfirmModal').addClass('hidden');
        showToast(`Customer account has been ${targetStatus.toLowerCase()}d successfully.`, "success");
        calculateGlobalStatistics();
        applyFiltersAndRender();
        activeTargetCustomerId = null;
    }).catch(err => {
        showToast("Failed to update status.", "danger");
    });
}

// ==========================================================================
// 9. AI Assistant Engine (Demo Interface)
// ==========================================================================
function handleAiQuery(queryText) {
    if (!queryText.trim()) return;

    const $chatMessages = $('#aiChatMessages');
    $chatMessages.append(`<div class="ai-msg ai-msg-user">${escapeHtml(queryText)}</div>`);
    $('#aiInput').val('');

    // Scroll chat bottom
    $chatMessages.scrollTop($chatMessages[0].scrollHeight);

    // Dynamic Mock Bot Analysis
    setTimeout(() => {
        let reply = "I am ready to help analyze BookHaven system data.";
        const q = queryText.toLowerCase();

        if (q.includes("how many customers do we have")) {
            reply = `We currently have 2,845 total registered customers in the database.`;
        } else if (q.includes("new customers joined this month")) {
            reply = `186 new customers registered during this month.`;
        } else if (q.includes("top customers by spending")) {
            reply = `Top spender: Saman Kumara (Rs. 89,000) followed by Pravin Sivakumar (Rs. 62,000).`;
        } else if (q.includes("never placed an order")) {
            reply = `There are currently 2 customers registered without any placed orders.`;
        } else if (q.includes("inactive customers")) {
            reply = `There are 115 inactive customer accounts in total.`;
        } else if (q.includes("most orders")) {
            reply = `Saman Kumara holds the highest order volume with 20 placed orders.`;
        }

        $chatMessages.append(`<div class="ai-msg ai-msg-bot">${reply}</div>`);
        $chatMessages.scrollTop($chatMessages[0].scrollHeight);
    }, 400);
}

// ==========================================================================
// 10. Event Listeners & Binding
// ==========================================================================
function bindEvents() {
    // Search Button & Realtime Input
    $('#btnSearch').on('click', applyFiltersAndRender);
    $('#searchInput').on('keyup', function(e) {
        if (e.key === 'Enter') applyFiltersAndRender();
    });

    // Filter Change Triggers
    $('#btnApplyFilters').on('click', applyFiltersAndRender);
    $('#btnClearFilters, #btnClearFiltersEmpty').on('click', function() {
        $('#searchInput').val('');
        $('#filterStatus').val('ALL');
        $('#filterRegistration').val('ALL');
        $('#filterActivity').val('ALL');
        $('#filterSpending').val('ALL');
        $('#sortBy').val('NEWEST');
        applyFiltersAndRender();
    });

    // Toggle Collapsible Filters on Mobile
    $('#btnToggleFilters').on('click', function() {
        $('#filterCardBody').toggleClass('open');
        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
    });

    // Mobile Sidebar Navigation
    $('#sidebarToggle').on('click', function() {
        $('#sidebar').toggleClass('open');
        $('#sidebarOverlay').toggleClass('open');
    });

    $('#sidebarOverlay').on('click', function() {
        $('#sidebar').removeClass('open');
        $('#sidebarOverlay').removeClass('open');
    });

    // Dynamic Table Delegation Buttons
    $('#customerTableBody').on('click', '.btn-view-customer', function() {
        const id = $(this).data('id');
        openCustomerDetailsModal(id);
    });

    $('#customerTableBody').on('click', '.btn-toggle-status', function() {
        const id = $(this).data('id');
        const status = $(this).data('status');
        promptStatusChange(id, status);
    });

    // Modal Control Bindings
    $('#btnCloseDetailsModal, #btnCloseModalFooter').on('click', function() {
        $('#customerDetailsModal').addClass('hidden');
    });

    $('#btnCloseStatusModal, #btnCancelStatus').on('click', function() {
        $('#statusConfirmModal').addClass('hidden');
    });

    $('#btnConfirmStatus').on('click', executeStatusChange);

    // Pagination Events
    $('#paginationControls').on('click', '.page-btn', function() {
        const page = $(this).data('page');
        if (page) {
            currentPage = page;
            renderTable();
        }
    });

    $('#paginationControls').on('click', '#btnPrevPage', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    $('#paginationControls').on('click', '#btnNextPage', function() {
        const totalPages = Math.ceil(filteredCustomers.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    // Theme Switcher Event
    $('#themeToggle').on('click', toggleTheme);

    // Logout Confirmation Prompt
    $('#logoutBtn').on('click', function(e) {
        e.preventDefault();
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("managerToken");
            window.location.href = "manager-login.html";
        }
    });

    // AI Assistant Widget Binding
    $('#aiTriggerBtn').on('click', function() {
        $('#aiChatWindow').toggleClass('hidden');
    });

    $('#btnAiClose').on('click', function() {
        $('#aiChatWindow').addClass('hidden');
    });

    $('#btnAiSend').on('click', function() {
        handleAiQuery($('#aiInput').val());
    });

    $('#aiInput').on('keyup', function(e) {
        if (e.key === 'Enter') handleAiQuery($(this).val());
    });

    $('.suggestion-chip').on('click', function() {
        const q = $(this).data('query');
        handleAiQuery(q);
    });
}

// ==========================================================================
// 11. Utilities & Theme Helpers
// ==========================================================================
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

function showTableLoading(isLoading) {
    if (isLoading) {
        $('#customersTable').addClass('hidden');
        $('#tableLoadingState').removeClass('hidden');
    } else {
        $('#tableLoadingState').addClass('hidden');
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
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}