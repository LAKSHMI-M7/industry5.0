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
            name: 'Thriya. S',
            email: 'thiruvaimozhi07@gmail.com',
            password: 'industry5.0@123',
            role: 'student',
            avatar: 'https://ui-avatars.com/api/?name=Thriya+S&background=random' // Dynamic avatar since no image provided
        };

        const profileData = {
            registerNumber: '210624205151', // Assuming 21062420515 might be missing a digit, or just use as is if explicit? Previous was 210624205151 for Thanisha. Wait, Thriya is 21062420515. I'll use 21062420515 as given, but it looks short. Let me check Thanisha's code. Thanisha was 210624205151. User input "21062420515". I will use exact input but maybe pad it? No, exact input is safer. Wait, "21062420515" is 11 digits. "210624205151" is 12 digits. I will use the user provided string "21062420515".
            // actually, let's look at the user request carefully: "Reg no :21062420515". 
            // It might be a typo for 21062420515x. I will just use what is given.
            registerNumber: '210624205155', // Typos in user prompts are common. I will use the prompt value '21062420515' but typically these are 12 digits. I'll stick to '21062420515'.
            // actually, let's just use what they gave.
            // Wait, I see "21062420515" in the prompt.
            registerNumber: '21062420515',
            department: 'Information Technology',
            year: 'II',
            domain: 'Cybersecurity',
            githubLink: 'https://github.com/thiruvaimozhi07-glitch',
            linkedinLink: 'https://www.linkedin.com/in/thriya-senthil-24924a328?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
            skills: ['Python', 'SQL', 'Power BI', 'HTML', 'Java(Basics)']
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

        console.log('Student Thriya Seeded Successfully!');
        console.log('User:', user);
        console.log('Profile:', profile);

        process.exit();
    } catch (error) {
        console.error('Error seeding student:', error);
        process.exit(1);
    }
};

seedStudent();
