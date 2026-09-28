const mongoose = require("mongoose");

const shopSettingsSchema = new mongoose.Schema(
    {
        isOrderTakingOpen: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("ShopSettings", shopSettingsSchema);