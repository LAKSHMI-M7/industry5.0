const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
    {
        name: 'Admin User',
        email: 'admin@i5c.edu',
        password: 'admin@i5c.123',
        role: 'admin'
    },
    {
        name: 'Staff Coordinator',
        email: 'staff@i5c.edu',
        password: 'staff@i5c.123',
        role: 'staff'
    }
];

const seedRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding Admin/Staff');

        for (const userData of users) {
            let user = await User.findOne({ email: userData.email });
            if (user) {
                console.log(`User ${userData.email} already exists. Updating...`);
                user.name = userData.name;
                user.password = userData.password;
                user.role = userData.role;
                await user.save();
            } else {
                console.log(`Creating new user: ${userData.email}`);
                await User.create(userData);
            }
        }

        console.log('\n✅ Admin and Staff seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding roles:', error);
        process.exit(1);
    }
};

seedRoles();
