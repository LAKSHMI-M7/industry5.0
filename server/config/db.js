const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/industry5club';
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.log('Tip: Check if your MONGO_URI is correct or if your IP is whitelisted on MongoDB Atlas.');
        process.exit(1);
    }
};

module.exports = connectDB;
