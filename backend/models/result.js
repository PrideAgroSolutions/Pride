const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: [String], // Array of strings for image URLs or paths
        required: true // Assuming images are mandatory
    },
    description: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("Result", resultSchema);