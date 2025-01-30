const express = require("express");
const cloudinary = require("cloudinary").v2;
const Result = require("../models/result"); // Import your Result model
const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'prideagrosolutions',
  api_key: '888289177214586',
  api_secret: 'qqbhvXfud8fnbtKwrwKzyGXI_44',
});


// Get All Results Route
router.get("/getAllResults", async (req, res) => {
  try {
    // Fetch all results from the database
    const results = await Result.find();

    if (results.length === 0) {
      return res.status(404).json({ message: "No results found!" });
    }

    res.status(200).json(results); // Return all results in the response
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});


// Update Result Route
router.put("/updateResult/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const resultId = req.params.id;

    // Find the existing result by ID
    let existingResult = await Result.findById(resultId);
    if (!existingResult) {
      return res.status(404).json({ message: "Result not found!" });
    }

    // Handle image uploads if there are new images
    let uploadedImages = [];
    if (req.files && req.files.images) {
      // If there are images, delete old ones (optional, depending on your use case)
      if (existingResult.image && existingResult.image.length > 0) {
        existingResult.image.forEach(async (imageUrl) => {
          const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract the public ID from the URL
          await cloudinary.uploader.destroy(publicId); // Destroy image in Cloudinary
        });
      }

      // Upload new images to Cloudinary
      const imagesArray = req.files.images;
      for (let i = 0; i < imagesArray.length; i++) {
        const uploadResult = await cloudinary.uploader.upload(imagesArray[i].tempFilePath);
        uploadedImages.push(uploadResult.url);
      }
    }

    // Update the result in the database
    existingResult.name = name || existingResult.name;
    existingResult.description = description || existingResult.description;
    existingResult.image = uploadedImages.length > 0 ? uploadedImages : existingResult.image; // Keep existing images if none are uploaded

    // Save the updated result
    const updatedResult = await existingResult.save();

    res.status(200).json({
      message: "Result updated successfully!",
      result: updatedResult,
    });
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});



router.post('/addResult', async (req, res) => {
    try {
        // Validate if images are provided
        if (!req.files || !req.files.images || req.files.images.length < 4) {
            return res.status(400).json({ message: 'Four image files are required.' });
        }

        const { name, description } = req.body;

        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required.' });
        }

        const images = req.files.images; // 'images' should match the key in the frontend's FormData
        if (!Array.isArray(images) || images.length !== 4) {
            return res.status(400).json({ message: 'Exactly four images must be uploaded.' });
        }

        // Upload images to Cloudinary
        const uploadPromises = images.map(image =>
            cloudinary.uploader.upload(image.tempFilePath)
        );
        const uploadResults = await Promise.all(uploadPromises);

        // Extract the URLs of the uploaded images
        const imageUrls = uploadResults.map(result => result.url);

        // Create a new result document
        const newResult = new Result({
            name,
            image: imageUrls,
            description
        });

        // Save to the database
        const savedResult = await newResult.save();

        res.status(201).json({
            message: 'Result added successfully!',
            result: savedResult
        });
    } catch (error) {
        console.error('Error adding result:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


// DELETE route to delete a result by ID
router.delete('/deleteResult/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Delete product by ID
        const deletedResult = await Result.findByIdAndDelete(id);

        if (!deletedResult) {
            return res.status(404).json({ message: 'Result not found.' });
        }

        res.status(200).json({
            message: 'Rusult deleted successfully!',
            product: deletedResult
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});





module.exports = router;
