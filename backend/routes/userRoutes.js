const express = require("express");
const router = express.Router();

const User = require("../models/User");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


// ==========================================
// GET ALL USERS
// Admin only
// ==========================================

router.get("/", protect, admin, async (req, res) => {

    try {

        const users = await User.find()
            .select("-password");

        res.status(200).json(users);

    } catch (error) {

        console.error("Get Users Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

});


// ==========================================
// MAKE USER ADMIN
// Admin only
// ==========================================

router.put(
    "/make-admin/:id",
    protect,
    admin,
    async (req, res) => {

        try {

            const user = await User.findByIdAndUpdate(
                req.params.id,
                { role: "admin" },
                {
                    new: true,
                    runValidators: true
                }
            ).select("-password");

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.status(200).json({
                message: "User promoted to Admin",
                user
            });

        } catch (error) {

            console.error(
                "Make Admin Error:",
                error
            );

            res.status(500).json({
                message: error.message
            });

        }

    }
);


module.exports = router;