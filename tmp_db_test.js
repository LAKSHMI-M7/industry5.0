const mongoose = require('mongoose');
const uri = "mongodb+srv://lakshmi:12345@cluster1.6633l25.mongodb.net/industry5club";

const testConn = async () => {
    try {
        console.log('Testing Atlas connection...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('SUCCESS: Connected to Atlas');

        // Check if any users exist
        const User = mongoose.model('User', new mongoose.Schema({ email: String }));
        const count = await User.countDocuments();
        console.log('User count in DB:', count);

        process.exit(0);
    } catch (err) {
        console.error('FAILURE:', err.message);
        process.exit(1);
    }
};

testConn();
