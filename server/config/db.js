const mongoose = require('mongoose');

const connectDB = async (retryCount = 0) => {
    const maxRetries = 5;
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/industry5club';
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
            console.log('\n--- Troubleshooting Tips ---');
            console.log('1. Make sure MongoDB is running. Run: server/run-db.bat');
            console.log('2. If you changed the DB path, ensure it exists and has permissions.');
            console.log('----------------------------\n');
        }
    }
};

module.exports = connectDB;
