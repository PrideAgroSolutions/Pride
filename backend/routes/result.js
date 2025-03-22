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

router.put("/updateResult/:id", async (req, res) => {
  try {
      const { name, description } = req.body;
      const resultId = req.params.id;

      // Find the existing result by ID
      let existingResult = await Result.findById(resultId);
      if (!existingResult) {
          return res.status(404).json({ message: "Result not found!" });
      }

      let uploadedImages = [];

      // If new images are uploaded, delete old images and upload new ones
      if (req.files && req.files.images) {
          const imagesArray = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

          // Delete old images from Cloudinary
          if (existingResult.image && existingResult.image.length > 0) {
              for (const imageUrl of existingResult.image) {
                  try {
                      const url = new URL(imageUrl);
                      const pathname = url.pathname;
                      const publicId = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.lastIndexOf('.'));
                      await cloudinary.uploader.destroy(publicId);
                  } catch (error) {
                      console.error(`Error deleting old image from Cloudinary: ${imageUrl}`, error);
                  }
              }
          }

          // Upload new images to Cloudinary
          for (const image of imagesArray) {
              const uploadResult = await cloudinary.uploader.upload(image.tempFilePath);
              uploadedImages.push(uploadResult.secure_url);
          }
      }

      // Update the result in the database
      existingResult.name = name || existingResult.name;
      existingResult.description = description || existingResult.description;
      existingResult.image = uploadedImages.length > 0 ? uploadedImages : existingResult.image;

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

router.delete('/deleteResult/:id', async (req, res) => {
  try {
      const { id } = req.params;

      // Find the result before deleting
      const result = await Result.findById(id);
      if (!result) {
          return res.status(404).json({ message: 'Result not found.' });
      }

      // Delete images from Cloudinary
      if (result.image && result.image.length > 0) {
          for (const imageUrl of result.image) {
              try {
                  const url = new URL(imageUrl);
                  const pathname = url.pathname;
                  const publicId = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.lastIndexOf('.'));
                  await cloudinary.uploader.destroy(publicId);
              } catch (error) {
                  console.error(`Error deleting image from Cloudinary: ${imageUrl}`, error);
              }
          }
      }

      // Delete result from database
      await Result.findByIdAndDelete(id);

      res.status(200).json({
          message: 'Result deleted successfully!',
      });
  } catch (error) {
      console.error('Error deleting result:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


module.exports = router;
