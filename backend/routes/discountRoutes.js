const express = require("express");
const router = express.Router();

const Discount = require("../models/Discount");
const Order = require("../models/Order");

// ========================================
// GENERATE UNIQUE DISCOUNT CODE
// ========================================

function generateDiscountCode() {

    const randomPart =
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

    return `MMKHAKHRA-${randomPart}`;
}


// ========================================
// CREATE DISCOUNT FOR CUSTOMER
// ONLY FOR FIRST-ORDER CUSTOMERS
// ========================================

router.post("/create", async (req, res) => {

    try {

        const { userId } = req.body;


        if (!userId) {

            return res.status(400).json({
                message: "User ID is required"
            });

        }


        // ========================================
        // CHECK WHETHER CUSTOMER HAS ORDERED BEFORE
        // ========================================

        const previousOrders =
            await Order.countDocuments({
                user: userId
            });


        if (previousOrders > 0) {

            return res.status(400).json({
                message:
                    "Discount code is available only for first-order customers."
            });

        }


        // ========================================
        // CHECK EXISTING ACTIVE DISCOUNT
        // ========================================

        const existingDiscount =
            await Discount.findOne({
                user: userId,
                isUsed: false
            });


        if (existingDiscount) {

            return res.status(200).json({
                message:
                    "Customer already has an active discount code.",
                discount: existingDiscount
            });

        }


        // ========================================
        // GENERATE UNIQUE CODE
        // ========================================

        let code;
        let existingCode;


        do {

            code =
                generateDiscountCode();

            existingCode =
                await Discount.findOne({
                    code: code
                });

        } while (existingCode);


        // ========================================
        // CREATE 10% DISCOUNT
        // ========================================

        const discount =
            await Discount.create({

                code: code,

                user: userId,

                discountType:
                    "PERCENTAGE",

                discountValue:
                    10,

                minOrderAmount:
                    0,

                isUsed:
                    false

            });


        res.status(201).json({

            message:
                "10% discount code created successfully",

            discount

        });


    } catch (error) {

        console.error(
            "Create Discount Error:",
            error
        );


        res.status(500).json({

            message:
                error.message

        });

    }

});


// ========================================
// GET CUSTOMER'S ACTIVE DISCOUNT
// ========================================

router.get(
    "/user/:userId",
    async (req, res) => {

        try {

            const discount =
                await Discount.findOne({

                    user:
                        req.params.userId,

                    isUsed:
                        false

                }).sort({

                    createdAt:
                        -1

                });


            if (!discount) {

                return res.status(404).json({

                    message:
                        "No active discount found"

                });

            }


            res.status(200).json(
                discount
            );


        } catch (error) {

            console.error(
                "Get Discount Error:",
                error
            );


            res.status(500).json({

                message:
                    error.message

            });

        }

    }
);


// ========================================
// VALIDATE DISCOUNT CODE
// ========================================

router.post(
    "/validate",
    async (req, res) => {

        try {

            const {
                code,
                userId,
                subtotal
            } = req.body;


            if (
                !code ||
                !userId ||
                subtotal === undefined
            ) {

                return res.status(400).json({

                    message:
                        "Code, user ID and subtotal are required"

                });

            }


            // ========================================
            // FIND DISCOUNT
            // ========================================

            const discount =
                await Discount.findOne({

                    code:
                        code
                            .toUpperCase()
                            .trim()

                });


            if (!discount) {

                return res.status(404).json({

                    message:
                        "Invalid discount code"

                });

            }


            // ========================================
            // CHECK OWNERSHIP
            // ========================================

            if (
                discount.user.toString() !==
                userId.toString()
            ) {

                return res.status(403).json({

                    message:
                        "This discount code belongs to another customer"

                });

            }


            // ========================================
            // CHECK USED STATUS
            // ========================================

            if (discount.isUsed) {

                return res.status(400).json({

                    message:
                        "This discount code has already been used"

                });

            }


            // ========================================
            // CHECK EXPIRY
            // ========================================

            if (
                discount.expiresAt &&
                new Date() >
                    new Date(
                        discount.expiresAt
                    )
            ) {

                return res.status(400).json({

                    message:
                        "This discount code has expired"

                });

            }


            // ========================================
            // CHECK MINIMUM ORDER
            // ========================================

            if (
                Number(subtotal) <
                Number(discount.minOrderAmount)
            ) {

                return res.status(400).json({

                    message:
                        `Minimum order amount is ₹${discount.minOrderAmount}`

                });

            }


            // ========================================
            // CALCULATE DISCOUNT
            // ========================================

            const discountAmount =

                (
                    Number(subtotal) *
                    Number(
                        discount.discountValue
                    )
                ) / 100;


            const finalAmount =

                Number(subtotal) -
                discountAmount;


            // ========================================
            // RESPONSE
            // ========================================

            res.status(200).json({

                message:
                    "Discount applied successfully",

                code:
                    discount.code,

                discountPercentage:
                    discount.discountValue,

                discountAmount:
                    Number(
                        discountAmount.toFixed(2)
                    ),

                finalAmount:
                    Number(
                        finalAmount.toFixed(2)
                    )

            });


        } catch (error) {

            console.error(
                "Validate Discount Error:",
                error
            );


            res.status(500).json({

                message:
                    error.message

            });

        }

    }
);


// ========================================
// MARK DISCOUNT AS USED
// ========================================

router.put(
    "/use",
    async (req, res) => {

        try {

            const {
                code,
                userId
            } = req.body;


            if (!code || !userId) {

                return res.status(400).json({

                    message:
                        "Code and user ID are required"

                });

            }


            const discount =
                await Discount.findOne({

                    code:
                        code
                            .toUpperCase()
                            .trim(),

                    user:
                        userId

                });


            if (!discount) {

                return res.status(404).json({

                    message:
                        "Discount code not found"

                });

            }


            if (discount.isUsed) {

                return res.status(400).json({

                    message:
                        "Discount code has already been used"

                });

            }


            // ========================================
            // MARK AS USED
            // ========================================

            discount.isUsed =
                true;

            discount.usedAt =
                new Date();


            await discount.save();


            res.status(200).json({

                message:
                    "Discount code used successfully",

                discount

            });


        } catch (error) {

            console.error(
                "Use Discount Error:",
                error
            );


            res.status(500).json({

                message:
                    error.message

            });

        }

    }
);


module.exports = router;