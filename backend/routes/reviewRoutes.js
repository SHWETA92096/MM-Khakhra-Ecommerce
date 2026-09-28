const express = require("express");
const Review = require("../models/Review");
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();


// ==========================================
// ADD REVIEW
// ==========================================

router.post("/", protect, async (req, res) => {

    try {

        const {
            product,
            rating,
            comment
        } = req.body;


        // Get logged-in user from JWT
        const user = req.user._id;
        const userName = req.user.name;


        // Check required fields
        if (
            !product ||
            !rating ||
            !comment
        ) {
            return res.status(400).json({
                message: "All review fields are required"
            });
        }


        // Check rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }


        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            product: product,
            user: user
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this product"
            });
        }


        // Create review
        const review = await Review.create({
            product: product,
            user: user,
            userName: userName,
            rating: rating,
            comment: comment
        });


        res.status(201).json({
            message: "Review added successfully",
            review: review
        });


    } catch (error) {

        console.error("Add Review Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

});


// ==========================================
// GET REVIEWS FOR PRODUCT
// ==========================================

router.get("/product/:productId", async (req, res) => {

    try {

        const reviews = await Review.find({
            product: req.params.productId
        })
        .sort({ createdAt: -1 });


        res.status(200).json(reviews);


    } catch (error) {

        console.error("Get Reviews Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

});

// ==========================================
// GET ALL REVIEWS - ADMIN ONLY
// ==========================================

router.get("/admin/all", protect, admin, async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("product", "name")
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);

    } catch (error) {
        console.error("Get All Reviews Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
});

// ==========================================
// DELETE REVIEW - ADMIN ONLY
// ==========================================

router.delete("/admin/:id", protect, admin, async (req, res) => {
    try {
        const review = await Review.findById(
            req.params.id
        );

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        await Review.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete Review Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;