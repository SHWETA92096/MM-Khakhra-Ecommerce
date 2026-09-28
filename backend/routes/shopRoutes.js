const express = require("express");
const router = express.Router();

const ShopSettings = require("../models/ShopSettings");

// GET shop order-taking status
router.get("/status", async (req, res) => {
    try {
        let settings = await ShopSettings.findOne();

        // Create default settings if none exist
        if (!settings) {
            settings = await ShopSettings.create({
                isOrderTakingOpen: true
            });
        }

        res.status(200).json({
            isOrderTakingOpen: settings.isOrderTakingOpen
        });

    } catch (error) {
        console.error("Shop status error:", error);

        res.status(500).json({
            message: "Failed to get shop status"
        });
    }
});


// UPDATE shop order-taking status
router.put("/status", async (req, res) => {
    try {
        const { isOrderTakingOpen } = req.body;

        if (typeof isOrderTakingOpen !== "boolean") {
            return res.status(400).json({
                message: "isOrderTakingOpen must be true or false"
            });
        }

        const settings = await ShopSettings.findOneAndUpdate(
            {},
            {
                isOrderTakingOpen: isOrderTakingOpen
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        res.status(200).json({
            message: isOrderTakingOpen
                ? "Online order taking is now OPEN"
                : "Online order taking is now CLOSED",
            isOrderTakingOpen: settings.isOrderTakingOpen
        });

    } catch (error) {
        console.error("Shop status update error:", error);

        res.status(500).json({
            message: "Failed to update shop status"
        });
    }
});

module.exports = router;