// ==========================================
// PRODUCT DETAILS PAGE
// ==========================================

// Get Product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Store current product
let currentProduct = null;


// ==========================================
// LOAD PRODUCT
// ==========================================

async function loadProduct() {

    try {

        // Check Product ID
        if (!productId) {

            alert("Product not found.");

            window.location.href = "products.html";

            return;

        }


        // Fetch product from backend
        const response = await fetch(
            `https://mm-khakhra-ecommerce.onrender.com/api/products/${productId}`
        );


        if (!response.ok) {

            throw new Error("Product not found");

        }


        const product = await response.json();

        currentProduct = product;


        // ==========================================
        // DISPLAY PRODUCT IMAGE
        // ==========================================

        const productImage =
            document.getElementById("productImage");


        if (product.image) {

            productImage.src =
                `https://mm-khakhra-ecommerce.onrender.com/uploads/${product.image}`;

        } else {

            productImage.src =
                "images/logo.png";

        }


        // Image fallback
        productImage.onerror = function () {

            this.src = "images/logo.png";

        };


        // ==========================================
        // PRODUCT INFORMATION
        // ==========================================

        document.getElementById("productName").textContent =
            product.name || "";


        document.getElementById("productPrice").textContent =
            `₹${product.price || 0}`;


        document.getElementById("productDescription").textContent =
            product.description || "";


        document.getElementById("productFlavor").textContent =
            product.flavor || "";


        document.getElementById("productWeight").textContent =
            product.weight || "";


        // ==========================================
        // STOCK
        // ==========================================

        const stockElement =
            document.getElementById("productStock");


        if (product.stock > 0) {

            stockElement.textContent =
                `In Stock ✅ (${product.stock} available)`;

        } else {

            stockElement.textContent =
                "Out of Stock ❌";

        }


        // ==========================================
        // QUANTITY INPUT
        // ==========================================

        const quantityInput =
            document.querySelector(".quantity input");


        if (quantityInput) {

            quantityInput.value = 1;

            quantityInput.min = 1;


            if (product.stock > 0) {

                quantityInput.max =
                    product.stock;

            }

        }


        // ==========================================
        // DISABLE BUTTONS IF OUT OF STOCK
        // ==========================================

        if (product.stock <= 0) {

            const cartButton =
                document.querySelector(".cart-btn");

            const buyButton =
                document.querySelector(".buy-btn");


            if (cartButton) {

                cartButton.disabled = true;

            }


            if (buyButton) {

                buyButton.disabled = true;

            }

        }


    } catch (error) {

        console.error(
            "Error loading product:",
            error
        );


        alert(
            "Unable to load product."
        );


        window.location.href =
            "products.html";

    }

}


// ==========================================
// QUANTITY BUTTONS
// ==========================================

const quantityContainer =
    document.querySelector(".quantity");


if (quantityContainer) {


    const minusButton =
        quantityContainer.querySelector(
            "button:first-child"
        );


    const plusButton =
        quantityContainer.querySelector(
            "button:last-child"
        );


    const quantityInput =
        quantityContainer.querySelector(
            "input"
        );


    // ==========================================
    // MINUS BUTTON
    // ==========================================

    if (minusButton) {

        minusButton.addEventListener(
            "click",
            function () {

                let quantity =
                    parseInt(
                        quantityInput.value
                    ) || 1;


                if (quantity > 1) {

                    quantity--;

                    quantityInput.value =
                        quantity;

                }

            }
        );

    }


    // ==========================================
    // PLUS BUTTON
    // ==========================================

    if (plusButton) {

        plusButton.addEventListener(
            "click",
            function () {

                let quantity =
                    parseInt(
                        quantityInput.value
                    ) || 1;


                if (!currentProduct) {

                    return;

                }


                // Check stock
                if (
                    quantity <
                    currentProduct.stock
                ) {

                    quantity++;

                    quantityInput.value =
                        quantity;

                } else {

                    alert(
                        `Only ${currentProduct.stock} item(s) available in stock.`
                    );

                }

            }
        );

    }


    // ==========================================
    // MANUAL QUANTITY INPUT
    // ==========================================

    if (quantityInput) {

        quantityInput.addEventListener(
            "change",
            function () {

                let quantity =
                    parseInt(
                        quantityInput.value
                    ) || 1;


                // Minimum
                if (quantity < 1) {

                    quantity = 1;

                }


                // Maximum stock
                if (
                    currentProduct &&
                    quantity >
                    currentProduct.stock
                ) {

                    quantity =
                        currentProduct.stock;


                    alert(
                        `Only ${currentProduct.stock} item(s) available in stock.`
                    );

                }


                quantityInput.value =
                    quantity;

            }
        );

    }

}


// ==========================================
// ADD TO CART
// ==========================================

const cartButton =
    document.querySelector(".cart-btn");


if (cartButton) {

    cartButton.addEventListener(
        "click",
        function () {


            // ==================================
            // CHECK LOGIN
            // ==================================

            const user =
                localStorage.getItem("user");


            if (!user) {

                alert(
                    "🔐 Please login first to add products to your cart."
                );


                window.location.href =
                    "login.html";


                return;

            }


            // ==================================
            // CHECK PRODUCT
            // ==================================

            if (!currentProduct) {

                alert(
                    "Product is still loading."
                );


                return;

            }


            // ==================================
            // CHECK STOCK
            // ==================================

            if (
                currentProduct.stock <= 0
            ) {

                alert(
                    "❌ This product is currently out of stock."
                );


                return;

            }


            // ==================================
            // GET QUANTITY
            // ==================================

            const quantityInput =
                document.querySelector(
                    ".quantity input"
                );


            const quantity =
                parseInt(
                    quantityInput.value
                ) || 1;


            // ==================================
            // GET CART
            // ==================================

            let cart =
                JSON.parse(
                    localStorage.getItem(
                        "cart"
                    )
                ) || [];


            // ==================================
            // CHECK EXISTING PRODUCT
            // ==================================

            const existingProduct =
                cart.find(
                    item =>
                        item._id ===
                        currentProduct._id
                );


            if (existingProduct) {


                const newQuantity =
                    existingProduct.quantity +
                    quantity;


                // Check stock
                if (
                    newQuantity >
                    currentProduct.stock
                ) {

                    alert(
                        `Only ${currentProduct.stock} item(s) available in stock.`
                    );


                    return;

                }


                existingProduct.quantity =
                    newQuantity;


            } else {


                // Add new product
                cart.push({

                    _id:
                        currentProduct._id,

                    name:
                        currentProduct.name,

                    price:
                        Number(
                            currentProduct.price
                        ),

                    image:
                        currentProduct.image,

                    quantity:
                        quantity

                });

            }


            // ==================================
            // SAVE CART
            // ==================================

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            // ==================================
            // UPDATE CART COUNT
            // ==================================

            updateCartCount();


            alert(
                "✅ Product added to cart successfully!"
            );

        }
    );

}

// ==========================================
// PRODUCT WISHLIST
// ==========================================

const wishlistProductBtn =
    document.getElementById("wishlistProductBtn");

const wishlistProductIcon =
    document.getElementById("wishlistProductIcon");


function getWishlistKey() {

    const storedUser =
        localStorage.getItem("user");

    if (!storedUser) {
        return null;
    }

    const user =
        JSON.parse(storedUser);

    return (
        "wishlist_" +
        (user._id ||
            user.id ||
            user.email)
    );
}


function updateProductWishlistButton() {

    if (!currentProduct) return;

    const wishlistKey =
        getWishlistKey();

    if (!wishlistKey) return;

    const wishlist =
        JSON.parse(
            localStorage.getItem(wishlistKey)
        ) || [];

    const isWishlist =
        wishlist.some(
            item =>
                item._id ===
                currentProduct._id
        );


    if (isWishlist) {

        wishlistProductIcon.classList.remove(
            "fa-regular"
        );

        wishlistProductIcon.classList.add(
            "fa-solid"
        );

        wishlistProductBtn.innerHTML =
            '<i class="fa-solid fa-heart"></i> Remove from Wishlist';

    } else {

        wishlistProductIcon.classList.remove(
            "fa-solid"
        );

        wishlistProductIcon.classList.add(
            "fa-regular"
        );

        wishlistProductBtn.innerHTML =
            '<i class="fa-regular fa-heart"></i> Add to Wishlist';

    }

}


if (wishlistProductBtn) {

    wishlistProductBtn.addEventListener(
        "click",
        function () {

            // Check login

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {

                alert(
                    "🔐 Please login first to use wishlist."
                );

                window.location.href =
                    "login.html";

                return;
            }


            // Check product

            if (!currentProduct) {

                alert(
                    "Product is still loading."
                );

                return;
            }


            const wishlistKey =
                getWishlistKey();

            let wishlist =
                JSON.parse(
                    localStorage.getItem(
                        wishlistKey
                    )
                ) || [];


            // Check if already in wishlist

            const existingIndex =
                wishlist.findIndex(
                    item =>
                        item._id ===
                        currentProduct._id
                );


            if (existingIndex !== -1) {

                // Remove

                wishlist.splice(
                    existingIndex,
                    1
                );

                localStorage.setItem(
                    wishlistKey,
                    JSON.stringify(wishlist)
                );

                alert(
                    "💔 Removed from wishlist."
                );

            } else {

                // Add

                wishlist.push({

                    _id:
                        currentProduct._id,

                    name:
                        currentProduct.name,

                    flavor:
                        currentProduct.flavor,

                    weight:
                        currentProduct.weight,

                    price:
                        currentProduct.price,

                    image:
                        currentProduct.image

                });


                localStorage.setItem(
                    wishlistKey,
                    JSON.stringify(wishlist)
                );

                alert(
                    "❤️ Added to wishlist!"
                );

            }


            // Update button

            updateProductWishlistButton();

        }
    );

}


// ==========================================
// BUY NOW
// ==========================================

const buyButton =
    document.querySelector(".buy-btn");


if (buyButton) {

    buyButton.addEventListener(
        "click",
        function () {


            // ==================================
            // CHECK LOGIN
            // ==================================

            const user =
                localStorage.getItem("user");


            if (!user) {

                alert(
                    "🔐 Please login first to buy this product."
                );


                window.location.href =
                    "login.html";


                return;

            }


            // ==================================
            // CHECK PRODUCT
            // ==================================

            if (!currentProduct) {

                alert(
                    "Product is still loading."
                );


                return;

            }


            // ==================================
            // CHECK STOCK
            // ==================================

            if (
                currentProduct.stock <= 0
            ) {

                alert(
                    "❌ This product is currently out of stock."
                );


                return;

            }


            // ==================================
            // GET QUANTITY
            // ==================================

            const quantityInput =
                document.querySelector(
                    ".quantity input"
                );


            const quantity =
                parseInt(
                    quantityInput.value
                ) || 1;


            // ==================================
            // CHECK QUANTITY
            // ==================================

            if (
                quantity >
                currentProduct.stock
            ) {

                alert(
                    `Only ${currentProduct.stock} item(s) available in stock.`
                );


                return;

            }


            // ==================================
            // CREATE BUY NOW ITEM
            // ==================================

            const buyNowItem = {

                _id:
                    currentProduct._id,

                name:
                    currentProduct.name,

                price:
                    Number(
                        currentProduct.price
                    ),

                image:
                    currentProduct.image,

                quantity:
                    quantity

            };


            // ==================================
            // SAVE TO CART
            // ==================================

            localStorage.setItem(
                "cart",
                JSON.stringify(
                    [buyNowItem]
                )
            );


            // ==================================
            // GO TO CHECKOUT
            // ==================================

            window.location.href =
                "checkout.html";

        }
    );

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
// START
// ==========================================

loadProduct();

updateCartCount();

// ==========================================
// REVIEWS & RATINGS
// ==========================================

let selectedRating = 0;


// ==========================================
// CHECK LOGIN FOR REVIEW
// ==========================================

function checkReviewLogin() {

    const user =
        localStorage.getItem("user");

    const writeReviewCard =
        document.getElementById("writeReviewCard");

    const reviewLoginMessage =
        document.getElementById("reviewLoginMessage");


    if (!user) {

        if (writeReviewCard) {
            writeReviewCard.style.display = "none";
        }

        if (reviewLoginMessage) {
            reviewLoginMessage.style.display = "flex";
        }

    } else {

        if (writeReviewCard) {
            writeReviewCard.style.display = "block";
        }

        if (reviewLoginMessage) {
            reviewLoginMessage.style.display = "none";
        }

    }

}


// ==========================================
// STAR RATING
// ==========================================

const reviewStars =
    document.querySelectorAll(
        "#reviewStars i"
    );


reviewStars.forEach(star => {

    star.addEventListener(
        "click",
        function () {

            selectedRating =
                Number(
                    this.dataset.rating
                );


            reviewStars.forEach(
                (item, index) => {

                    if (
                        index <
                        selectedRating
                    ) {

                        item.classList.remove(
                            "fa-regular"
                        );

                        item.classList.add(
                            "fa-solid"
                        );

                    } else {

                        item.classList.remove(
                            "fa-solid"
                        );

                        item.classList.add(
                            "fa-regular"
                        );

                    }

                }
            );

        }
    );

});


// ==========================================
// LOAD REVIEWS
// ==========================================

async function loadReviews() {

    const reviewsList =
        document.getElementById(
            "reviewsList"
        );


    if (!reviewsList || !productId) {
        return;
    }


    try {

        const response =
            await fetch(
                `https://mm-khakhra-ecommerce.onrender.com/api/reviews/product/${productId}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load reviews"
            );

        }


        const reviews =
            await response.json();


        // No reviews
        if (reviews.length === 0) {

            reviewsList.innerHTML = `
                <div class="no-reviews">
                    <i class="fa-regular fa-comment"></i>
                    <p>No reviews yet.</p>
                    <span>Be the first to review this product!</span>
                </div>
            `;

            return;

        }


        // Display reviews
        reviewsList.innerHTML =
            reviews.map(review => {

                const stars =
                    "★".repeat(review.rating) +
                    "☆".repeat(5 - review.rating);


                const date =
                    new Date(
                        review.createdAt
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    );


                return `
                    <div class="review-card">

                        <div class="review-card-header">

                            <div class="review-user">

                                <div class="review-user-icon">
                                    <i class="fa-solid fa-user"></i>
                                </div>

                                <div>
                                    <h4>
                                        ${review.userName}
                                    </h4>

                                    <span>
                                        ${date}
                                    </span>
                                </div>

                            </div>

                            <div class="review-rating">
                                ${stars}
                            </div>

                        </div>

                        <p class="review-comment">
                            ${review.comment}
                        </p>

                    </div>
                `;

            }).join("");


    } catch (error) {

        console.error(
            "Load Reviews Error:",
            error
        );


        reviewsList.innerHTML = `
            <p class="review-error">
                Unable to load reviews.
            </p>
        `;

    }

}


// ==========================================
// SUBMIT REVIEW
// ==========================================

const submitReviewBtn =
    document.getElementById(
        "submitReviewBtn"
    );


if (submitReviewBtn) {

    submitReviewBtn.addEventListener(
        "click",
        async function () {


            // Check login
            const user =
                localStorage.getItem("user");


            if (!user) {

                alert(
                    "🔐 Please login to write a review."
                );

                window.location.href =
                    "login.html";

                return;

            }


            // Check rating
            if (selectedRating === 0) {

                alert(
                    "⭐ Please select a rating."
                );

                return;

            }


            // Get comment
            const comment =
                document.getElementById(
                    "reviewComment"
                ).value.trim();


            if (!comment) {

                alert(
                    "✍️ Please write a review."
                );

                return;

            }


            // Get JWT token
            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                alert(
                    "🔐 Your login session has expired. Please login again."
                );

                window.location.href =
                    "login.html";

                return;

            }


            try {

                submitReviewBtn.disabled =
                    true;

                submitReviewBtn.innerHTML =
                    `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Submitting...
                    `;


                const response =
                    await fetch(
                        "https://mm-khakhra-ecommerce.onrender.com/api/reviews",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                product:
                                    productId,

                                rating:
                                    selectedRating,

                                comment:
                                    comment

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        "❌ " +
                        (
                            data.message ||
                            "Failed to submit review."
                        )
                    );

                    return;

                }


                alert(
                    "✅ Review added successfully!"
                );


                // Clear form
                document.getElementById(
                    "reviewComment"
                ).value = "";


                selectedRating = 0;


                reviewStars.forEach(
                    star => {

                        star.classList.remove(
                            "fa-solid"
                        );

                        star.classList.add(
                            "fa-regular"
                        );

                    }
                );


                // Reload reviews
                loadReviews();


            } catch (error) {

                console.error(
                    "Submit Review Error:",
                    error
                );

                alert(
                    "❌ Unable to connect to backend."
                );

            } finally {

                submitReviewBtn.disabled =
                    false;

                submitReviewBtn.innerHTML =
                    `
                    <i class="fa-solid fa-paper-plane"></i>
                    Submit Review
                    `;

            }

        }
    );

}


// ==========================================
// START REVIEWS
// ==========================================

checkReviewLogin();

loadReviews();

// ==========================================
// DYNAMIC PRODUCT RATING
// ==========================================

async function loadProductRating() {
    const ratingElement =
        document.getElementById("productRating");

    if (!ratingElement || !productId) {
        return;
    }

    try {
        const response = await fetch(
            `https://mm-khakhra-ecommerce.onrender.com/api/reviews/product/${productId}`
        );

        if (!response.ok) {
            throw new Error("Unable to load ratings");
        }

        const reviews = await response.json();

        if (reviews.length === 0) {
            ratingElement.innerHTML =
                `⭐⭐⭐⭐⭐ <span>(0 reviews)</span>`;
            return;
        }

        let totalRating = 0;

        reviews.forEach(review => {
            totalRating += Number(review.rating);
        });

        const averageRating =
            (totalRating / reviews.length).toFixed(1);

        const roundedRating =
            Math.round(Number(averageRating));

        const stars =
            "⭐".repeat(roundedRating) +
            "☆".repeat(5 - roundedRating);

        ratingElement.innerHTML =
            `${stars} <span>(${averageRating} - ${reviews.length} reviews)</span>`;

    } catch (error) {
        console.error(
            "Load Product Rating Error:",
            error
        );
    }
}

loadProductRating();