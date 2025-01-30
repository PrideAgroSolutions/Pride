const express = require("express");
const router = express.Router();
const User = require("../models/users");

// Route to create a user manually
router.post("/createUser", async (req, res) => {
    try {
        const { name, email, age, mobile, password, address, cartId, order } = req.body;

        // Create a new user
        const newUser = new User({
            name,
            email,
            age,
            mobile,
            password,
            address,
            cartId,
            order
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "User created successfully", user: savedUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to create a user using Google credentials
router.post("/createUserWithGoogle", async (req, res) => {
    try {
        const { name, email} = req.body;

        // Ensure that name and email are provided
        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }

        // Create a new user with only name and email, keeping other fields empty
        const newUser = new User({
            name,
            email,
            age: null,
            mobile: null,
            password: null,
            address: [],
            cart: [],
            order: []
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "User created successfully with Google", user: savedUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;


// Regular login
router.get("/login", async (req, res) => {
    try {
        const { email, password } = req.query;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Google login
router.get("/googleLogin", async (req, res) => {
    try {
        const { email } = req.query;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found. Please sign up first." });
        }

        res.status(200).json({ message: "Google login successful", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Get user details by ID
router.get("/getUser/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)
            // .populate("cartId") // Populate cart details
            // .populate("order"); // Populate order details

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update user details
router.put("/updateUser/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});







// cart related :

// Get cart by User ID
router.get("/getCart/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("cart"); // Populate the cart with product details
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving cart", error: error.message });
    }
});

router.put("/addItem", async (req, res) => {
    try {
      const { userId, productId } = req.body;
  
      // Fetch user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the productId already exists in the cart
      if (user.cart.includes(productId)) {
        return res.status(200).json({
          message: "Item already exists in the cart",
          cart: user.cart,
        });
      }
  
      // Push productId into the cart array
      user.cart.push(productId);
  
      // Save the updated user document
      await user.save();
  
      // Respond with the updated cart
      res.status(200).json({
        message: "Item added to cart successfully",
        cart: user.cart,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).json({ message: "Error adding item to cart", error: error.message });
    }
  });
  

// Remove item from cart
router.put("/removeItem", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: productId } }, // Remove the product from the cart
            { new: true }
        ).populate("cart");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: "Error removing item from cart", error: error.message });
    }
});


module.exports = router;
