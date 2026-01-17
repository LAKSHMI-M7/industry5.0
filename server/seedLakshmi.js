const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');

dotenv.config();

const seedStudent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/industry5club');
        console.log('MongoDB Connected');

        const userData = {
            name: 'Lakshmi Prabha.G',
            email: 'lakahmiprabha929@gmail.com',
            password: 'industry5.0@123',
            role: 'student',
            avatar: '/avatars/lakshmi-profile.jpg'
        };

        const profileData = {
            registerNumber: '210624205076',
            department: 'Information Technology',
            year: 'II',
            domain: 'AIML',
            githubLink: 'https://github.com/lakshmiprabhaganesanarumugam',
            linkedinLink: 'https://www.linkedin.com/in/lakshmiprabhag29',
            skills: ['python', 'ai', 'deep learning', 'machine learning', 'frontend(basics)', 'java(oops)basic']
        };

        // Check if user exists
        let user = await User.findOne({ email: userData.email });
        if (user) {
            console.log('User already exists. Updating...');
            user.name = userData.name;
            user.password = userData.password; // This will re-hash due to save hook
            user.role = userData.role;
            user.avatar = userData.avatar;
            await user.save();
        } else {
            console.log('Creating new user...');
            user = await User.create(userData);
        }

        // Check if profile exists
        let profile = await StudentProfile.findOne({ user: user._id });
        if (profile) {
            console.log('Profile already exists. Updating...');
            profile.registerNumber = profileData.registerNumber;
            profile.department = profileData.department;
            profile.year = profileData.year;
            profile.domain = profileData.domain;
            profile.githubLink = profileData.githubLink;
            profile.linkedinLink = profileData.linkedinLink;
            profile.skills = profileData.skills;
            await profile.save();
        } else {
            console.log('Creating new profile...');
            profileData.user = user._id;
            profile = await StudentProfile.create(profileData);
        }

        console.log('Student Seeded Successfully!');
        console.log('User:', user);
        console.log('Profile:', profile);

        process.exit();
    } catch (error) {
        console.error('Error seeding student:', error);
        process.exit(1);
    }
};

seedStudent();
