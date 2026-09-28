const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const Product = require("../models/Product");


// ==========================================
// IMAGE UPLOAD CONFIGURATION
// ==========================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});


const upload = multer({

    storage: storage,

    limits: {

        fileSize: 5 * 1024 * 1024

    },

    fileFilter: function (req, file, cb) {

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
                )
            );

        }

    }

});


// ==========================================
// GET ALL PRODUCTS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const products = await Product.find();

        res.status(200).json(products);

    } catch (error) {

        console.error("Get Products Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

});


// ==========================================
// GET SINGLE PRODUCT
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const product =
            await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.status(200).json(product);

    } catch (error) {

        console.error("Get Product Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

});


// ==========================================
// ADD PRODUCT
// ==========================================

router.post(
    "/",
    upload.single("image"),
    async (req, res) => {

        try {

            const {
                name,
                flavor,
                weight,
                shape,          // ⭐ IMPORTANT
                price,
                stock,
                description
            } = req.body;


            // ==================================
            // CHECK REQUIRED FIELDS
            // ==================================

            if (!name || !flavor || !weight || !shape ||
                !price || !description) {

                return res.status(400).json({

                    message:
                        "Please fill all required product details."

                });

            }


            // ==================================
            // CHECK IMAGE
            // ==================================

            if (!req.file) {

                return res.status(400).json({

                    message:
                        "Please select a product image."

                });

            }


            // ==================================
            // CREATE PRODUCT
            // ==================================

            const product =
                await Product.create({

                    name: name,

                    flavor: flavor,

                    weight: weight,

                    shape: shape,       // ⭐ IMPORTANT

                    price: Number(price),

                    stock: Number(stock) || 0,

                    description: description,

                    image: req.file.filename

                });


            // ==================================
            // SUCCESS
            // ==================================

            res.status(201).json({

                message:
                    "Product added successfully!",

                product: product

            });


        } catch (error) {

            console.error(
                "Add Product Error:",
                error
            );

            res.status(500).json({

                message:
                    error.message

            });

        }

    }
);


// ==========================================
// UPDATE PRODUCT
// ==========================================

router.put(
    "/:id",
    upload.single("image"),
    async (req, res) => {

        try {

            const {
                name,
                flavor,
                weight,
                shape,          // ⭐ IMPORTANT
                price,
                stock,
                description
            } = req.body;


            // ==================================
            // UPDATE DATA
            // ==================================

            const updateData = {

                name: name,

                flavor: flavor,

                weight: weight,

                shape: shape,       // ⭐ IMPORTANT

                price: Number(price),

                stock: Number(stock) || 0,

                description: description

            };


            // ==================================
            // NEW IMAGE
            // ==================================

            if (req.file) {

                updateData.image =
                    req.file.filename;

            }


            // ==================================
            // UPDATE PRODUCT
            // ==================================

            const product =
                await Product.findByIdAndUpdate(

                    req.params.id,

                    updateData,

                    {
                        new: true,
                        runValidators: true
                    }

                );


            if (!product) {

                return res.status(404).json({

                    message:
                        "Product not found"

                });

            }


            // ==================================
            // SUCCESS
            // ==================================

            res.status(200).json({

                message:
                    "Product updated successfully!",

                product: product

            });


        } catch (error) {

            console.error(
                "Update Product Error:",
                error
            );

            res.status(500).json({

                message:
                    error.message

            });

        }

    }
);


// ==========================================
// DELETE PRODUCT
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const product =
            await Product.findByIdAndDelete(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                message:
                    "Product not found"

            });

        }


        res.status(200).json({

            message:
                "Product deleted successfully!"

        });


    } catch (error) {

        console.error(
            "Delete Product Error:",
            error
        );

        res.status(500).json({

            message:
                error.message

        });

    }

});


module.exports = router;