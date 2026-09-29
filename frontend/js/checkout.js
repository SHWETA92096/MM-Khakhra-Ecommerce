// ==========================================
// CHECK LOGIN
// ==========================================

const userData = localStorage.getItem("user");

if (!userData) {

    alert("🔐 Please login before placing an order.");

    window.location.href = "login.html";

}


// ==========================================
// GET USER
// ==========================================

const user = JSON.parse(userData);


// ==========================================
// CART
// ==========================================

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// ==========================================
// CHECK CART
// ==========================================

if (cart.length === 0) {

    alert("🛒 Your cart is empty.");

    window.location.href = "products.html";

}


// ==========================================
// DISPLAY ORDER SUMMARY
// ==========================================

const summaryItems =
    document.getElementById("summaryItems");

const subtotalElement =
    document.getElementById("subtotal");

const totalElement =
    document.getElementById("total");

const deliveryElement =
    document.getElementById("deliveryDisplay");


let subtotal = 0;
let discountAmount = 0;
let appliedDiscountCode = "";
let automaticDiscountAmount = 0;
let deliveryCharge = 0;


// ==========================================
// DISPLAY CART ITEMS
// ==========================================

summaryItems.innerHTML = "";


cart.forEach(item => {

    const itemTotal =
        Number(item.price) * Number(item.quantity);


    subtotal += itemTotal;


    summaryItems.innerHTML += `

        <div class="summary-item">

            <div>

                <strong>
                    ${item.name}
                </strong>

                <p>
                    ₹${item.price} × ${item.quantity}
                </p>

            </div>

            <strong>
                ₹${itemTotal}
            </strong>

        </div>

    `;

});


// ==========================================
// SHOW SUBTOTAL
// ==========================================

subtotalElement.textContent =
    "₹" + subtotal.toFixed(2);


// ==========================================
// DELIVERY CHARGE
// ==========================================

// Free delivery on orders of ₹499 or above

if (subtotal >= 499) {

    deliveryCharge = 0;

    deliveryElement.textContent =
        "Free";

} else {

    deliveryCharge = 40;

    deliveryElement.textContent =
        "₹40";

}


// ==========================================
// AUTOMATIC ₹500+ DISCOUNT
// ==========================================

if (subtotal >= 500) {

    automaticDiscountAmount =
        Number((subtotal * 0.05).toFixed(2));

    discountAmount =
        automaticDiscountAmount;

} else {

    automaticDiscountAmount = 0;

    discountAmount = 0;

}


// ==========================================
// UPDATE TOTAL
// ==========================================

function updateTotal() {

    const finalAmount =
        subtotal -
        discountAmount +
        deliveryCharge;

    totalElement.textContent =
        "₹" + finalAmount.toFixed(2);

}


// ==========================================
// INITIAL TOTAL
// ==========================================

updateTotal();


// ==========================================
// SHOW DISCOUNT
// ==========================================

const discountRow =
    document.getElementById("discountRow");

const discountDisplay =
    document.getElementById("discountDisplay");

const discountMessage =
    document.getElementById("discountMessage");


if (discountAmount > 0) {

    discountRow.style.display = "flex";

    discountDisplay.textContent =
        "- ₹" + discountAmount.toFixed(2);


    // Show automatic discount message

    if (
        !appliedDiscountCode &&
        subtotal >= 500
    ) {

        discountMessage.textContent =
            "🎉 You got 5% OFF on your order!";

        discountMessage.style.color =
            "#6d8c3d";

    }

} else {

    discountRow.style.display = "none";

}


// ==========================================
// CHECKOUT FORM
// ==========================================

document
    .getElementById("checkoutForm")
    .addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();


            // ==================================
            // GET FORM VALUES
            // ==================================

            const customerName =
                document
                    .getElementById("customerName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const address =
                document
                    .getElementById("address")
                    .value
                    .trim();


            const city =
                document
                    .getElementById("city")
                    .value
                    .trim();


            const pincode =
                document
                    .getElementById("pincode")
                    .value
                    .trim();


            const paymentMethod =
                document.querySelector(
                    'input[name="payment"]:checked'
                ).value;


            // ==================================
            // PREPARE ORDER ITEMS
            // ==================================

            const orderItems =
                cart.map(item => ({

                    product: item._id,

                    name: item.name,

                    price: Number(item.price),

                    quantity: Number(item.quantity),

                    image: item.image

                }));


            // ==================================
            // CALCULATE FINAL TOTAL
            // ==================================

            const finalOrderAmount =
                Number(
                    (
                        subtotal -
                        discountAmount +
                        deliveryCharge
                    ).toFixed(2)
                );


            // ==================================
            // CREATE ORDER OBJECT
            // ==================================

            const orderData = {

                user: user.id,

                items: orderItems,

                subtotal: subtotal,

                discountAmount: discountAmount,

                discountCode: appliedDiscountCode,

                totalAmount: finalOrderAmount,

                customerName,

                email,

                phone,

                address,

                city,

                pincode,

                paymentMethod

            };


            try {


                // ==================================
                // CHECK ORDER TAKING STATUS
                // ==================================

                const statusResponse =
                    await fetch(
                        "https://mm-khakhra-ecommerce.onrender.com/api/shop/status"
                    );


                const shopStatus =
                    await statusResponse.json();


                // ==================================
                // STOP IF ORDERS ARE CLOSED
                // ==================================

                if (
                    !shopStatus.isOrderTakingOpen
                ) {

                    alert(
                        "🔴 Online order taking is currently CLOSED.\n\nPlease try again when orders are open."
                    );

                    return;

                }


                // ==================================
                // DISABLE BUTTON
                // ==================================

                const button =
                    document.getElementById(
                        "placeOrderBtn"
                    );


                button.disabled = true;


                button.innerHTML =
                    "⏳ Placing Order...";


                // ==================================
                // SEND TO BACKEND
                // ==================================

                const response =
                    await fetch(
                        "https://mm-khakhra-ecommerce.onrender.com/api/orders",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    orderData
                                )

                        }
                    );


                const data =
                    await response.json();


                // ==================================
                // SUCCESS
                // ==================================

                if (response.ok) {


                    // ========================================
                    // MARK DISCOUNT CODE AS USED
                    // ========================================

                    if (appliedDiscountCode) {

                        try {

                            await fetch(
                                "https://mm-khakhra-ecommerce.onrender.com/api/discounts/use",
                                {

                                    method: "PUT",

                                    headers: {

                                        "Content-Type":
                                            "application/json"

                                    },

                                    body:
                                        JSON.stringify({

                                            code:
                                                appliedDiscountCode,

                                            userId:
                                                user.id

                                        })

                                }
                            );

                        }
                        catch (error) {

                            console.error(
                                "Discount Usage Error:",
                                error
                            );

                        }

                    }


                    // ========================================
                    // CLEAR CART
                    // ========================================

                    localStorage.removeItem("cart");


                    // ========================================
                    // SHOW DISCOUNT CARD ONLY IF IT WAS
                    // A NEW FIRST-PURCHASE DISCOUNT
                    // ========================================

                    if (
                        data.discount &&
                        !appliedDiscountCode
                    ) {

                        const discountCode =
                            data.discount.code;


                        document.getElementById(
                            "discountCode"
                        ).textContent =
                            discountCode;


                        document.getElementById(
                            "discountModal"
                        ).classList.add("show");

                    }
                    else {

                        window.location.href =
                            "profile.html";

                    }

                }


                // ==================================
                // ORDER FAILED
                // ==================================

                else {

                    alert(
                        "❌ " +
                        (
                            data.message ||
                            "Failed to place order."
                        )
                    );


                    button.disabled = false;


                    button.innerHTML =
                        '<i class="fa-solid fa-check"></i> Place Order';

                }

            }


            // ==================================
            // CONNECTION ERROR
            // ==================================

            catch (error) {

                console.error(
                    "Order Error:",
                    error
                );


                alert(
                    "❌ Unable to connect to server. Please make sure your backend is running."
                );


                const button =
                    document.getElementById(
                        "placeOrderBtn"
                    );


                button.disabled = false;


                button.innerHTML =
                    '<i class="fa-solid fa-check"></i> Place Order';

            }

        }
    );


// ========================================
// CLOSE DISCOUNT CARD
// ========================================

function closeDiscountCard() {

    document
        .getElementById("discountModal")
        .classList.remove("show");


    window.location.href =
        "profile.html";

}


// ========================================
// COPY DISCOUNT CODE
// ========================================

function copyDiscountCode() {

    const code =
        document
            .getElementById("discountCode")
            .textContent;


    navigator.clipboard.writeText(code);


    document.getElementById(
        "copyMessage"
    ).textContent =
        "✓ Discount code copied!";

}


// ========================================
// CONTINUE SHOPPING
// ========================================

function continueAfterDiscount() {

    window.location.href =
        "products.html";

}


// ========================================
// APPLY DISCOUNT CODE
// ========================================

async function applyDiscount() {

    const codeInput =
        document.getElementById(
            "discountCodeInput"
        );


    const message =
        document.getElementById(
            "discountMessage"
        );


    const applyButton =
        document.getElementById(
            "applyDiscountBtn"
        );


    const code =
        codeInput.value.trim();


    // ==================================
    // CHECK EMPTY CODE
    // ==================================

    if (!code) {

        message.textContent =
            "⚠️ Please enter a discount code.";

        message.style.color =
            "#c94b4b";

        return;

    }


    try {

        applyButton.disabled = true;

        applyButton.textContent =
            "Checking...";


        // ==================================
        // VALIDATE DISCOUNT
        // ==================================

        const response =
            await fetch(
                "https://mm-khakhra-ecommerce.onrender.com/api/discounts/validate",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            code: code,

                            userId: user.id,

                            subtotal: subtotal

                        })

                }
            );


        const data =
            await response.json();


        // ==================================
        // INVALID DISCOUNT
        // ==================================

        if (!response.ok) {

            appliedDiscountCode = "";


            // Restore automatic discount
            // if order is ₹500 or above

            if (subtotal >= 500) {

                discountAmount =
                    automaticDiscountAmount;

            }
            else {

                discountAmount = 0;

            }


            message.textContent =
                "❌ " + data.message;


            message.style.color =
                "#c94b4b";


            // Update discount display

            if (discountAmount > 0) {

                discountRow.style.display =
                    "flex";

                discountDisplay.textContent =
                    "- ₹" +
                    discountAmount.toFixed(2);

            }
            else {

                discountRow.style.display =
                    "none";

            }


            updateTotal();

            return;

        }


        // ==================================
        // SAVE DISCOUNT
        // ==================================

        discountAmount =
            Number(
                data.discountAmount
            );


        appliedDiscountCode =
            data.code;


        // ==================================
        // UPDATE DISCOUNT DISPLAY
        // ==================================

        discountRow.style.display =
            "flex";


        discountDisplay.textContent =
            "- ₹" +
            discountAmount.toFixed(2);


        // ==================================
        // UPDATE TOTAL
        // ==================================

        updateTotal();


        // ==================================
        // SUCCESS MESSAGE
        // ==================================

        message.textContent =
            `✓ ${data.discountPercentage}% discount applied! You saved ₹${discountAmount.toFixed(2)}`;


        message.style.color =
            "#6d8c3d";


        // ==================================
        // DISABLE INPUT
        // ==================================

        codeInput.disabled = true;


        applyButton.textContent =
            "Applied ✓";


        applyButton.disabled =
            true;

    }


    // ==================================
    // DISCOUNT ERROR
    // ==================================

    catch (error) {

        console.error(
            "Discount Error:",
            error
        );


        message.textContent =
            "❌ Unable to verify discount code.";


        message.style.color =
            "#c94b4b";

    }


    // ==================================
    // RESTORE APPLY BUTTON
    // ==================================

    finally {

        if (!appliedDiscountCode) {

            applyButton.disabled =
                false;


            applyButton.textContent =
                "Apply";

        }

    }

}