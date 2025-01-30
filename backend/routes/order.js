const express = require("express");
const router = express.Router();
const Order = require("../models/order"); // Import the Order model


// User Ends : 

// POST route to create a new order
router.post("/addOrder", async (req, res) => {
    try {
        const { product, quantity, address, userName, price, status, userId } = req.body;

        // Validate required fields
        if (!product || product.length === 0 || !quantity || quantity.length === 0 || !userName || !price || !status || !userId || !address) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate status value
        const validStatuses = ["On The Way", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        // Create a new order instance
        const newOrder = new Order({
            products: product,
            quantity: quantity,
            address: address,
            userName: userName,
            price: price,
            status: status,
            userId: userId,
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: "Order created successfully!",
            order: savedOrder,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

// GET route to fetch all orders by userId and populate product details
router.get("/getUserOrder/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch orders for the given userId and populate the product details
        const userOrders = await Order.find({ userId })
            .populate("products"); // Populate the product field to fetch product details

        if (!userOrders || userOrders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        // Reverse the array of user orders
        const reversedOrders = userOrders.reverse();

        // Return the reversed list of user orders with populated product details
        res.status(200).json(reversedOrders);
    } catch (error) {
        console.error("Error fetching orders for user:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});


router.put("/cancelOrder", async (req, res) => {
    try {
        const { id } = req.body;

        // Validate the required field
        if (!id) {
            return res.status(400).json({ message: "Order 'id' is required." });
        }

        // Find and update the order's status to 'cancelled'
        const cancelledOrder = await Order.findByIdAndUpdate(
            id,
            { status: "cancelled" }, // Only update the status to 'cancelled'
            { new: true } // Return the updated order
        );

        if (!cancelledOrder) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Respond with the updated order
        res.status(200).json({
            message: "Order successfully cancelled!",
            order: cancelledOrder,
        });
    } catch (error) {
        console.error("Error canceling order:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});




router.get("/getAllOrder", async (req, res) => {
    try {
        // Fetch all orders and sort by createdAt in descending order (most recent orders first)
        const orders = await Order.find();

        // Check if orders exist
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found." });
        }

        // Return the list of orders
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});


router.put("/updateStatus", async (req, res) => {
    try {
        const { id, status } = req.body;

        // Validate the required fields
        if (!id || !status) {
            return res.status(400).json({ message: "Both 'id' and 'status' are required." });
        }

        // Validate the status value
        const allowedStatuses = ["ontheway", "delivered", "cancelled"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Allowed values are 'ontheway', 'delivered', or 'cancelled'." });
        }

        // Find and update the order's status
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status }, // Only update the status field
            { new: true } // Return the updated order
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Respond with the updated order
        res.status(200).json({
            message: "Order status updated successfully!",
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});
router.get("/getSpecificOrder/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find the order by ID and populate the products and userId fields
        const order = await Order.findById(id)
            .populate("products", "name price image") // Populate products field (select specific fields)
            .populate("userId", "name email"); // Populate user details (select specific fields)

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});


module.exports = router;
