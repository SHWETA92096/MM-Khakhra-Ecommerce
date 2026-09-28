const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const ShopSettings = require("../models/ShopSettings");
const Discount = require("../models/Discount");


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
// CREATE ORDER
// ========================================

router.post("/", async (req, res) => {

    try {

        const {
            user,
            items,
            subtotal,
            discountAmount,
            discountCode,
            totalAmount,
            customerName,
            email,
            phone,
            address,
            city,
            pincode,
            paymentMethod
        } = req.body;


        // ========================================
        // BASIC VALIDATION
        // ========================================

        if (!user) {

            return res.status(400).json({

                message:
                    "User is required"

            });

        }


        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({

                message:
                    "Order must contain at least one product"

            });

        }


        if (!customerName) {

            return res.status(400).json({

                message:
                    "Customer name is required"

            });

        }


        if (!email) {

            return res.status(400).json({

                message:
                    "Email is required"

            });

        }


        if (!phone) {

            return res.status(400).json({

                message:
                    "Phone number is required"

            });

        }


        if (!address) {

            return res.status(400).json({

                message:
                    "Address is required"

            });

        }


        if (!city) {

            return res.status(400).json({

                message:
                    "City is required"

            });

        }


        if (!pincode) {

            return res.status(400).json({

                message:
                    "Pincode is required"

            });

        }


        // ========================================
        // CHECK SHOP STATUS
        // ========================================

        const shopSettings =
            await ShopSettings.findOne();


        if (
            shopSettings &&
            shopSettings.isOrderTakingOpen === false
        ) {

            return res.status(400).json({

                message:
                    "Online ordering is currently closed."

            });

        }


        // ========================================
        // CHECK PREVIOUS ORDERS
        // ========================================

        const previousOrderCount =
            await Order.countDocuments({

                user: user

            });


        const isFirstOrder =
            previousOrderCount === 0;


        // ========================================
        // CREATE ORDER
        // ========================================

        const order =
            await Order.create({

                user,

                items,

                subtotal:
                    Number(subtotal) || 0,

                discountAmount:
                    Number(discountAmount) || 0,

                discountCode:
                    discountCode || "",

                totalAmount:
                    Number(totalAmount) || 0,

                customerName,

                email,

                phone,

                address,

                city,

                pincode,

                paymentMethod:
                    paymentMethod ||
                    "Cash on Delivery",

                status:
                    "Pending"

            });

            // ========================================
// SOCKET.IO NEW ORDER NOTIFICATION
// ========================================

const io = req.app.get("io");

if (io) {

    io.emit("newOrder", {

        orderId: order._id,

        customerName: order.customerName,

        email: order.email,

        totalAmount: order.totalAmount,

        status: order.status

    });

}

        // ========================================
        // IF CUSTOMER USED A COUPON
        // ========================================

        if (discountCode) {

            const discount =
                await Discount.findOne({

                    code:
                        discountCode
                            .toUpperCase()
                            .trim(),

                    user: user,

                    isUsed: false

                });


            if (!discount) {

                // Delete invalid order

                await Order.findByIdAndDelete(
                    order._id
                );


                return res.status(400).json({

                    message:
                        "Invalid or already used discount code"

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

                await Order.findByIdAndDelete(
                    order._id
                );


                return res.status(400).json({

                    message:
                        "Discount code has expired"

                });

            }


            // ========================================
            // MARK COUPON AS USED
            // ========================================

            discount.isUsed =
                true;

            discount.usedAt =
                new Date();


            await discount.save();


            // ========================================
            // RETURN ORDER SUCCESS
            // ========================================

            return res.status(201).json({

                message:
                    "Order placed successfully",

                order,

                discount:
                    null

            });

        }


        // ========================================
        // FIRST ORDER ONLY
        // CREATE 10% COUPON FOR NEXT PURCHASE
        // ========================================

        if (isFirstOrder) {

            // Check whether an unused coupon
            // already exists for this customer

            let discount =
                await Discount.findOne({

                    user: user,

                    isUsed: false

                });


            // ========================================
            // CREATE NEW 10% COUPON
            // ========================================

            if (!discount) {

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


                discount =
                    await Discount.create({

                        code: code,

                        user: user,

                        discountType:
                            "PERCENTAGE",

                        discountValue:
                            10,

                        minOrderAmount:
                            0,

                        isUsed:
                            false

                    });

            }


            // ========================================
            // RETURN NEW COUPON
            // ========================================

            return res.status(201).json({

                message:
                    "Order placed successfully",

                order,

                discount: {

                    code:
                        discount.code,

                    discountType:
                        discount.discountType,

                    discountValue:
                        discount.discountValue,

                    message:
                        "You received 10% OFF on your next purchase!"

                }

            });

        }


        // ========================================
        // NORMAL REPEAT ORDER
        // NO NEW COUPON
        // ========================================

        return res.status(201).json({

            message:
                "Order placed successfully",

            order,

            discount:
                null

        });


    } catch (error) {

        console.error(
            "Create Order Error:",
            error
        );


        res.status(500).json({

            message:
                error.message

        });

    }

});


// ========================================
// GET ALL ORDERS
// ========================================

router.get("/", async (req, res) => {

    try {

        const orders =
            await Order.find()
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "items.product"
                )
                .sort({
                    createdAt: -1
                });


        res.status(200).json(
            orders
        );


    } catch (error) {

        console.error(
            "Get Orders Error:",
            error
        );


        res.status(500).json({

            message:
                error.message

        });

    }

});


// ========================================
// GET USER ORDERS
// ========================================

router.get(
    "/user/:userId",
    async (req, res) => {

        try {

            const orders =
                await Order.find({

                    user:
                        req.params.userId

                })
                    .populate(
                        "items.product"
                    )
                    .sort({

                        createdAt:
                            -1

                    });


            res.status(200).json(
                orders
            );


        } catch (error) {

            console.error(
                "Get User Orders Error:",
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
// GET SINGLE ORDER
// ========================================

router.get(
    "/:id",
    async (req, res) => {

        try {

            const order =
                await Order.findById(
                    req.params.id
                )
                    .populate(
                        "user",
                        "name email"
                    )
                    .populate(
                        "items.product"
                    );


            if (!order) {

                return res.status(404).json({

                    message:
                        "Order not found"

                });

            }


            res.status(200).json(
                order
            );


        } catch (error) {

            console.error(
                "Get Single Order Error:",
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
// DELETE USER ORDER
// ========================================

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const order =
                await Order.findById(
                    req.params.id
                );


            // ========================================
            // CHECK ORDER
            // ========================================

            if (!order) {

                return res.status(404).json({

                    message:
                        "Order not found"

                });

            }


            // ========================================
            // ONLY ALLOW DELETE FOR
            // PENDING OR CANCELLED ORDERS
            // ========================================

            if (
                order.status !== "Pending" &&
                order.status !== "Cancelled"
            ) {

                return res.status(400).json({

                    message:
                        "This order cannot be deleted after it has been confirmed or shipped."

                });

            }


            // ========================================
            // DELETE ORDER
            // ========================================

            await Order.findByIdAndDelete(
                req.params.id
            );


            // ========================================
            // RESPONSE
            // ========================================

            res.status(200).json({

                message:
                    "Order deleted successfully"

            });


        } catch (error) {

            console.error(
                "Delete Order Error:",
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
// UPDATE ORDER STATUS
// ========================================

router.put(
    "/:id/status",
    async (req, res) => {

        try {

            const {
                status
            } = req.body;


            const allowedStatuses = [

                "Pending",

                "Confirmed",

                "Shipped",

                "Delivered",

                "Cancelled"

            ];


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid order status"

                });

            }


            const order =
                await Order.findById(
                    req.params.id
                );


            if (!order) {

                return res.status(404).json({

                    message:
                        "Order not found"

                });

            }


            order.status =
                status;


            await order.save();


            // ========================================
            // SOCKET.IO NOTIFICATION
            // ========================================

            const io =
                req.app.get("io");


            if (io) {

                io.emit(
                    "orderStatusUpdated",
                    {

                        orderId:
                            order._id,

                        status:
                            order.status,

                        userId:
                            order.user

                    }
                );

            }


            res.status(200).json({

                message:
                    "Order status updated successfully",

                order

            });


        } catch (error) {

            console.error(
                "Update Order Status Error:",
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