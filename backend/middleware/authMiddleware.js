const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // No token
        if (!token) {
            return res.status(401).json({
                message: "Not authorized. Please login."
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user from token
        const user = await User.findById(decoded.id).select(
            "-password"
        );

        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {
        console.error("Authentication Error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

module.exports = {
    protect
};