const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

// JWT protected route
router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        message: "Authentication successful!",
        user: req.user
    });
});

// Admin-only test route
router.get("/admin-test", protect, admin, (req, res) => {
    res.status(200).json({
        message: "Admin authorization successful!",
        user: req.user
    });
});

module.exports = router;