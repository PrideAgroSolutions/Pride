const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://Pavan:1234@pride.l7ss2.mongodb.net/?retryWrites=true&w=majority&appName=Pride", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected...");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
    
};

module.exports = { connectDB };



