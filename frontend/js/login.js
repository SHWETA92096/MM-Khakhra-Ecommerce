document.getElementById("loginForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("http://192.168.0.104:5000/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Login failed");
            return;

        }

        // ===============================
        // SAVE LOGIN INFORMATION
        // ===============================

        localStorage.setItem("token", data.token);

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        // ===============================
        // ROLE CHECK
        // ===============================

        if (data.user.role === "admin") {

            alert("Welcome Admin!");

            window.location.href = "admin-dashboard.html";

        } else {

            alert("Welcome " + data.user.name + "!");

            window.location.href = "profile.html";

        }

    } catch (error) {

        console.error("Login Error:", error);

        alert(
            "Cannot connect to server. Please make sure your backend is running."
        );

    }

});