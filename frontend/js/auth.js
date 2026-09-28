document.addEventListener("DOMContentLoaded", function () {

    const userIcon = document.getElementById("userIcon");

    if (!userIcon) {
        console.log("❌ userIcon not found");
        return;
    }

    const userData = localStorage.getItem("user");

    console.log("User data:", userData);

    // Not logged in
    if (!userData) {

        userIcon.onclick = function () {
            window.location.href = "login.html";
        };

        return;
    }

    // Logged in
    const user = JSON.parse(userData);

    console.log("Logged in:", user);

    userIcon.onclick = function () {

        if (user.role === "admin") {

            window.location.href = "admin-dashboard.html";

        } else {

            window.location.href = "profile.html";

        }

    };

});