const mongoose = require('mongoose');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');

const uri = "mongodb+srv://lakshmi:12345@cluster1.6633l25.mongodb.net/industry5club";

const students = [
    {
        user: { name: 'Lubiga N', email: 'lubiganaveen@gmail.com', password: 'industry5.0@123', role: 'student', allowedRoles: ['student', 'secretary'], avatar: '/avatars/lubiga-profile.png' },
        profile: { registerNumber: '210624104103', department: 'CSE', year: 'II', domain: 'App development', githubLink: 'https://github.com/Lubiga-N', linkedinLink: 'https://www.linkedin.com/in/lubiga-n-ab4522328', skills: ['Java', 'SQL'] }
    }
];

const seed = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to Atlas for seeding...');

        for (const student of students) {
            let user = await User.findOne({ email: student.user.email });
            if (!user) {
                console.log('Creating user:', student.user.email);
                user = await User.create(student.user);
            }

            let profile = await StudentProfile.findOne({ user: user._id });
            if (!profile) {
                console.log('Creating profile for:', student.user.email);
                student.profile.user = user._id;
                await StudentProfile.create(student.profile);
            }
        }
        console.log('Seed successful!');
        process.exit(0);
    } catch (err) {
        console.error('Seed FAILED:', err.message);
        process.exit(1);
    }
};

seed();
