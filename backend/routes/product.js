const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Assuming you have a Product model defined
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'prideagrosolutions',
    api_key: '888289177214586',
    api_secret: 'qqbhvXfud8fnbtKwrwKzyGXI_44'
});

// const file = req.files.photo;
// cloudinary.uploader.upload(file.tempFilePath,(err, result)=>{
//     console.log(result);
//     res.status(200).json(result);
// });



// User Ends : 

// GET route to fetch the first 6 products
router.get('/getSixProduct', async (req, res) => {
    try {
        const products = await Product.find().limit(6);
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// GET route to fetch all products
router.get('/getAllProduct', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});



router.get('/getProduct/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});









// Admin End
// POST route to add a new product

router.post('/addProduct', async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: 'Image file is required.' });
        }

        // Extract the file and other fields from the request
        const file = req.files.image; // 'image' matches the key sent in the frontend's FormData
        const {
            name,
            composition,
            dosage,
            packing,
            benefits,
            target,
            price,
        } = req.body;

        // Validate required fields
        if (!name || !composition || !dosage || !packing || !benefits || !target || !price) {
            return res.status(400).json({ message: 'All fields except image are required.' });
        }

        // Upload the image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath);

        // Create a new product instance
        const newProduct = new Product({
            name,
            composition,
            dosage,
            packing,
            image: uploadResult.url, // Save the Cloudinary image URL
            benefits,
            target,
            price,
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: 'Product added successfully!',
            product: savedProduct,
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// PUT route to update a product by ID
router.put('/updateProduct/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;

        // Find the existing product
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Check if an image is included in the request
        if (req.files && req.files.image) {
            const file = req.files.image;

            // Delete existing image from Cloudinary
            if (existingProduct.image) {
                const url = new URL(existingProduct.image); // Parse URL
                const pathname = url.pathname; // Get path from URL
                const publicId = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.lastIndexOf('.')); // Extract public ID
                await cloudinary.uploader.destroy(publicId);
            }

            // Upload new image to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.tempFilePath);
            updates.image = uploadResult.secure_url; // Store new image URL
        }

        // Update the product in the database
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

        res.status(200).json({
            message: 'Product updated successfully!',
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// DELETE route to delete a product by ID
router.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product before deleting
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Delete product image from Cloudinary
        if (product.image) {
            const url = new URL(product.image); // Parse URL
            const pathname = url.pathname; // Get path from URL
            const publicId = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.lastIndexOf('.')); // Extract public ID
            await cloudinary.uploader.destroy(publicId);
        }

        // Delete product from database
        await Product.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Product deleted successfully!',
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});



module.exports = router;
