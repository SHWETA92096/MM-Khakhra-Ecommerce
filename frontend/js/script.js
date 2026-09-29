// =====================================================
// HOME PAGE PRODUCTS
// =====================================================

const productContainer =
    document.querySelector(".product-container");

let allProducts = [];


// =====================================================
// BACKEND URL
// =====================================================

const API_URL =
    "https://mm-khakhra-ecommerce.onrender.com";


// =====================================================
// NAVBAR SEARCH
// =====================================================

const navbarSearch =
    document.getElementById("navbarSearch");

const navbarSearchBtn =
    document.getElementById("navbarSearchBtn");


// =====================================================
// SEARCH FUNCTION
// =====================================================

function performNavbarSearch() {

    if (!navbarSearch) {
        return;
    }

    const value =
        navbarSearch.value.trim();

    if (value === "") {

        alert("Please enter a product name.");

        return;

    }

    window.location.href =
        "products.html?search=" +
        encodeURIComponent(value);

}


// =====================================================
// SEARCH BUTTON
// =====================================================

if (navbarSearchBtn) {

    navbarSearchBtn.addEventListener(
        "click",
        performNavbarSearch
    );

}


// =====================================================
// SEARCH ENTER KEY
// =====================================================

if (navbarSearch) {

    navbarSearch.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                performNavbarSearch();

            }

        }
    );

}


// =====================================================
// LOAD PRODUCTS FROM BACKEND
// =====================================================

async function loadProducts() {

    if (!productContainer) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/products`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load products"
            );

        }


        allProducts =
            await response.json();


        console.log(
            "Products loaded:",
            allProducts
        );


        productContainer.innerHTML = "";


        // =================================================
        // NO PRODUCTS
        // =================================================

        if (
            !Array.isArray(allProducts) ||
            allProducts.length === 0
        ) {

            productContainer.innerHTML = `

                <div class="no-products">

                    <h3>
                        No products available.
                    </h3>

                    <p>
                        Please add products from admin panel.
                    </p>

                </div>

            `;

            return;

        }


        // =================================================
        // SHOW FIRST 8 PRODUCTS
        // =================================================

        allProducts
            .slice(0, 8)
            .forEach(product => {

                // -----------------------------------------
                // IMAGE URL
                // -----------------------------------------

                let imageUrl =
                    `${API_URL}/uploads/${product.image}`;


                // -----------------------------------------
                // PRODUCT CARD
                // -----------------------------------------

                productContainer.innerHTML += `

                    <div class="card">


                        <!-- BEST SELLER -->

                        <div class="badge">

                            Best Seller

                        </div>


                        <!-- WISHLIST -->

                        <div
                            class="wishlist"
                            onclick="toggleWishlist('${product._id}')"
                            title="Add to Wishlist">

                            <i class="fa-regular fa-heart"></i>

                        </div>


                        <!-- PRODUCT IMAGE -->

                        <img
                            src="${imageUrl}"
                            alt="${product.name}"
                            class="product-card-image"
                            onerror="this.onerror=null; this.src='images/logo.png';"
                        >


                        <!-- CARD BODY -->

                        <div class="card-body">


                            <h3>

                                ${product.name}

                            </h3>


                            <p>

                                ${product.flavor || ""}
                                •
                                ${product.weight || ""}

                            </p>


                            <div class="rating">

                                ⭐⭐⭐⭐⭐

                            </div>


                            <h4>

                                ₹${product.price}

                            </h4>


                            <!-- BUTTONS -->

                            <div class="buttons">


                                <button
                                    class="cart-btn"
                                    onclick="addToCart('${product._id}')">

                                    Add to Cart

                                </button>


                                <button
                                    class="buy-btn"
                                    onclick="viewProduct('${product._id}')">

                                    View Details

                                </button>


                            </div>


                        </div>


                    </div>

                `;

            });


    }

    catch (error) {

        console.error(
            "Error loading products:",
            error
        );


        productContainer.innerHTML = `

            <div class="no-products">

                <h3>
                    Unable to load products.
                </h3>

                <p>
                    Please make sure the backend server is running.
                </p>

            </div>

        `;

    }

}


// =====================================================
// VIEW PRODUCT
// =====================================================

function viewProduct(id) {

    window.location.href =
        `product.html?id=${id}`;

}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(id) {


    // -------------------------------------------------
    // CHECK LOGIN
    // -------------------------------------------------

    const userData =
        localStorage.getItem("user");


    if (!userData) {

        alert(
            "🔐 Please login first to add products to your cart."
        );

        window.location.href =
            "login.html";

        return;

    }


    // -------------------------------------------------
    // FIND PRODUCT
    // -------------------------------------------------

    const product =
        allProducts.find(
            product =>
                product._id === id
        );


    if (!product) {

        alert(
            "❌ Product not found."
        );

        return;

    }


    // -------------------------------------------------
    // CHECK STOCK
    // -------------------------------------------------

    if (
        Number(product.stock || 0) <= 0
    ) {

        alert(
            "❌ This product is out of stock."
        );

        return;

    }


    // -------------------------------------------------
    // GET CART
    // -------------------------------------------------

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    // -------------------------------------------------
    // CHECK EXISTING PRODUCT
    // -------------------------------------------------

    const existingProduct =
        cart.find(
            item =>
                item._id === id
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    }

    else {

        cart.push({

            _id:
                product._id,

            name:
                product.name,

            price:
                Number(product.price),

            image:
                product.image,

            quantity:
                1

        });

    }


    // -------------------------------------------------
    // SAVE CART
    // -------------------------------------------------

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    // -------------------------------------------------
    // UPDATE CART
    // -------------------------------------------------

    updateCartCount();


    // -------------------------------------------------
    // SUCCESS
    // -------------------------------------------------

    alert(
        "✅ Product added to cart successfully!"
    );

}


// =====================================================
// WISHLIST
// =====================================================

function toggleWishlist(id) {

    const userData =
        localStorage.getItem("user");


    if (!userData) {

        alert(
            "🔐 Please login first to use your wishlist."
        );

        window.location.href =
            "login.html";

        return;

    }


    const product =
        allProducts.find(
            product =>
                product._id === id
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    const user =
        JSON.parse(userData);


    const userId =
        user._id ||
        user.id ||
        user.email;


    const wishlistKey =
        "wishlist_" + userId;


    let wishlist =
        JSON.parse(
            localStorage.getItem(wishlistKey)
        ) || [];


    const existingIndex =
        wishlist.findIndex(
            item =>
                item._id === id
        );


    // -------------------------------------------------
    // REMOVE
    // -------------------------------------------------

    if (existingIndex !== -1) {

        wishlist.splice(
            existingIndex,
            1
        );


        alert(
            "💔 Removed from wishlist."
        );

    }

    // -------------------------------------------------
    // ADD
    // -------------------------------------------------

    else {

        wishlist.push({

            _id:
                product._id,

            name:
                product.name,

            flavor:
                product.flavor,

            weight:
                product.weight,

            price:
                product.price,

            image:
                product.image

        });


        alert(
            "❤️ Added to wishlist!"
        );

    }


    localStorage.setItem(
        wishlistKey,
        JSON.stringify(wishlist)
    );

}


// =====================================================
// CART COUNT
// =====================================================

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
        document.getElementById(
            "cartCount"
        );


    if (cartCount) {

        cartCount.textContent =
            count;

    }

}


// =====================================================
// ACCOUNT / LOGIN ICON
// =====================================================

function updateAccountLink() {

    const accountLink =
        document.getElementById(
            "accountLink"
        );


    if (!accountLink) {
        return;
    }


    const userData =
        localStorage.getItem("user");


    // -------------------------------------------------
    // NOT LOGGED IN
    // -------------------------------------------------

    if (!userData) {

        accountLink.href =
            "login.html";

        accountLink.title =
            "Login";

        return;

    }


    // -------------------------------------------------
    // LOGGED IN
    // -------------------------------------------------

    try {

        const user =
            JSON.parse(userData);


        if (
            user.role === "admin"
        ) {

            accountLink.href =
                "admin-dashboard.html";

            accountLink.title =
                "Admin Dashboard";

        }

        else {

            accountLink.href =
                "profile.html";

            accountLink.title =
                "My Account";

        }

    }

    catch (error) {

        console.error(
            "Invalid user data:",
            error
        );


        localStorage.removeItem(
            "user"
        );


        accountLink.href =
            "login.html";

    }

}


// =====================================================
// PAGE LOAD
// =====================================================

loadProducts();

updateCartCount();

updateAccountLink();