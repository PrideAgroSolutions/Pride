const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    authority: {
        type: String,
        required: true,
        default : "user",
        enum: ["user", "admin"],
    },
    age: {
        type: Number,
    },
    mobile: {
        type: Number,
    },
    password: {
        type: String,
    },
    address: {
        type: [String], // Array of strings
        default: [] // Initially empty
    },
    cart: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            default: [] // Initially empty
        }
    ],
    order: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Order"
        }
    ]
},
{ timestamps: true });

module.exports = mongoose.model("User", userSchema);

