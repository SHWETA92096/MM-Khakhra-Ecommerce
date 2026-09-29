// ==========================================
// ADMIN REVIEW MANAGEMENT
// ==========================================

const adminReviewsList =
    document.getElementById("adminReviewsList");


// ==========================================
// LOAD ALL REVIEWS
// ==========================================

async function loadAdminReviews() {

    if (!adminReviewsList) {
        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {

        adminReviewsList.innerHTML = `
            <div class="admin-empty">

                <i class="fa-solid fa-lock"></i>

                <h3>
                    Login Required
                </h3>

                <p>
                    Please login as an admin to view reviews.
                </p>

            </div>
        `;

        return;
    }


    try {

        const response =
            await fetch(
                "http://192.168.0.104:5000/api/reviews/admin/all",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const reviews =
            await response.json();


        if (!response.ok) {

            throw new Error(
                reviews.message ||
                "Unable to load reviews"
            );

        }


        // ==========================
        // NO REVIEWS
        // ==========================

        if (reviews.length === 0) {

            adminReviewsList.innerHTML = `
                <div class="admin-empty">

                    <i class="fa-regular fa-comment"></i>

                    <h3>
                        No Reviews Yet
                    </h3>

                    <p>
                        Customer reviews will appear here.
                    </p>

                </div>
            `;

            return;

        }


        // ==========================
        // DISPLAY REVIEWS
        // ==========================

        adminReviewsList.innerHTML =
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


                const productName =
                    review.product
                        ? review.product.name
                        : "Product unavailable";


                const userName =
                    review.user
                        ? review.user.name
                        : review.userName;


                const userEmail =
                    review.user
                        ? review.user.email
                        : "";


                return `

                    <div class="admin-review-card">

                        <div class="admin-review-header">


                            <div class="admin-review-user">

                                <div class="admin-review-icon">

                                    <i class="fa-solid fa-user"></i>

                                </div>


                                <div>

                                    <h3>
                                        ${userName}
                                    </h3>

                                    <p>
                                        ${userEmail}
                                    </p>

                                </div>

                            </div>


                            <div class="admin-review-rating">

                                ${stars}

                                <span>
                                    ${review.rating}/5
                                </span>

                            </div>

                        </div>


                        <div class="admin-review-product">

                            <i class="fa-solid fa-box"></i>

                            <strong>
                                Product:
                            </strong>

                            ${productName}

                        </div>


                        <div class="admin-review-comment">

                            <i class="fa-solid fa-quote-left"></i>

                            <p>
                                ${review.comment}
                            </p>

                        </div>


                        <div class="admin-review-footer">

    <span>

        <i class="fa-regular fa-calendar"></i>

        ${date}

    </span>

    <button
        class="delete-review-btn"
        onclick="deleteReview('${review._id}')">

        <i class="fa-solid fa-trash"></i>

        Delete Review

    </button>

</div>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(
            "Admin Reviews Error:",
            error
        );


        adminReviewsList.innerHTML = `

            <div class="admin-empty">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    Unable to Load Reviews
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

    }

}


// ==========================================
// ADMIN LOGOUT
// ==========================================

function adminLogout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href =
        "login.html";

}


// ==========================================
// START
// ==========================================

loadAdminReviews();

// ==========================================
// DELETE REVIEW
// ==========================================

async function deleteReview(reviewId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this review?"
        );

    if (!confirmDelete) {
        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {
        alert(
            "🔐 Please login as admin."
        );

        window.location.href =
            "login.html";

        return;
    }

    try {

        const response =
            await fetch(
                `http://192.168.0.104:5000/api/reviews/admin/${reviewId}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            alert(
                "❌ " +
                (
                    data.message ||
                    "Unable to delete review."
                )
            );

            return;
        }

        alert(
            "✅ Review deleted successfully!"
        );

        loadAdminReviews();

    } catch (error) {

        console.error(
            "Delete Review Error:",
            error
        );

        alert(
            "❌ Unable to connect to backend."
        );
    }
}
