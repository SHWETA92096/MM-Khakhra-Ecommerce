// ==========================================
// CHECK LOGIN
// ==========================================

const storedUser =
    localStorage.getItem("user");


if (!storedUser) {

    alert("🔐 Please login first.");

    window.location.href = "login.html";

}


// ==========================================
// GET USER
// ==========================================

const user =
    JSON.parse(storedUser);


// ==========================================
// DISPLAY USER NAME
// ==========================================

const welcomeName =
    document.getElementById("welcomeName");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");


if (welcomeName) {

    welcomeName.textContent =
        user.name || "User";

}


if (profileName) {

    profileName.textContent =
        user.name || "-";

}


if (profileEmail) {

    profileEmail.textContent =
        user.email || "-";

}


// ==========================================
// CART COUNT
// ==========================================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    let count = 0;


    cart.forEach(item => {

        count +=
            Number(item.quantity) || 0;

    });


    const cartCount =
        document.getElementById("cartCount");


    if (cartCount) {

        cartCount.textContent = count;

    }

}


updateCartCount();


// ==========================================
// PRODUCT IMAGE URL
// ==========================================

function getProductImage(image) {

    if (!image) {

        return null;

    }


    // Complete URL

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {

        return image;

    }


    // Backend upload path

    if (image.startsWith("/uploads/")) {

        return `http://192.168.0.104:5000${image}`;

    }


    if (image.startsWith("uploads/")) {

        return `http://192.168.0.104:5000/${image}`;

    }


    // Plain filename

    return `http://192.168.0.104:5000/uploads/${image}`;

}


// ==========================================
// LOAD USER ORDERS
// ==========================================

async function loadUserOrders() {

    const ordersContainer =
        document.getElementById(
            "ordersContainer"
        );


    if (!ordersContainer) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://192.168.0.104:5000/api/orders/user/${user.id}`
            );


        const orders =
            await response.json();


        // ==================================
        // NO ORDERS
        // ==================================

        if (
            !response.ok ||
            orders.length === 0
        ) {

            ordersContainer.innerHTML = `

                <div class="empty-orders">

                    <i class="fa-solid fa-box-open"></i>

                    <h3>
                        No Orders Yet
                    </h3>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <a
                        href="products.html"
                        class="shop-now-btn">

                        Start Shopping

                    </a>

                </div>

            `;

            return;

        }


        // ==================================
        // DISPLAY ORDERS
        // ==================================

        ordersContainer.innerHTML = "";


        orders.forEach(order => {

            // ==================================
            // ORDER DATE
            // ==================================

            const orderDate =
                new Date(
                    order.createdAt
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            // ==================================
            // ORDER STATUS
            // ==================================

            const status =
                order.status || "Pending";


            let productsHTML = "";


            // ==================================
            // ORDER PRODUCTS
            // ==================================

            order.items.forEach(item => {

                const imageURL =
                    getProductImage(
                        item.image
                    );


                productsHTML += `

                    <div class="order-product">

                        <div class="order-product-info">

                            <div class="order-product-image">

                                ${
                                    imageURL

                                    ?

                                    `
                                    <img
                                        src="${imageURL}"
                                        alt="${item.name}"
                                        onerror="
                                            this.style.display='none';
                                            this.nextElementSibling.style.display='flex';
                                        "
                                    >

                                    <i
                                        class="fa-solid fa-box"
                                        style="display:none;">
                                    </i>
                                    `

                                    :

                                    `
                                    <i
                                        class="fa-solid fa-box">
                                    </i>
                                    `
                                }

                            </div>


                            <div>

                                <h4>
                                    ${item.name}
                                </h4>

                                <p>
                                    ₹${item.price} × ${item.quantity}
                                </p>

                            </div>

                        </div>


                        <strong>
                            ₹${item.price * item.quantity}
                        </strong>

                    </div>

                `;

            });


            // ==================================
            // ORDER CARD
            // ==================================

            ordersContainer.innerHTML += `

                <div class="order-card">


                    <!-- ORDER HEADER -->

                    <div class="order-header">


                        <div>

                            <span>
                                Order Date
                            </span>

                            <strong>
                                ${orderDate}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Payment
                            </span>

                            <strong>
                                ${
                                    order.paymentMethod ||
                                    "Cash on Delivery"
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Status
                            </span>

                            <strong class="order-status">

                                ${status}

                            </strong>

                        </div>


                    </div>


                    <!-- ORDER PRODUCTS -->

                    <div class="order-products">

                        ${productsHTML}

                    </div>


                    <!-- ORDER FOOTER -->

                    <div class="order-footer">

                        <div>

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹${order.totalAmount}
                            </strong>

                        </div>


                        <button
                            class="download-invoice-btn"
                            onclick="downloadInvoice('${order._id}')">

                            <i class="fa-solid fa-file-invoice"></i>

                            Download Invoice

                        </button>

                    </div>


                    <!-- DELETE ORDER -->

                    ${
                        order.status === "Pending" ||
                        order.status === "Cancelled"

                        ?

                        `
                        <button
                            class="delete-order-btn"
                            onclick="deleteOrder('${order._id}')">

                            <i class="fa-solid fa-trash"></i>

                            Delete Order

                        </button>
                        `

                        :

                        ""
                    }


                </div>

            `;

        });

    }

    catch (error) {

        console.error(
            "Error loading orders:",
            error
        );


        ordersContainer.innerHTML = `

            <div class="empty-orders">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Unable to Load Orders
                </h3>

                <p>
                    Please make sure your server is running.
                </p>

                <button
                    class="shop-now-btn"
                    onclick="loadUserOrders()">

                    Try Again

                </button>

            </div>

        `;

    }

}


// ==========================================
// DELETE ORDER
// ==========================================

async function deleteOrder(orderId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this order?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://192.168.0.104:5000/api/orders/${orderId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to delete order."
            );

            return;

        }


        alert(
            "Order deleted successfully."
        );


        loadUserOrders();

    }

    catch (error) {

        console.error(
            "Delete Order Error:",
            error
        );


        alert(
            "Something went wrong while deleting the order."
        );

    }

}


// ==========================================
// DOWNLOAD INVOICE
// ==========================================

async function downloadInvoice(orderId) {

    try {

        const response =
            await fetch(
                `http://192.168.0.104:5000/api/orders/${orderId}`
            );


        const order =
            await response.json();


        if (!response.ok) {

            alert(
                order.message ||
                "Unable to get order details."
            );

            return;

        }


        // ==================================
        // CREATE PDF
        // ==================================

        const { jsPDF } =
            window.jspdf;


        const doc =
            new jsPDF();


        // ==================================
        // HEADER
        // ==================================

        doc.setFontSize(22);

        doc.setFont(
            undefined,
            "bold"
        );


        doc.text(
            "M M Khakhra",
            20,
            25
        );


        doc.setFontSize(16);


        doc.text(
            "INVOICE",
            150,
            25
        );


        doc.line(
            20,
            32,
            190,
            32
        );


        // ==================================
        // ORDER DETAILS
        // ==================================

        doc.setFontSize(11);

        doc.setFont(
            undefined,
            "normal"
        );


        doc.text(
            `Order ID: ${order._id}`,
            20,
            45
        );


        doc.text(
            `Date: ${new Date(
                order.createdAt
            ).toLocaleDateString("en-IN")}`,
            20,
            52
        );


        doc.text(
            `Status: ${order.status}`,
            20,
            59
        );


        // ==================================
        // CUSTOMER DETAILS
        // ==================================

        doc.setFont(
            undefined,
            "bold"
        );


        doc.text(
            "Customer Details",
            20,
            72
        );


        doc.setFont(
            undefined,
            "normal"
        );


        doc.text(
            `Name: ${order.customerName}`,
            20,
            80
        );


        doc.text(
            `Email: ${order.email}`,
            20,
            87
        );


        doc.text(
            `Phone: ${order.phone}`,
            20,
            94
        );


        doc.text(
            `Address: ${order.address}, ${order.city} - ${order.pincode}`,
            20,
            101
        );


        // ==================================
        // PRODUCTS
        // ==================================

        doc.setFont(
            undefined,
            "bold"
        );


        doc.text(
            "Products",
            20,
            115
        );


        doc.line(
            20,
            120,
            190,
            120
        );


        let y = 130;


        doc.setFont(
            undefined,
            "normal"
        );


        order.items.forEach(
            (item, index) => {

                const itemTotal =
                    item.price *
                    item.quantity;


                doc.text(
                    `${index + 1}. ${item.name}`,
                    20,
                    y
                );


                doc.text(
                    `₹${item.price} × ${item.quantity}`,
                    110,
                    y
                );


                doc.text(
                    `₹${itemTotal}`,
                    170,
                    y
                );


                y += 10;

            }
        );


        // ==================================
        // TOTAL
        // ==================================

        y += 5;


        doc.line(
            20,
            y,
            190,
            y
        );


        y += 12;


        doc.setFont(
            undefined,
            "bold"
        );


        doc.text(
            `Subtotal: ₹${order.subtotal}`,
            130,
            y
        );


        y += 8;


        doc.text(
            `Discount: ₹${order.discountAmount || 0}`,
            130,
            y
        );


        y += 10;


        doc.setFontSize(14);


        doc.text(
            `Total Amount: ₹${order.totalAmount}`,
            120,
            y
        );


        // ==================================
        // PAYMENT
        // ==================================

        y += 15;


        doc.setFontSize(11);


        doc.text(
            `Payment Method: ${
                order.paymentMethod ||
                "Cash on Delivery"
            }`,
            20,
            y
        );


        // ==================================
        // FOOTER
        // ==================================

        y += 20;


        doc.setFont(
            undefined,
            "normal"
        );


        doc.text(
            "Thank you for shopping with M M Khakhra!",
            55,
            y
        );


        // ==================================
        // SAVE PDF
        // ==================================

        doc.save(
            `MM-Khakhra-Invoice-${order._id}.pdf`
        );

    }

    catch (error) {

        console.error(
            "Invoice Error:",
            error
        );


        alert(
            "Unable to generate invoice."
        );

    }

}


// ==========================================
// LOGOUT
// ==========================================

function logoutUser() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {

        return;

    }


    localStorage.removeItem("user");

    localStorage.removeItem("token");


    alert(
        "👋 Logged out successfully!"
    );


    window.location.href =
        "index.html";

}


// ==========================================
// LOAD ORDERS
// ==========================================

loadUserOrders();


// ==========================================
// STATUS NOTIFICATION SOUND
// ==========================================

const statusNotificationSound =
    document.getElementById(
        "statusNotificationSound"
    );


let notificationSoundUnlocked = false;


// ==========================================
// UNLOCK AUDIO AFTER USER INTERACTION
// ==========================================

function unlockNotificationSound() {

    if (
        !statusNotificationSound ||
        notificationSoundUnlocked
    ) {

        return;

    }


    statusNotificationSound
        .play()
        .then(() => {

            statusNotificationSound.pause();

            statusNotificationSound.currentTime =
                0;

            notificationSoundUnlocked =
                true;


            console.log(
                "🔊 Notification sound unlocked."
            );

        })
        .catch(() => {

            console.log(
                "🔇 Notification sound is still locked."
            );

        });

}


// ==========================================
// USER INTERACTION LISTENERS
// ==========================================

document.addEventListener(
    "click",
    unlockNotificationSound,
    {
        once: true
    }
);


document.addEventListener(
    "keydown",
    unlockNotificationSound,
    {
        once: true
    }
);


document.addEventListener(
    "touchstart",
    unlockNotificationSound,
    {
        once: true
    }
);


// ==========================================
// LIVE ORDER STATUS TRACKING
// ==========================================

const orderSocket =
    io("http://192.168.0.104:5000");


// ==========================================
// SOCKET CONNECTED
// ==========================================

orderSocket.on(
    "connect",
    () => {

        console.log(
            "🔌 Connected to live order tracking"
        );

    }
);


// ==========================================
// SOCKET DISCONNECTED
// ==========================================

orderSocket.on(
    "disconnect",
    () => {

        console.log(
            "❌ Disconnected from live order tracking"
        );

    }
);


// ==========================================
// ORDER STATUS UPDATED
// ==========================================

orderSocket.on(
    "orderStatusUpdated",
    (data) => {

        console.log(
            "📦 LIVE ORDER STATUS UPDATE:",
            data
        );


        // ==================================
        // GET CURRENT USER
        // ==================================

        const currentStoredUser =
            localStorage.getItem("user");


        if (!currentStoredUser) {

            return;

        }


        const currentUser =
            JSON.parse(
                currentStoredUser
            );


        // ==================================
        // GET USER ID
        // ==================================

        const currentUserId =
            currentUser.id ||
            currentUser._id;


        console.log(
            "Current User ID:",
            currentUserId
        );


        console.log(
            "Order User ID:",
            data.userId
        );


        // ==================================
        // CHECK ORDER OWNER
        // ==================================

        if (
            String(data.userId) !==
            String(currentUserId)
        ) {

            console.log(
                "⚠️ Order does not belong to this user."
            );

            return;

        }


        // ==================================
        // PLAY STATUS NOTIFICATION SOUND
        // ==================================

        if (statusNotificationSound) {

            statusNotificationSound.currentTime =
                0;


            statusNotificationSound
                .play()
                .then(() => {

                    console.log(
                        "🔊 Order status notification sound played"
                    );

                })
                .catch(error => {

                    console.log(
                        "🔇 Status notification sound could not play:",
                        error
                    );

                });

        }

        else {

            console.log(
                "⚠️ statusNotificationSound audio element not found."
            );

        }


        // ==================================
        // RELOAD ORDERS
        // ==================================

        loadUserOrders();


        // ==================================
        // SHOW NOTIFICATION
        // ==================================

        alert(

            `📦 Order Update\n\n` +

            `Your order status is now: ` +

            `${data.status}`

        );

    }
);