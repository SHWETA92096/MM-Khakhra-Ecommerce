const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        discountType: {
            type: String,
            enum: ["PERCENTAGE"],
            default: "PERCENTAGE"
        },

        discountValue: {
            type: Number,
            default: 10
        },

        minOrderAmount: {
            type: Number,
            default: 0
        },

        isUsed: {
            type: Boolean,
            default: false
        },

        usedAt: {
            type: Date,
            default: null
        },

        expiresAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Discount", discountSchema);