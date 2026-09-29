// ==========================================
// ADMIN DASHBOARD
// ==========================================


// ==========================================
// SOCKET.IO
// ==========================================

const socket =
    io("https://mm-khakhra-ecommerce.onrender.com");


socket.on(
    "connect",
    () => {

        console.log(
            "🔌 Connected to order notification server"
        );

    }
);


// ==========================================
// NEW ORDER NOTIFICATION
// ==========================================

socket.on(
    "newOrder",
    (order) => {

        console.log(
            "🔔 New Order Received:",
            order
        );


        // ==================================
        // PLAY NOTIFICATION SOUND
        // ==================================

        const notificationSound =
            document.getElementById(
                "orderNotificationSound"
            );


        if (notificationSound) {

            notificationSound.currentTime = 0;


            notificationSound
                .play()
                .then(() => {

                    console.log(
                        "🔊 New order notification sound played"
                    );

                })
                .catch(
                    (error) => {

                        console.log(
                            "🔇 Notification sound could not play:",
                            error
                        );

                    }
                );

        }
        else {

            console.log(
                "⚠️ orderNotificationSound audio element not found."
            );

        }


        // ==================================
        // SHOW NEW ORDER ALERT
        // ==================================
        // Small delay gives the browser a
        // chance to start the sound first.

        setTimeout(
            () => {

                alert(
                    `🔔 NEW ORDER RECEIVED!\n\n` +
                    `Customer: ${order.customerName}\n` +
                    `Email: ${order.email}\n` +
                    `Amount: ₹${order.totalAmount}\n` +
                    `Payment: ${order.paymentMethod}`
                );

            },
            300
        );


        // ==================================
        // RELOAD DASHBOARD
        // ==================================

        if (
            typeof loadDashboardData ===
            "function"
        ) {

            loadDashboardData();

        }

    }
);


// ==========================================
// CHECK LOGGED-IN USER
// ==========================================

const storedUser =
    localStorage.getItem("user");


if (!storedUser) {

    alert(
        "🔐 Please login first."
    );

    window.location.href =
        "login.html";

}


// ==========================================
// GET USER
// ==========================================

const user =
    JSON.parse(storedUser);


// ==========================================
// CHECK ADMIN ROLE
// ==========================================

if (
    user.role !== "admin"
) {

    alert(
        "❌ Access denied. Admin only."
    );

    window.location.href =
        "profile.html";

}


// ==========================================
// DISPLAY ADMIN NAME
// ==========================================

const adminName =
    document.getElementById(
        "adminName"
    );


if (adminName) {

    adminName.textContent =
        user.name || "Admin";

}


// ==========================================
// LOAD DASHBOARD DATA
// ==========================================

async function loadDashboardData() {

    try {


        // ==================================
        // PRODUCTS
        // ==================================

        const productResponse =
            await fetch(
                "https://mm-khakhra-ecommerce.onrender.com/api/products"
            );


        if (!productResponse.ok) {

            throw new Error(
                "Failed to load products"
            );

        }


        const products =
            await productResponse.json();


        const productCount =
            document.getElementById(
                "productCount"
            );


        if (productCount) {

            productCount.textContent =
                products.length;

        }


        // ==================================
        // USERS
        // ==================================

        const token =
            localStorage.getItem("token");


        const userResponse =
            await fetch(
                "https://mm-khakhra-ecommerce.onrender.com/api/users",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        if (!userResponse.ok) {

            throw new Error(
                "Failed to load users"
            );

        }


        const users =
            await userResponse.json();


        const userCount =
            document.getElementById(
                "userCount"
            );


        if (userCount) {

            userCount.textContent =
                users.length;

        }


        // ==================================
        // ORDERS
        // ==================================

        const orderResponse =
            await fetch(
                "https://mm-khakhra-ecommerce.onrender.com/api/orders"
            );


        if (!orderResponse.ok) {

            throw new Error(
                "Failed to load orders"
            );

        }


        const orders =
            await orderResponse.json();


        const orderCount =
            document.getElementById(
                "orderCount"
            );


        if (orderCount) {

            orderCount.textContent =
                orders.length;

        }


        // ==================================
        // TOTAL REVENUE
        // ==================================

        let revenue = 0;


        orders.forEach(
            order => {

                revenue +=
                    Number(
                        order.totalAmount
                    ) || 0;

            }
        );


        const revenueCount =
            document.getElementById(
                "revenueCount"
            );


        if (revenueCount) {

            revenueCount.textContent =
                "₹" +
                revenue.toLocaleString(
                    "en-IN"
                );

        }


        // ==================================
        // RECENT ORDERS
        // ==================================

        displayRecentOrders(
            orders
        );


        // ==================================
        // SALES ANALYTICS
        // ==================================

        createSalesChart(
            orders
        );


    }

    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


// ==========================================
// SALES ANALYTICS
// ==========================================

let salesChart = null;


function createSalesChart(
    orders
) {

    const canvas =
        document.getElementById(
            "salesChart"
        );


    if (!canvas) {

        return;

    }


    // ==================================
    // LAST 6 MONTHS
    // ==================================

    const months = [];

    const revenueData = [];

    const orderData = [];


    const today =
        new Date();


    for (
        let i = 5;
        i >= 0;
        i--
    ) {

        const date =
            new Date(
                today.getFullYear(),
                today.getMonth() - i,
                1
            );


        const monthName =
            date.toLocaleString(
                "en-IN",
                {
                    month: "short"
                }
            );


        months.push(
            monthName
        );


        let monthlyRevenue = 0;

        let monthlyOrders = 0;


        orders.forEach(
            order => {

                if (
                    !order.createdAt
                ) {

                    return;

                }


                const orderDate =
                    new Date(
                        order.createdAt
                    );


                if (

                    orderDate.getMonth() ===
                    date.getMonth()

                    &&

                    orderDate.getFullYear() ===
                    date.getFullYear()

                ) {

                    monthlyRevenue +=
                        Number(
                            order.totalAmount
                        ) || 0;


                    monthlyOrders++;

                }

            }
        );


        revenueData.push(
            monthlyRevenue
        );


        orderData.push(
            monthlyOrders
        );

    }


    // ==================================
    // DESTROY OLD CHART
    // ==================================

    if (salesChart) {

        salesChart.destroy();

    }


    // ==================================
    // CREATE CHART
    // ==================================

    salesChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: months,

                    datasets: [

                        {

                            label:
                                "Revenue (₹)",

                            data:
                                revenueData,

                            backgroundColor:
                                "rgba(109, 140, 61, 0.75)",

                            borderColor:
                                "#6d8c3d",

                            borderWidth: 1,

                            borderRadius: 8,

                            yAxisID:
                                "revenueAxis"

                        },


                        {

                            label:
                                "Orders",

                            data:
                                orderData,

                            type:
                                "line",

                            borderColor:
                                "#ff9800",

                            backgroundColor:
                                "#ff9800",

                            borderWidth: 3,

                            tension: 0.3,

                            pointRadius: 5,

                            pointHoverRadius: 7,

                            yAxisID:
                                "ordersAxis"

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    interaction: {

                        mode: "index",

                        intersect: false

                    },


                    plugins: {

                        legend: {

                            display: true,

                            position: "top"

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        if (
                                            context.dataset.label ===
                                            "Revenue (₹)"
                                        ) {

                                            return (
                                                "Revenue: ₹" +
                                                Number(
                                                    context.raw
                                                ).toLocaleString(
                                                    "en-IN"
                                                )
                                            );

                                        }


                                        return (
                                            "Orders: " +
                                            context.raw
                                        );

                                    }

                            }

                        }

                    },


                    scales: {

                        revenueAxis: {

                            type:
                                "linear",

                            position:
                                "left",

                            beginAtZero:
                                true,

                            title: {

                                display:
                                    true,

                                text:
                                    "Revenue (₹)"

                            }

                        },


                        ordersAxis: {

                            type:
                                "linear",

                            position:
                                "right",

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            },


                            title: {

                                display:
                                    true,

                                text:
                                    "Orders"

                            },


                            grid: {

                                drawOnChartArea:
                                    false

                            }

                        }

                    }

                }

            }
        );

}


// ==========================================
// RECENT ORDERS
// ==========================================

function displayRecentOrders(
    orders
) {

    const container =
        document.getElementById(
            "recentOrders"
        );


    if (!container) {

        return;

    }


    if (!orders.length) {

        return;

    }


    const recent =
        orders.slice(
            0,
            5
        );


    container.innerHTML =
        recent.map(
            order => {

                return `

                    <div class="admin-management-card">

                        <div class="management-icon order-management-icon">

                            <i class="fa-solid fa-box"></i>

                        </div>


                        <div>

                            <h3>
                                Order #${order._id.slice(-6)}
                            </h3>

                            <p>
                                ${order.customerName || "Customer"}
                                • ₹${order.totalAmount}
                            </p>

                        </div>


                        <strong>
                            ${order.status}
                        </strong>

                    </div>

                `;

            }
        ).join("");

}


// ==========================================
// LOGOUT
// ==========================================

function adminLogout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {

        return;

    }


    localStorage.removeItem(
        "user"
    );


    localStorage.removeItem(
        "token"
    );


    alert(
        "👋 Admin logged out successfully!"
    );


    window.location.href =
        "index.html";

}


// ==========================================
// ORDER TAKING STATUS
// ==========================================

async function loadOrderTakingStatus() {

    try {

        const response =
            await fetch(
                "https://mm-khakhra-ecommerce.onrender.com/api/shop/status"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to get shop status"
            );

        }


        const data =
            await response.json();


        updateOrderTakingUI(
            data.isOrderTakingOpen
        );


    }

    catch (error) {

        console.error(
            "Order Taking Status Error:",
            error
        );


        const status =
            document.getElementById(
                "orderTakingStatus"
            );


        const button =
            document.getElementById(
                "orderTakingToggle"
            );


        if (status) {

            status.textContent =
                "Unable to check status";

        }


        if (button) {

            button.textContent =
                "Try Again";

        }

    }

}


// ==========================================
// UPDATE ORDER TAKING UI
// ==========================================

function updateOrderTakingUI(
    isOpen
) {

    const status =
        document.getElementById(
            "orderTakingStatus"
        );


    const button =
        document.getElementById(
            "orderTakingToggle"
        );


    if (
        !status ||
        !button
    ) {

        return;

    }


    if (isOpen) {

        status.textContent =
            "🟢 Customers can place orders";


        button.innerHTML =
            '<i class="fa-solid fa-circle-xmark"></i> Close Order Taking';


        button.classList.remove(
            "closed"
        );


        button.dataset.open =
            "true";

    }

    else {

        status.textContent =
            "🔴 Customers cannot place orders";


        button.innerHTML =
            '<i class="fa-solid fa-circle-check"></i> Open Order Taking';


        button.classList.add(
            "closed"
        );


        button.dataset.open =
            "false";

    }

}


// ==========================================
// OPEN / CLOSE ORDER TAKING
// ==========================================

async function toggleOrderTaking() {

    const button =
        document.getElementById(
            "orderTakingToggle"
        );


    if (!button) {

        return;

    }


    const currentlyOpen =
        button.dataset.open ===
        "true";


    const newStatus =
        !currentlyOpen;


    const action =
        newStatus
            ? "open order taking"
            : "close order taking";


    const confirmed =
        confirm(
            `Are you sure you want to ${action}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        button.disabled =
            true;


        button.textContent =
            "Updating...";


        const response =
            await fetch(
                "https://mm-khakhra-ecommerce.onrender.com/api/shop/status",
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            isOrderTakingOpen:
                                newStatus

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update order status"
            );

        }


        updateOrderTakingUI(
            data.isOrderTakingOpen
        );


        alert(
            data.message
        );


    }

    catch (error) {

        console.error(
            "Order Taking Update Error:",
            error
        );


        alert(
            "❌ Failed to update order taking status."
        );


        loadOrderTakingStatus();

    }

    finally {

        button.disabled =
            false;

    }

}


// ==========================================
// START DASHBOARD
// ==========================================

loadDashboardData();

loadOrderTakingStatus();