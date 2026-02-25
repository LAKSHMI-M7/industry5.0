const mongoose = require('mongoose');
require('dotenv').config();

const testAtlasConn = async () => {
    const atlasUri = process.env.MONGO_URI;
    try {
        console.log('Testing connection to Atlas from .env:', atlasUri.replace(/:([^@]+)@/, ':****@'));
        await mongoose.connect(atlasUri, { serverSelectionTimeoutMS: 5000 });
        console.log('SUCCESS: Connected to MongoDB Atlas');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Could not connect to MongoDB Atlas');
        console.error(err.message);
        process.exit(1);
    }
};

testAtlasConn();
