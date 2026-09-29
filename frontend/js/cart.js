const cartContent = document.getElementById("cartContent");


// ==========================================
// LOAD CART
// ==========================================

function loadCart() {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {

        cartContent.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">

                    <i class="fa-solid fa-cart-shopping"></i>

                </div>

                <h2>Your Cart is Empty</h2>

                <p>
                    Looks like you haven't added any Khakhras yet.
                </p>

                <a
                    href="products.html"
                    class="shop-btn-cart">

                    <i class="fa-solid fa-bag-shopping"></i>
                    Start Shopping

                </a>

            </div>

        `;

        updateCartCount();

        return;
    }


    let subtotal = 0;

    let totalItems = 0;


    cart.forEach(item => {

        subtotal +=
            Number(item.price) *
            Number(item.quantity);

        totalItems +=
            Number(item.quantity);

    });


    const delivery =
        subtotal >= 499 ? 0 : 40;


    const total =
        subtotal + delivery;


    cartContent.innerHTML = `

        <div class="cart-layout">

            <!-- ================= ITEMS ================= -->

            <div class="cart-items-box">

                <div class="cart-box-title">

                    <h2>
                        Your Items
                    </h2>

                    <span id="itemCount">
                        ${totalItems} Items
                    </span>

                </div>


                <div>

                    ${cart.map((item, index) => `

                        <div class="cart-item">

                            <div class="cart-item-image">

                                <img
                                    src="https://mm-khakhra-ecommerce.onrender.com/uploads/${item.image}"
                                    alt="${item.name}"
                                    onerror="this.src='images/logo.png'"
                                >

                            </div>


                            <div class="cart-item-details">

                                <h3>
                                    ${item.name}
                                </h3>

                                <p>
                                    Fresh & Crispy Khakhra
                                </p>

                                <div class="cart-item-price">

                                    ₹${item.price}

                                </div>


                                <div class="quantity-box">

                                    <button
                                        onclick="decreaseQuantity(${index})">

                                        <i class="fa-solid fa-minus"></i>

                                    </button>


                                    <span>
                                        ${item.quantity}
                                    </span>


                                    <button
                                        onclick="increaseQuantity(${index})">

                                        <i class="fa-solid fa-plus"></i>

                                    </button>

                                </div>

                            </div>


                            <div class="cart-item-actions">

                                <strong>
                                    ₹${item.price * item.quantity}
                                </strong>

                                <br>

                                <button
                                    class="remove-btn"
                                    onclick="removeItem(${index})">

                                    <i class="fa-solid fa-trash"></i>
                                    Remove

                                </button>

                            </div>

                        </div>

                    `).join("")}

                </div>

            </div>


            <!-- ================= SUMMARY ================= -->

            <div class="cart-summary">

                <h2>
                    Order Summary
                </h2>


                <div class="summary-row">

                    <span>
                        Subtotal
                    </span>

                    <span>
                        ₹${subtotal}
                    </span>

                </div>


                <div class="summary-row">

                    <span>
                        Delivery
                    </span>

                    <span class="delivery-free">

                        ${
                            delivery === 0
                            ? "FREE"
                            : "₹" + delivery
                        }

                    </span>

                </div>


                ${
                    subtotal < 499
                    ? `
                        <p style="
                            font-size:13px;
                            color:#777;
                            background:#f7f9f2;
                            padding:10px;
                            border-radius:10px;
                        ">

                            Add ₹${499 - subtotal}
                            more for FREE delivery 🚚

                        </p>
                    `
                    : `
                        <p style="
                            font-size:13px;
                            color:#188754;
                            background:#eef8f0;
                            padding:10px;
                            border-radius:10px;
                        ">

                            🎉 You unlocked FREE delivery!

                        </p>
                    `
                }


                <div class="summary-row total">

                    <span>
                        Total
                    </span>

                    <span>
                        ₹${total}
                    </span>

                </div>


                <button
                    class="checkout-btn"
                    onclick="goToCheckout()">

                    <i class="fa-solid fa-lock"></i>

                    Proceed to Checkout

                </button>


                <a
                    href="products.html"
                    class="continue-btn">

                    ← Continue Shopping

                </a>


                <div class="secure-cart-box">

                    🔒 Secure Checkout<br>

                    Your order information is protected.

                </div>

            </div>

        </div>

    `;


    updateCartCount();

}


// ==========================================
// INCREASE QUANTITY
// ==========================================

function increaseQuantity(index) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    cart[index].quantity =
        Number(cart[index].quantity) + 1;


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    loadCart();

}


// ==========================================
// DECREASE QUANTITY
// ==========================================

function decreaseQuantity(index) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    loadCart();

}


// ==========================================
// REMOVE ITEM
// ==========================================

function removeItem(index) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    cart.splice(index, 1);


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    loadCart();

}


// ==========================================
// CART COUNT
// ==========================================

function updateCartCount() {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


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


// ==========================================
// CHECKOUT
// ==========================================

function goToCheckout() {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    if (cart.length === 0) {

        alert("🛒 Your cart is empty.");

        return;

    }


    const user =
        localStorage.getItem("user");


    if (!user) {

        alert(
            "🔐 Please login before checkout."
        );

        window.location.href =
            "login.html";

        return;

    }


    window.location.href =
        "checkout.html";

}


// ==========================================
// INITIAL LOAD
// ==========================================

loadCart();
updateCartCount();