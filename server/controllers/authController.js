const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};

const checkAndFillMissedAttendance = require('../utils/attendanceHelper');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            allowedRoles: user.allowedRoles,
            isFirstLogin: user.isFirstLogin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = req.body.password;
        user.isFirstLogin = false;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user avatar
// @route   POST /api/auth/avatar
// @access  Private
const updateAvatar = async (req, res) => {
    try {
        console.log('Update Avatar Request for User:', req.user._id);
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old avatar if it exists and is in uploads
        if (user.avatar && user.avatar.startsWith('/uploads/')) {
            // Remove leading / if present for path join to work correctly from root
            const relativePath = user.avatar.startsWith('/') ? user.avatar.substring(1) : user.avatar;
            const oldPath = path.join(__dirname, '..', relativePath);
            console.log('Deleting old avatar at:', oldPath);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        user.avatar = `/uploads/profiles/${req.file.filename}`;
        await user.save();

        res.json({
            message: 'Avatar updated successfully',
            avatar: user.avatar
        });
    } catch (error) {
        console.error('Avatar Upload Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, changePassword, updateAvatar };
