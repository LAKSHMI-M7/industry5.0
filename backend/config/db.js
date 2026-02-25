const mongoose = require('mongoose');

const connectDB = async (retryCount = 0) => {
    const maxRetries = 5;
    try {
        // No hardcoded fallback URI anymore. Uses Environment Variables.
        const uri = process.env.MONGO_URI || process.env.MONGO_URI_LOCAL;

        if (!uri) {
            throw new Error('Database connection URI is missing from environment variables.');
        }

        console.log(`Attempting to connect to MongoDB (Attempt ${retryCount + 1})...`);

        const conn = await mongoose.connect(uri, {
            family: 4, // Force IPv4 to avoid potential resolution issues
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);

        if (retryCount < maxRetries) {
            console.log(`Retrying in 5 seconds... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => connectDB(retryCount + 1), 5000);
        } else {
            console.log('\n--- Infrastructure Alert ---');
            console.log('Ensure MONGO_URI or MONGO_URI_LOCAL is set in backend/.env');
            console.log('----------------------------\n');
        }
    }
};

module.exports = connectDB;


