const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        // ==========================================
        // PRODUCT NAME
        // ==========================================

        name: {
            type: String,
            required: true,
            trim: true
        },


        // ==========================================
        // FLAVOUR
        // ==========================================

        flavor: {
            type: String,
            required: true,
            trim: true
        },


        // ==========================================
        // WEIGHT
        // ==========================================

        weight: {
            type: String,
            required: true,
            trim: true
        },


        // ==========================================
        // SHAPE
        // ==========================================

        shape: {
            type: String,
            required: true,
            trim: true
        },


        // ==========================================
        // PRICE
        // ==========================================

        price: {
            type: Number,
            required: true,
            min: 0
        },


        // ==========================================
        // STOCK
        // ==========================================

        stock: {
            type: Number,
            default: 0,
            min: 0
        },


        // ==========================================
        // DESCRIPTION
        // ==========================================

        description: {
            type: String,
            required: true,
            trim: true
        },


        // ==========================================
        // IMAGE
        // ==========================================

        image: {
            type: String,
            default: ""
        }
    },

    {
        timestamps: true
    }
);


module.exports = mongoose.model("Product", productSchema);