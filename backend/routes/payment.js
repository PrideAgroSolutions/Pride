const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require('crypto');

// const Payment = require("../models/payment"); // Import the Payment model
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);


const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.get('/getKey', (req, res) => {
    res.json({
        key_id: process.env.RAZORPAY_KEY_ID,
    });
});


const paymentProcess = async (req, res) => {
    try {
        const options = {
            amount: Number(req.body.amount * 100), // in paise 1000 Rs. = 100000 paise
            currency: req.body.currency || "INR",
        };

        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Payment creation failed:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create payment order",
            error: error.message || error
        });
    }
}

router.post("/createOrder", paymentProcess);

const paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    console.log("Razorpay Signature:", razorpay_signature)
    console.log("Expected Signature:", expectedSignature);
    const isSignatureValid = expectedSignature === razorpay_signature;
    if (isSignatureValid) {
        console.log("Signature is valid");
        res.redirect(`https://pridefrontend.onrender.com/products`);
        return res.status(400).json({
            success: true,
            message: "Valid Signature"
        });
    }
    else {
        console.log("Signature is invalid");
        return res.status(400).json({
            success: false,
            message: "Invalid Signature"
        });
    }
}

router.post('/paymentVerification', paymentVerification)

module.exports = router;


