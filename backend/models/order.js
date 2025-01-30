const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    products: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true
        }
    ],
    quantity: [
        {
            type: Number,
            required: true
        }
    ],
    address: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["On The Way", "Delivered", "Cancelled"],
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Virtual field for item_count
orderSchema.virtual("item_count").get(function () {
    return this.products.length;
});

// Add virtual for calculating total quantity based on the quantity array
orderSchema.virtual("totalQuantity").get(function () {
    return this.quantity.reduce((acc, qty) => acc + qty, 0);
});

module.exports = mongoose.model("Order", orderSchema);
