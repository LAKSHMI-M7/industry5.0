const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const chairpersonData = {
    name: 'Dr. Vishnu Prasad',
    email: 'vp.vishnuprasad117@gmail.com',
    password: 'vishnu',
    role: 'chairperson'
};

const seedChairperson = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding Chairperson');

        let user = await User.findOne({ email: chairpersonData.email });
        if (user) {
            console.log(`User ${chairpersonData.email} already exists. Updating to Chairperson...`);
            user.name = chairpersonData.name;
            user.password = chairpersonData.password;
            user.role = 'chairperson';
            // Also ensure it's in allowedRoles if needed, though role is primary
            await user.save();
        } else {
            console.log(`Creating new Chairperson: ${chairpersonData.email}`);
            await User.create(chairpersonData);
        }

        console.log('\n✅ Chairperson seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding chairperson:', error);
        process.exit(1);
    }
};

seedChairperson();
