// ==========================================
// CHECK LOGIN
// ==========================================

const storedUser = localStorage.getItem("user");

if (!storedUser) {
    alert("🔐 Please login first to view your wishlist.");
    window.location.href = "login.html";
    throw new Error("User not logged in");
}

const user = JSON.parse(storedUser);


// ==========================================
// CREATE UNIQUE WISHLIST FOR EACH USER
// ==========================================

const wishlistKey =
    "wishlist_" + (user._id || user.id || user.email);


// ==========================================
// GET WISHLIST
// ==========================================

function getWishlist() {

    return JSON.parse(
        localStorage.getItem(wishlistKey)
    ) || [];

}


// ==========================================
// DISPLAY WISHLIST
// ==========================================

function displayWishlist() {

    const container =
        document.getElementById("wishlistContainer");

    if (!container) return;

    const wishlist = getWishlist();

    container.innerHTML = "";


    if (wishlist.length === 0) {

        container.innerHTML = `

            <div class="empty-wishlist"
                 style="grid-column: 1 / -1;">

                <i class="fa-regular fa-heart"></i>

                <h2>Your Wishlist is Empty</h2>

                <p>Add your favourite Khakhras here.</p>

                <a href="products.html"
                   class="shop-btn-wishlist">

                    Start Shopping

                </a>

            </div>

        `;

        return;
    }


    wishlist.forEach(product => {

        container.innerHTML += `

            <div class="wishlist-card">

                <img
                    src="images/${product.image}"
                    alt="${product.name}"
                >

                <div class="wishlist-body">

                    <h3>${product.name}</h3>

                    <p>
                        ${product.flavor || ""}
                        •
                        ${product.weight || ""}
                    </p>

                    <div class="wishlist-price">
                        ₹${product.price}
                    </div>

                    <div class="wishlist-buttons">

                        <button
                            class="cart-wishlist-btn"
                            onclick="addWishlistToCart('${product._id}')">

                            🛒 Cart

                        </button>

                        <button
                            class="remove-wishlist-btn"
                            onclick="removeFromWishlist('${product._id}')">

                            ❌ Remove

                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}


// ==========================================
// ADD WISHLIST PRODUCT TO CART
// ==========================================

function addWishlistToCart(id) {

    const wishlist = getWishlist();

    const product =
        wishlist.find(item => item._id === id);

    if (!product) return;


    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    const existing =
        cart.find(item => item._id === id);


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            _id: product._id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert("🛒 Product added to cart!");

    updateCartCount();

}


// ==========================================
// REMOVE FROM WISHLIST
// ==========================================

function removeFromWishlist(id) {

    let wishlist = getWishlist();


    wishlist = wishlist.filter(
        product => product._id !== id
    );


    localStorage.setItem(
        wishlistKey,
        JSON.stringify(wishlist)
    );


    displayWishlist();

}


// ==========================================
// CART COUNT
// ==========================================

function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let count = 0;


    cart.forEach(item => {

        count += Number(item.quantity) || 0;

    });


    const cartCount =
        document.getElementById("cartCount");


    if (cartCount) {

        cartCount.textContent = count;

    }

}


// ==========================================
// ACCOUNT LINK
// ==========================================

const accountLink =
    document.getElementById("accountLink");


if (accountLink) {

    if (user.role === "admin") {

        accountLink.href =
            "admin-dashboard.html";

    } else {

        accountLink.href =
            "profile.html";

    }

}


// ==========================================
// START
// ==========================================

displayWishlist();

updateCartCount();