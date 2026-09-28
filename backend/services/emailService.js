const nodemailer = require("nodemailer");

// ==========================================
// GMAIL EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// ==========================================
// SEND ORDER STATUS EMAIL
// ==========================================

async function sendOrderStatusEmail(order) {

    try {

        await transporter.sendMail({

            from: `"M M Khakhra" <${process.env.EMAIL_USER}>`,

            to: order.email,

            subject: `M M Khakhra - Order ${order.status}`,

            html: `

                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    border: 1px solid #eee;
                    border-radius: 12px;
                    overflow: hidden;
                ">

                    <div style="
                        background: #6d8c3d;
                        color: white;
                        padding: 25px;
                        text-align: center;
                    ">

                        <h1 style="margin:0;">
                            M M Khakhra
                        </h1>

                        <p>
                            Fresh • Crispy • Healthy
                        </p>

                    </div>


                    <div style="padding: 30px;">

                        <h2>
                            Hello ${order.customerName} 👋
                        </h2>

                        <p>
                            Your order status has been updated.
                        </p>


                        <div style="
                            background:#f6f8f3;
                            padding:20px;
                            border-radius:10px;
                            margin:20px 0;
                        ">

                            <p>
                                <strong>Order Status:</strong>
                                ${order.status}
                            </p>

                            <p>
                                <strong>Total Amount:</strong>
                                ₹${order.totalAmount}
                            </p>

                            <p>
                                <strong>Payment:</strong>
                                ${order.paymentMethod}
                            </p>

                        </div>


                        <p>
                            Thank you for shopping with
                            <strong>M M Khakhra</strong>.
                        </p>

                        <p>
                            We appreciate your order ❤️
                        </p>

                    </div>


                    <div style="
                        background:#f5f5f5;
                        padding:15px;
                        text-align:center;
                        font-size:13px;
                        color:#777;
                    ">

                        © 2026 M M Khakhra

                    </div>

                </div>

            `

        });

        console.log(
            `✅ Email sent to ${order.email}`
        );

    } catch (error) {

        console.error(
            "❌ Email sending error:",
            error.message
        );

    }

}

async function sendPasswordResetEmail(user, resetToken) {
    try {
        const resetLink =
    `http://127.0.0.1:5501/frontend/reset-password.html?token=${resetToken}`;
        await transporter.sendMail({
            from: `"M M Khakhra" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "M M Khakhra - Reset Your Password",

            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">

                    <h2 style="color: #6d8c3d;">
                        M M Khakhra
                    </h2>

                    <h3>Password Reset Request</h3>

                    <p>Hello ${user.name},</p>

                    <p>
                        We received a request to reset your password.
                        Click the button below to create a new password.
                    </p>

                    <a href="${resetLink}"
                       style="
                       display: inline-block;
                       padding: 12px 20px;
                       background: #6d8c3d;
                       color: white;
                       text-decoration: none;
                       border-radius: 6px;
                       margin: 15px 0;
                       ">
                        Reset Password
                    </a>

                    <p>
                        This link will expire in <strong>15 minutes</strong>.
                    </p>

                    <p>
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>

                    <p>
                        Thank you,<br>
                        <strong>M M Khakhra</strong>
                    </p>

                </div>
            `
        });

        console.log(`✅ Password reset email sent to ${user.email}`);

    } catch (error) {
        console.error(
            "❌ Password reset email error:",
            error.message
        );
    }
}

module.exports = {
    sendOrderStatusEmail,
    sendPasswordResetEmail
};