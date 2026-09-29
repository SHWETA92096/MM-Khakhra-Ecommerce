// ==========================================
// ADMIN MESSAGE MANAGEMENT
// ==========================================


// ==========================================
// CHECK LOGIN
// ==========================================

const storedUser =
    localStorage.getItem("user");


if (!storedUser) {

    alert("🔐 Please login first.");

    window.location.href =
        "login.html";

}


// ==========================================
// GET USER
// ==========================================

const user =
    JSON.parse(storedUser);


// ==========================================
// CHECK ADMIN
// ==========================================

if (user.role !== "admin") {

    alert("❌ Admin access required.");

    window.location.href =
        "index.html";

}


// ==========================================
// LOAD MESSAGES
// ==========================================

async function loadMessages() {

    try {

        const response =
            await fetch(
                "http://192.168.0.104:5000/api/contact"
            );


        const messages =
            await response.json();


        const table =
            document.getElementById(
                "messagesTable"
            );


        table.innerHTML = "";


        if (!messages.length) {

            table.innerHTML = `

                <tr>

                    <td colspan="6">

                        No contact messages found.

                    </td>

                </tr>

            `;

            return;

        }


        messages.forEach(message => {


            const date =
                new Date(
                    message.createdAt
                ).toLocaleDateString(
                    "en-IN"
                );


            table.innerHTML += `

                <tr>

                    <td>
                        ${message.name}
                    </td>


                    <td>
                        ${message.email}
                    </td>


                    <td>
                        ${message.phone}
                    </td>


                    <td class="message-text">

                        ${message.message}

                    </td>


                    <td class="date-text">

                        ${date}

                    </td>


                    <td>

                        <select
                            class="status-select"
                            onchange="
                                changeMessageStatus(
                                    '${message._id}',
                                    this.value
                                )
                            ">

                            <option
                                value="New"
                                ${message.status === "New"
                                    ? "selected"
                                    : ""}>

                                New

                            </option>


                            <option
                                value="Read"
                                ${message.status === "Read"
                                    ? "selected"
                                    : ""}>

                                Read

                            </option>


                            <option
                                value="Replied"
                                ${message.status === "Replied"
                                    ? "selected"
                                    : ""}>

                                Replied

                            </option>

                        </select>

                    </td>

                </tr>

            `;

        });


    } catch (error) {

        console.error(
            "Message Error:",
            error
        );


        const table =
            document.getElementById(
                "messagesTable"
            );


        table.innerHTML = `

            <tr>

                <td colspan="6">

                    ❌ Unable to load messages.

                    Please make sure the backend
                    server is running.

                </td>

            </tr>

        `;

    }

}


// ==========================================
// CHANGE MESSAGE STATUS
// ==========================================

async function changeMessageStatus(
    id,
    status
) {

    try {

        const response =
            await fetch(
                `http://192.168.0.104:5000/api/contact/${id}/status`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                "❌ " +
                (data.message ||
                "Unable to update status.")
            );

            return;

        }


        alert(
            "✅ Message status updated to " +
            status
        );


        loadMessages();


    } catch (error) {

        console.error(
            "Status Error:",
            error
        );


        alert(
            "❌ Server error. Please try again."
        );

    }

}


// ==========================================
// START
// ==========================================

loadMessages();