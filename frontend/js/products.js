// ==========================================
// PRODUCTS
// ==========================================

const productContainer =
    document.querySelector(".product-container");

let allProducts = [];


// ==========================================
// BACKEND URL
// ==========================================

const API_URL =
    "http://192.168.0.104:5000";


// ==========================================
// PRODUCT IMAGE URL
// ==========================================

function getProductImage(image) {

    if (!image) {

        return "images/logo.png";

    }


    // New images uploaded from Admin
    return `${API_URL}/uploads/${image}`;

}


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    if (!productContainer) return;


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


        displayProducts(
            allProducts
        );


    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );


        productContainer.innerHTML = `

            <h2>
                Unable to load products.
            </h2>

        `;

    }

}


// ==========================================
// GET CURRENT USER WISHLIST KEY
// ==========================================

function getWishlistKey() {

    const storedUser =
        localStorage.getItem("user");


    if (!storedUser) {

        return null;

    }


    const user =
        JSON.parse(storedUser);


    const userId =
        user._id ||
        user.id ||
        user.email;


    return "wishlist_" + userId;

}


// ==========================================
// GET CURRENT USER WISHLIST
// ==========================================

function getUserWishlist() {

    const wishlistKey =
        getWishlistKey();


    if (!wishlistKey) {

        return [];

    }


    return JSON.parse(
        localStorage.getItem(
            wishlistKey
        )
    ) || [];

}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(products) {

    if (!productContainer) return;


    productContainer.innerHTML = "";


    if (products.length === 0) {

        productContainer.innerHTML =
            "<h2>No Products Found</h2>";

        return;

    }


    // Current user's wishlist

    const wishlist =
        getUserWishlist();


    products.forEach(product => {


        // Check wishlist

        const isWishlist =
            wishlist.some(
                item =>
                    item._id ===
                    product._id
            );


        const imageURL =
            getProductImage(
                product.image
            );


        productContainer.innerHTML += `

        <div class="card">


            <!-- BADGE -->

            <div class="badge">

                Best Seller

            </div>



            <!-- WISHLIST -->

            <div
                class="wishlist"
                onclick="toggleWishlist('${product._id}')"
                title="Wishlist">

                <i
                    class="${
                        isWishlist
                            ? "fa-solid fa-heart"
                            : "fa-regular fa-heart"
                    }"
                    id="heart-${product._id}">
                </i>

            </div>



            <!-- PRODUCT IMAGE -->

            <img
                src="${imageURL}"
                alt="${product.name}"
                onerror="this.onerror=null; this.src='images/logo.png';"
            >



            <!-- CARD BODY -->

            <div class="card-body">


                <h3>

                    ${product.name}

                </h3>



                <p>

                    ${product.flavor}

                    •
                    
                    ${product.weight}

                </p>



                <div class="rating">

                    ⭐⭐⭐⭐⭐

                </div>



                <h4>

                    ₹${product.price}

                </h4>



                <div class="buttons">


                    <!-- ADD TO CART -->

                    <button
                        class="cart-btn"
                        onclick="addToCart('${product._id}')">

                        Add to Cart

                    </button>



                    <!-- VIEW DETAILS -->

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


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(id) {


    // Check login

    const user =
        localStorage.getItem(
            "user"
        );


    if (!user) {

        alert(
            "🔐 Please login first to add products to your cart."
        );


        window.location.href =
            "login.html";


        return;

    }



    // Find product

    const product =
        allProducts.find(
            p =>
                p._id === id
        );


    if (!product) {

        alert(
            "Product not found."
        );


        return;

    }



    // Get cart

    let cart =
        JSON.parse(
            localStorage.getItem(
                "cart"
            )
        ) || [];



    // Existing product

    const existing =
        cart.find(
            item =>
                item._id === id
        );



    if (existing) {

        existing.quantity += 1;

    }

    else {

        cart.push({

            _id:
                product._id,

            name:
                product.name,

            price:
                product.price,

            image:
                product.image,

            quantity:
                1

        });

    }



    // Save cart

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );



    // Update cart count

    updateCartCount();



    alert(
        "✅ Product added to cart successfully!"
    );

}


// ==========================================
// WISHLIST
// ==========================================

function toggleWishlist(id) {


    // Check login

    const storedUser =
        localStorage.getItem(
            "user"
        );


    if (!storedUser) {

        alert(
            "🔐 Please login first to use your wishlist."
        );


        window.location.href =
            "login.html";


        return;

    }



    // Find product

    const product =
        allProducts.find(
            p =>
                p._id === id
        );


    if (!product) {

        alert(
            "Product not found."
        );


        return;

    }



    // Wishlist key

    const wishlistKey =
        getWishlistKey();


    if (!wishlistKey) {

        return;

    }



    // Get wishlist

    let wishlist =
        JSON.parse(
            localStorage.getItem(
                wishlistKey
            )
        ) || [];



    // Existing index

    const existingIndex =
        wishlist.findIndex(
            item =>
                item._id === id
        );



    // REMOVE

    if (existingIndex !== -1) {


        wishlist.splice(
            existingIndex,
            1
        );


        localStorage.setItem(
            wishlistKey,
            JSON.stringify(
                wishlist
            )
        );


        alert(
            "💔 Removed from wishlist."
        );


    }


    // ADD

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


        localStorage.setItem(
            wishlistKey,
            JSON.stringify(
                wishlist
            )
        );


        alert(
            "❤️ Added to wishlist!"
        );

    }



    // Refresh

    displayProducts(
        getFilteredProducts()
    );

}


// ==========================================
// GET FILTERED PRODUCTS
// ==========================================

function getFilteredProducts() {

    let products =
        [...allProducts];



    const searchInput =
        document.getElementById(
            "search"
        );


    const flavorFilter =
        document.getElementById(
            "flavorFilter"
        );


    const weightFilter =
        document.getElementById(
            "weightFilter"
        );


    const sortPrice =
        document.getElementById(
            "sortPrice"
        );



    // SEARCH

    if (
        searchInput &&
        searchInput.value.trim() !== ""
    ) {


        const value =
            searchInput.value
                .toLowerCase()
                .trim();


        products =
            products.filter(
                product =>

                    product.name
                        .toLowerCase()
                        .includes(value)

                    ||

                    product.flavor
                        .toLowerCase()
                        .includes(value)

            );

    }



    // FLAVOR

    if (
        flavorFilter &&
        flavorFilter.value !== ""
    ) {


        products =
            products.filter(
                product =>

                    product.flavor ===
                    flavorFilter.value

            );

    }



    // WEIGHT

    if (
        weightFilter &&
        weightFilter.value !== ""
    ) {


        products =
            products.filter(
                product =>

                    product.weight ===
                    weightFilter.value

            );

    }



    // LOW TO HIGH

    if (
        sortPrice &&
        sortPrice.value === "low"
    ) {


        products.sort(
            (a, b) =>
                a.price -
                b.price
        );

    }



    // HIGH TO LOW

    if (
        sortPrice &&
        sortPrice.value === "high"
    ) {


        products.sort(
            (a, b) =>
                b.price -
                a.price
        );

    }



    return products;

}


// ==========================================
// SEARCH
// ==========================================

const searchInput =
    document.getElementById(
        "search"
    );


if (searchInput) {


    searchInput.addEventListener(
        "keyup",
        function () {


            displayProducts(
                getFilteredProducts()
            );

        }
    );

}


// ==========================================
// NAVBAR SEARCH
// ==========================================

const navbarSearch =
    document.getElementById(
        "navbarSearch"
    );


const navbarSearchBtn =
    document.getElementById(
        "navbarSearchBtn"
    );


if (
    navbarSearch &&
    navbarSearchBtn
) {


    navbarSearchBtn.addEventListener(
        "click",
        function () {


            const value =
                navbarSearch.value
                    .trim();


            if (value) {

                window.location.href =
                    `products.html?search=${encodeURIComponent(value)}`;

            }

        }
    );


    navbarSearch.addEventListener(
        "keydown",
        function (event) {


            if (
                event.key ===
                "Enter"
            ) {

                navbarSearchBtn.click();

            }

        }
    );

}


// ==========================================
// SEARCH FROM URL
// ==========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const urlSearch =
    urlParams.get(
        "search"
    );


if (
    urlSearch &&
    searchInput
) {


    searchInput.value =
        urlSearch;


    setTimeout(
        function () {

            displayProducts(
                getFilteredProducts()
            );

        },
        100
    );

}


// ==========================================
// FLAVOR FILTER
// ==========================================

const flavorFilter =
    document.getElementById(
        "flavorFilter"
    );


if (flavorFilter) {


    flavorFilter.addEventListener(
        "change",
        function () {


            displayProducts(
                getFilteredProducts()
            );

        }
    );

}


// ==========================================
// WEIGHT FILTER
// ==========================================

const weightFilter =
    document.getElementById(
        "weightFilter"
    );


if (weightFilter) {


    weightFilter.addEventListener(
        "change",
        function () {


            displayProducts(
                getFilteredProducts()
            );

        }
    );

}


// ==========================================
// PRICE SORT
// ==========================================

const sortPrice =
    document.getElementById(
        "sortPrice"
    );


if (sortPrice) {


    sortPrice.addEventListener(
        "change",
        function () {


            displayProducts(
                getFilteredProducts()
            );

        }
    );

}


// ==========================================
// CART COUNT
// ==========================================

function updateCartCount() {


    const cart =
        JSON.parse(
            localStorage.getItem(
                "cart"
            )
        ) || [];


    let count = 0;


    cart.forEach(item => {


        count +=
            Number(
                item.quantity
            ) || 0;

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


// ==========================================
// VIEW PRODUCT
// ==========================================

function viewProduct(id) {


    window.location.href =
        `product.html?id=${id}`;

}


// ==========================================
// ACCOUNT LINK
// ==========================================

const userIcon =
    document.getElementById(
        "userIcon"
    );


if (userIcon) {


    const user =
        localStorage.getItem(
            "user"
        );


    if (!user) {


        userIcon.href =
            "login.html";

    }

    else {


        const userData =
            JSON.parse(user);


        if (
            userData.role ===
            "admin"
        ) {


            userIcon.href =
                "admin-dashboard.html";

        }

        else {


            userIcon.href =
                "profile.html";

        }

    }

}


// ==========================================
// START
// ==========================================

loadProducts();

updateCartCount();