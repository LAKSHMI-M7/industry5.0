const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGO_URI_LOCAL;

        if (!uri) {
            console.error('❌ Database connection URI is missing from environment variables.');
            return;
        }

        console.log(`Attempting to connect to MongoDB...`);
        await mongoose.connect(uri, {
            family: 4, 
        });

        console.log(`✅ MongoDB Connected`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
    }
};

module.exports = connectDB;



