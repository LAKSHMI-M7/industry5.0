const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');

dotenv.config();

const students = [
    {
        user: { name: 'Lakshmi Prabha.G', email: 'lakahmiprabha929@gmail.com', password: 'industry5.0@123', role: 'student', avatar: '/avatars/lakshmi-profile.jpg' },
        profile: { registerNumber: '210624205076', department: 'Information Technology', year: 'II', domain: 'AI AIML', githubLink: 'https://github.com/lakshmiprabhaganesanarumugam', linkedinLink: 'https://www.linkedin.com/in/lakshmiprabhag29', skills: ['python', 'ai', 'deep learning', 'machine learning', 'frontend(basics)', 'java(oops)basic'] }
    },
    {
        user: { name: 'Raghavi. M', email: 'mraghavimohan@gmail.com', password: 'industry5.0@123', role: 'student', avatar: '/avatars/raghavi-profile.jpg' },
        profile: { registerNumber: '210624205111', department: 'Information Technology - "B"', year: 'II', domain: 'Web development', githubLink: 'https://github.com/mraghavimohan-cpu/thermosense.git', linkedinLink: 'https://www.linkedin.com/in/raghavi-mohan-b45010328?utm_source=share_via&utm_content=profile&utm_medium=member_android', skills: ['Python', 'HTML', 'CSS', 'Java(Basics)'] }
    },
    {
        user: { name: 'Thanisha Alria Paul', email: 'thanishaalriapaul@gmail.com', password: 'industry5.0@123', role: 'student', avatar: '/avatars/thanisha-profile.png' },
        profile: { registerNumber: '210624205151', department: 'Information Technology', year: 'II', domain: 'Cybersecurity', githubLink: 'https://github.com/ThanishaAlriaPaul', linkedinLink: 'https://www.linkedin.com/in/thanisha-alria-paul-525789333?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', skills: ['Python', 'Java(Basics)', 'Html', 'SQL'] }
    },
    {
        user: { name: 'SANTHOSH KUMAR.P', email: 'santhoshsandy909248@gmail.com', password: 'industry5.0@123', role: 'student', avatar: '/avatars/santhosh-profile.png' },
        profile: { registerNumber: '210624205127', department: 'Information Technology - "C"', year: 'II', domain: 'UI/UX', githubLink: 'https://github.com/Santho-008', linkedinLink: 'https://www.linkedin.com/in/santhosh-kumar-p-763934305?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', skills: ['UI/UX', 'HTML', 'CSS'] }
    },
    {
        user: { name: 'Bharath K', email: 'kothandanbharath@gmail.com', password: 'industry5.0@123', role: 'student', avatar: '/avatars/bharath-profile.png' },
        profile: { registerNumber: '210624205025', department: 'Information Technology', year: 'II', domain: 'App Development', githubLink: 'https://github.com/bharathk867', linkedinLink: 'https://www.linkedin.com/in/bharath-kothandan-767186327?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', skills: ['HTML', 'CSS', 'Python', 'Dart', 'Flutter'] }
    },
    {
        user: { name: 'Kiruthika J', email: 'jjkiru2627@gmail.com', password: 'industry5.0@123', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Kiruthika+J&background=random' },
        profile: { registerNumber: '210624205071', department: 'Information Technology', year: 'II', domain: 'AIML', githubLink: 'https://github.com/Kiruthika-jagadeesh', linkedinLink: 'https://www.linkedin.com/in/kiruthika-jagadeesh-aa0759328', skills: ['Python', 'Java', 'C', 'AI Tools (n8n, Make AI, Replit, Base 44)'] }
    },
    {
        user: { name: 'Karthikeyan S', email: 'karthikeyansivakumar27@gmail.com', password: 'industry5.0@123', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Karthikeyan+S&background=random' },
        profile: { registerNumber: '210623205027', department: 'Information Technology', year: 'III', domain: 'Data Science', githubLink: 'https://github.com/karthikeyan272006', linkedinLink: 'https://www.linkedin.com/in/karthikeyan-s-45a821364?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', skills: ['Python', 'Advanced SQL', 'Data Visualization (Power BI, Tableau)', 'HTML', 'CSS', 'JavaScript', 'Data Cleaning'] }
    },
    {
        user: { name: 'Vijayalakshmi.S', email: 'vijayalakshmisettu15@gmail.com', password: 'industry5.0@123', role: 'student', avatar: '/avatars/vijayalakshmi-profile.png' },
        profile: { registerNumber: '210624205162', department: 'Information Technology', year: 'II', domain: 'Cloud computing', githubLink: 'https://github.com/vijayalakshmisettu15-sketch', linkedinLink: 'https://www.linkedin.com/in/vijayalakshmi-s-987664328?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', skills: ['Python', 'Java(basics)', 'Html'] }
    },
    {
        user: { name: 'Thriya. S', email: 'thiruvaimozhi07@gmail.com', password: 'industry5.0@123', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Thriya+S&background=random' },
        profile: { registerNumber: '21062420515', department: 'Information Technology', year: 'II', domain: 'Cybersecurity', githubLink: 'https://github.com/thiruvaimozhi07-glitch', linkedinLink: 'https://www.linkedin.com/in/thriya-senthil-24924a328?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', skills: ['Python', 'SQL', 'Power BI', 'HTML', 'Java(Basics)'] }
    }
];

const seedAllStudents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/industry5club');
        console.log('MongoDB Connected for Seeding');

        for (const student of students) {
            let user = await User.findOne({ email: student.user.email });
            if (user) {
                console.log(`User ${student.user.email} already exists. Updating...`);
                // Update fields
                user.name = student.user.name;
                // Only hash/save password if you want, but user.create already handles it.
                // If updating, we might skip password to avoid rehashing if we didn't implement checks? 
                // But my fix in User.js SHOULD prevent rehash if unmodified.
                // However, assigning user.password = plaintext updates 'password' field, so it will rehash.
                // This is fine for seeding (resetting password).
                user.password = student.user.password;
                user.role = student.user.role;
                user.avatar = student.user.avatar;
                await user.save();
            } else {
                console.log(`Creating new user: ${student.user.email}`);
                user = await User.create(student.user);
            }

            let profile = await StudentProfile.findOne({ user: user._id });
            if (profile) {
                console.log(`Profile for ${student.user.email} already exists. Updating...`);
                Object.assign(profile, student.profile);
                await profile.save();
            } else {
                console.log(`Creating new profile for: ${student.user.email}`);
                student.profile.user = user._id;
                profile = await StudentProfile.create(student.profile);
            }
        }

        console.log('\n✅ All students seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding students:', error);
        process.exit(1);
    }
};

seedAllStudents();
