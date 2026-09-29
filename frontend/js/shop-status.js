// ==========================================
// CHECK ONLINE ORDER STATUS
// ==========================================

async function checkOrderStatus() {

    const banner = document.getElementById("orderStatusBanner");

    // If this page doesn't have the banner, stop
    if (!banner) {
        return;
    }

    try {

        const response = await fetch(
            "https://mm-khakhra-ecommerce.onrender.com/api/shop/status"
        );

        if (!response.ok) {
            throw new Error("Failed to get shop status");
        }

        const data = await response.json();


        // ==========================================
        // ORDERS OPEN
        // ==========================================

        if (data.isOrderTakingOpen) {

            banner.className = "order-status-banner open";

            banner.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                <span>
                    Online Orders are <strong>OPEN</strong>
                </span>
            `;

        }


        // ==========================================
        // ORDERS CLOSED
        // ==========================================

        else {

            banner.className = "order-status-banner closed";

            banner.innerHTML = `
<i class="fa-solid fa-store-slash"></i>

<span>
    <strong>Online Orders are Currently Closed</strong>
    &nbsp;•&nbsp;
    Please visit again during business hours.
</span>
`;

        }


    } catch (error) {

        console.error(
            "Order Status Error:",
            error
        );

        banner.className =
            "order-status-banner error";

        banner.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>
                Unable to check order status.
            </span>
        `;

    }

}


// ==========================================
// CHECK WHEN PAGE LOADS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    checkOrderStatus
);


// ==========================================
// CHECK AGAIN EVERY 30 SECONDS
// ==========================================

setInterval(
    checkOrderStatus,
    30000
);