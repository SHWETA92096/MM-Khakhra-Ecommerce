// ==========================================
// ADMIN ORDER MANAGEMENT
// ==========================================


// ==========================================
// CHECK LOGIN
// ==========================================

const storedUser =
    localStorage.getItem("user");


if (!storedUser) {

    alert("🔐 Please login first.");

    window.location.href =
        "login.html";

}


// ==========================================
// CHECK ADMIN
// ==========================================

let user;

try {

    user = JSON.parse(storedUser);

} catch (error) {

    localStorage.removeItem("user");

    window.location.href =
        "login.html";

}


if (user.role !== "admin") {

    alert(
        "❌ Admin access required."
    );

    window.location.href =
        "index.html";

}


// ==========================================
// LOAD ORDERS
// ==========================================

async function loadOrders() {

    const table =
        document.getElementById(
            "ordersTable"
        );


    if (!table) return;


    try {

        const response =
            await fetch(
                "https://mm-khakhra-ecommerce.onrender.com/api/orders"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load orders"
            );

        }


        const orders =
            await response.json();


        table.innerHTML = "";


        // ==========================================
        // NO ORDERS
        // ==========================================

        if (!orders.length) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        style="text-align:center;">

                        📦 No orders found.

                    </td>

                </tr>

            `;

            return;

        }


        // ==========================================
        // DISPLAY ORDERS
        // ==========================================

        orders.forEach(order => {


            const date =
                new Date(
                    order.createdAt
                ).toLocaleDateString(
                    "en-IN"
                );


            const customerName =
                order.customerName ||
                order.user?.name ||
                "Unknown";


            const email =
                order.email ||
                order.user?.email ||
                "N/A";


            const amount =
                Number(
                    order.totalAmount
                ) || 0;


            table.innerHTML += `

                <tr>


                    <td>

                        <strong>
                            ${escapeHtml(customerName)}
                        </strong>

                    </td>


                    <td>

                        ${escapeHtml(email)}

                    </td>


                    <td>

                        <strong>
                            ₹${amount.toFixed(2)}
                        </strong>

                    </td>


                    <td>

                        ${escapeHtml(
                            order.paymentMethod ||
                            "Cash on Delivery"
                        )}

                    </td>


                    <td>

                        ${date}

                    </td>


                    <td>

                        <select
                            class="status-select"
                            onchange="
                                changeStatus(
                                    '${order._id}',
                                    this.value
                                )
                            "
                        >


                            <option
                                value="Pending"
                                ${
                                    order.status === "Pending"
                                        ? "selected"
                                        : ""
                                }>

                                Pending

                            </option>


                            <option
                                value="Confirmed"
                                ${
                                    order.status === "Confirmed"
                                        ? "selected"
                                        : ""
                                }>

                                Confirmed

                            </option>


                            <option
                                value="Shipped"
                                ${
                                    order.status === "Shipped"
                                        ? "selected"
                                        : ""
                                }>

                                Shipped

                            </option>


                            <option
                                value="Delivered"
                                ${
                                    order.status === "Delivered"
                                        ? "selected"
                                        : ""
                                }>

                                Delivered

                            </option>


                            <option
                                value="Cancelled"
                                ${
                                    order.status === "Cancelled"
                                        ? "selected"
                                        : ""
                                }>

                                Cancelled

                            </option>


                        </select>

                    </td>


                    <td>


                        <button
                            class="view-order-btn"
                            onclick="
                                viewOrder('${order._id}')
                            "
                            title="View Order"
                        >

                            <i
                                class="fa-solid fa-eye">
                            </i>

                        </button>


                    </td>


                </tr>

            `;

        });


    } catch (error) {

        console.error(
            "Order Error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center;">

                    ❌ Failed to load orders.

                    <br><br>

                    Make sure your backend
                    server is running.

                </td>

            </tr>

        `;

    }

}


// ==========================================
// CHANGE ORDER STATUS
// ==========================================

async function changeStatus(
    id,
    status
) {

    try {

        const response =
            await fetch(
                `https://mm-khakhra-ecommerce.onrender.com/api/orders/${id}/status`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        status: status

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update status"
            );

        }


        alert(
            "✅ Order status updated to " +
            status
        );


        loadOrders();


    } catch (error) {

        console.error(
            "Status Error:",
            error
        );


        alert(
            "❌ Failed to update order status."
        );

    }

}


// ==========================================
// VIEW ORDER DETAILS
// ==========================================

async function viewOrder(id) {

    try {

        const response =
            await fetch(
                "https://mm-khakhra-ecommerce.onrender.com/api/orders"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load order"
            );

        }


        const orders =
            await response.json();


        const order =
            orders.find(
                item => item._id === id
            );


        if (!order) {

            alert(
                "❌ Order not found."
            );

            return;

        }


        displayOrderDetails(order);


    } catch (error) {

        console.error(
            "View Order Error:",
            error
        );


        alert(
            "❌ Unable to load order details."
        );

    }

}


// ==========================================
// DISPLAY ORDER DETAILS
// ==========================================

function displayOrderDetails(order) {

    const modal =
        document.getElementById(
            "orderModal"
        );


    const customerInfo =
        document.getElementById(
            "orderCustomerInfo"
        );


    const productsContainer =
        document.getElementById(
            "orderProducts"
        );


    const bill =
        document.getElementById(
            "orderBill"
        );


    // ==========================================
    // CUSTOMER INFORMATION
    // ==========================================

    const orderDate =
        new Date(
            order.createdAt
        ).toLocaleString(
            "en-IN"
        );


    customerInfo.innerHTML = `

        <div class="info-card">

            <strong>
                Order ID
            </strong>

            <span>
                #${order._id.slice(-8)}
            </span>

        </div>


        <div class="info-card">

            <strong>
                Order Date
            </strong>

            <span>
                ${orderDate}
            </span>

        </div>


        <div class="info-card">

            <strong>
                Customer Name
            </strong>

            <span>
                ${escapeHtml(
                    order.customerName ||
                    "N/A"
                )}
            </span>

        </div>


        <div class="info-card">

            <strong>
                Email
            </strong>

            <span>
                ${escapeHtml(
                    order.email ||
                    "N/A"
                )}
            </span>

        </div>


        <div class="info-card">

            <strong>
                Phone
            </strong>

            <span>
                ${escapeHtml(
                    order.phone ||
                    "N/A"
                )}
            </span>

        </div>


        <div class="info-card">

            <strong>
                Payment Method
            </strong>

            <span>

                <span class="payment-badge">

                    ${escapeHtml(
                        order.paymentMethod ||
                        "Cash on Delivery"
                    )}

                </span>

            </span>

        </div>


        <div class="info-card">

            <strong>
                City
            </strong>

            <span>
                ${escapeHtml(
                    order.city ||
                    "N/A"
                )}
            </span>

        </div>


        <div class="info-card">

            <strong>
                Pincode
            </strong>

            <span>
                ${escapeHtml(
                    order.pincode ||
                    "N/A"
                )}
            </span>

        </div>


        <div class="info-card full-width">

            <strong>
                Delivery Address
            </strong>

            <span>
                ${escapeHtml(
                    order.address ||
                    "N/A"
                )}
            </span>

        </div>


        <div class="info-card">

            <strong>
                Order Status
            </strong>

            <span>
                ${escapeHtml(
                    order.status ||
                    "Pending"
                )}
            </span>

        </div>

    `;


    // ==========================================
    // PRODUCTS
    // ==========================================

    if (
        !order.items ||
        order.items.length === 0
    ) {

        productsContainer.innerHTML = `

            <p>
                No product information found.
            </p>

        `;

    } else {

        productsContainer.innerHTML =
            order.items.map(item => {

                const image =
                    item.image
                        ? `images/${item.image}`
                        : "images/logo.png";


                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                return `

                    <div class="order-product">


                        <img
                            src="${image}"
                            alt="${escapeHtml(
                                item.name
                            )}"
                            onerror="
                                this.src='images/logo.png'
                            "
                        >


                        <div class="order-product-info">

                            <h4>

                                ${escapeHtml(
                                    item.name
                                )}

                            </h4>


                            <p>

                                Quantity:
                                ${item.quantity}

                                &nbsp; × &nbsp;

                                ₹${Number(
                                    item.price
                                ).toFixed(2)}

                            </p>

                        </div>


                        <div class="order-product-price">

                            ₹${itemTotal.toFixed(2)}

                        </div>


                    </div>

                `;

            }).join("");

    }


    // ==========================================
    // BILL
    // ==========================================

    const subtotal =
        Number(
            order.subtotal
        ) || 0;


    const discount =
        Number(
            order.discountAmount
        ) || 0;


    const total =
        Number(
            order.totalAmount
        ) || 0;


    bill.innerHTML = `

        <div class="bill-row">

            <span>
                Subtotal
            </span>

            <strong>
                ₹${subtotal.toFixed(2)}
            </strong>

        </div>


        ${
            discount > 0
                ? `

                    <div class="bill-row">

                        <span>
                            Discount
                            ${
                                order.discountCode
                                    ? `(${escapeHtml(
                                        order.discountCode
                                    )})`
                                    : ""
                            }
                        </span>

                        <strong
                            style="color:#d9534f;">

                            - ₹${discount.toFixed(2)}

                        </strong>

                    </div>

                `
                : ""
        }


        <div class="bill-row">

            <span>
                Delivery
            </span>

            <strong>
                Free
            </strong>

        </div>


        <div class="bill-row bill-total">

            <span>
                Total
            </span>

            <span>
                ₹${total.toFixed(2)}
            </span>

        </div>

    `;


    // ==========================================
    // OPEN MODAL
    // ==========================================

    modal.style.display =
        "block";


    document.body.style.overflow =
        "hidden";

}


// ==========================================
// CLOSE ORDER MODAL
// ==========================================

function closeOrderModal() {

    const modal =
        document.getElementById(
            "orderModal"
        );


    modal.style.display =
        "none";


    document.body.style.overflow =
        "auto";

}


// ==========================================
// CLOSE WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById(
                "orderModal"
            );


        if (
            event.target === modal
        ) {

            closeOrderModal();

        }

    }
);


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================
// LOAD ORDERS
// ==========================================

loadOrders();