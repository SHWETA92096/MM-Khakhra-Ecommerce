document.getElementById("signupForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("https://mm-khakhra-ecommerce.onrender.com/api/auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })

        });

        const data = await response.json();

        alert(data.message);

        if (response.ok) {

            // Clear form
            document.getElementById("signupForm").reset();

            // Redirect to login page
            window.location.href = "login.html";

        }

    }

    catch (error) {

        alert("Something went wrong!");

        console.error(error);

    }

});