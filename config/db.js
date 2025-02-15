const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connect to local MongoDB server
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true, // Safe to leave for older versions
        });
        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDB;
