// ==========================================
// MANAGE USERS
// ==========================================


// ==========================================
// CHECK LOGIN
// ==========================================

const storedUser =
    localStorage.getItem("user");


const token =
    localStorage.getItem("token");


if (!storedUser || !token) {

    alert(
        "🔐 Please login first."
    );

    window.location.href =
        "login.html";

}


// ==========================================
// GET CURRENT USER
// ==========================================

const currentUser =
    JSON.parse(storedUser);


// ==========================================
// CHECK ADMIN ROLE
// ==========================================

if (
    currentUser.role !== "admin"
) {

    alert(
        "❌ Admin access required."
    );

    window.location.href =
        "index.html";

}


// ==========================================
// LOAD USERS
// ==========================================

async function loadUsers() {

    try {

        const response =
            await fetch(
                "https://mm-khakhra-ecommerce.onrender.com/api/users",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );


        // ==================================
        // CHECK RESPONSE
        // ==================================

        if (!response.ok) {

            const errorData =
                await response.json();

            throw new Error(
                errorData.message ||
                "Failed to load users"
            );

        }


        const users =
            await response.json();


        // ==================================
        // GET TABLE
        // ==================================

        const table =
            document.getElementById(
                "usersTable"
            );


        if (!table) {

            console.error(
                "Users table not found."
            );

            return;

        }


        table.innerHTML = "";


        // ==================================
        // NO USERS
        // ==================================

        if (
            !Array.isArray(users) ||
            users.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="
                            text-align:center;
                            padding:30px;
                        "
                    >

                        No users found.

                    </td>

                </tr>

            `;

            return;

        }


        // ==================================
        // DISPLAY USERS
        // ==================================

        users.forEach(
            user => {

                const date =
                    user.createdAt
                    ?
                    new Date(
                        user.createdAt
                    ).toLocaleDateString(
                        "en-IN"
                    )
                    :
                    "-";


                const role =
                    user.role || "user";


                table.innerHTML += `

                    <tr>

                        <!-- NAME -->

                        <td>

                            <strong>
                                ${user.name}
                            </strong>

                        </td>


                        <!-- EMAIL -->

                        <td>
                            ${user.email}
                        </td>


                        <!-- ROLE -->

                        <td>

                            <span
                                class="${
                                    role === "admin"
                                    ?
                                    "role-admin"
                                    :
                                    "role-user"
                                }"
                            >

                                ${
                                    role === "admin"
                                    ?
                                    "Admin"
                                    :
                                    "User"
                                }

                            </span>

                        </td>


                        <!-- JOINED DATE -->

                        <td>
                            ${date}
                        </td>


                        <!-- ACTION -->

                        <td>

                            ${
                                role === "admin"

                                ?

                                `
                                <span>

                                    <i
                                        class="fa-solid fa-shield-halved">
                                    </i>

                                    Admin

                                </span>
                                `

                                :

                                `
                                <button
                                    class="make-admin-btn"
                                    onclick="
                                        makeAdmin('${user._id}')
                                    "
                                >

                                    Make Admin

                                </button>
                                `

                            }

                        </td>

                    </tr>

                `;

            }
        );


    }

    catch (error) {

        console.error(
            "Users Error:",
            error
        );


        const table =
            document.getElementById(
                "usersTable"
            );


        if (table) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="
                            text-align:center;
                            padding:30px;
                            color:#e53935;
                        "
                    >

                        ❌ Unable to load users.

                        <br>

                        <small>
                            ${error.message}
                        </small>

                    </td>

                </tr>

            `;

        }

    }

}


// ==========================================
// MAKE USER ADMIN
// ==========================================

async function makeAdmin(
    id
) {

    const confirmAdmin =
        confirm(
            "Make this user an Admin?"
        );


    if (!confirmAdmin) {

        return;

    }


    try {

        const response =
            await fetch(
                `https://mm-khakhra-ecommerce.onrender.com/api/users/make-admin/${id}`,
                {

                    method: "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${localStorage.getItem("token")}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to change user role."
            );

        }


        alert(
            data.message ||
            "User promoted to Admin"
        );


        // Reload users
        loadUsers();


    }

    catch (error) {

        console.error(
            "Make Admin Error:",
            error
        );


        alert(
            "❌ " +
            (
                error.message ||
                "Unable to change user role."
            )
        );

    }

}


// ==========================================
// LOAD USERS WHEN PAGE OPENS
// ==========================================

loadUsers();