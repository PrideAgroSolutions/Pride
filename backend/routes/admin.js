const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Order = require("../models/order");
const Product = require("../models/product");


// Login route with admin authority check
router.get("/login", async (req, res) => {
    try {
        const { email, password } = req.query;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if password matches
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if user has admin authority
        if (user.authority !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        // Login successful
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




// Create Admin Route
router.post("/createAdmin", async (req, res) => {
    try {

        const { adminEmail, adminPassword, newAdminData } = req.body;

        // Validate the requesting user's credentials
        const admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            return res.status(404).json({ error: "Requesting admin not found" });
        }

        if (admin.password !== adminPassword || admin.authority !== "admin") {
            return res.status(403).json({ error: "Unauthorized action" });
        }

        // Validate new admin data
        if (!newAdminData || !newAdminData.email || !newAdminData.password) {
            return res.status(400).json({ error: "Incomplete new admin data" });
        }

        // Check if the new admin email is already registered
        const existingUser = await User.findOne({ email: newAdminData.email });
        if (existingUser) {
            return res.status(409).json({ error: "User with this email already exists" });
        }

        // Create the new admin
        const newAdmin = new User({
            name: newAdminData.name,
            email: newAdminData.email,
            password: newAdminData.password,
            authority: "admin", // Set authority to admin
        });

        console.log(newAdmin);
        

        await newAdmin.save();

        res.status(201).json({ message: "Admin created successfully", newAdmin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Admin home route
router.get("/allInfo", async (req, res) => {
    try {
        // Fetch all orders, products, and users
        const orders = await Order.find().populate("products");
        const products = await Product.find();
        const users = await User.find().populate({
            path: "order",
            populate: {
                path: "products",
                model: "Product",
            },
        });

        // 1. Calculate Total Sell and Total Orders
        let totalOrders = 0;
        let totalSell = 0;

        orders.forEach((order) => {
            totalOrders++;
            for(let i = 0; i < order.products.length; i++) {
                totalSell += order.products[i].price * order.quantity[i];
            }
        });

        // 2. Create Product Statistics Grid
        const productStats = products.map((product) => {
            let totalOrdersForProduct = 0;
            let totalSellForProduct = 0;

            orders.forEach((order) => {
                order.products.forEach((orderProduct, index) => {
                    if (orderProduct._id.equals(product._id)) {
                        totalOrdersForProduct++;
                        totalSellForProduct += product.price * order.quantity[index];
                    }
                });
            });

            return {
                name: product.name,
                totalOrders: totalOrdersForProduct,
                totalSell: totalSellForProduct,
                image: product.image[0], // Use the first image of the product
            };
        });

        // Send the response
        res.status(200).json({
            totalSell,
            totalOrders,
            productStats,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching admin data." });
    }
});

router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().populate("products userId");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});


router.put("/orders/:orderId/status", async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body; // 'Delivered' or 'Cancelled'

    if (!["Delivered", "Cancelled", "On The Way"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Use 'Delivered' or 'Cancelled'." });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
});



module.exports = router;
