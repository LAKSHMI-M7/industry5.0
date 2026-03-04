const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security: Helmet for basic production security
app.use(helmet({
    crossOriginResourcePolicy: false, // Essential for serving images from /uploads
}));

// Security: Trust proxy (needed for Render/Vercel load balancers)
app.set("trust proxy", 1);

// Configure Production CORS
const allowedOrigins = [
    'https://industry-5-0.vercel.app',
    'https://industry5-0.vercel.app', // Actual URL in screenshot
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            console.log('Origin not allowed:', origin);
            return callback(null, true); // Temporarily allow all for debugging
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static serves
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/secretary', require('./routes/secretaryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/posters', require('./routes/posterRoutes'));
app.use('/api/club-info', require('./routes/clubInfoRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

app.get('/api/health', async (req, res) => {
    const User = require('./models/User');
    try {
        const userCount = await User.countDocuments();
        const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
        res.json({
            status: 'OK',
            database: dbStatus,
            users: userCount,
            env: process.env.NODE_ENV
        });
    } catch (err) {
        res.status(500).json({ status: 'Error', error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
});



const PORT = process.env.PORT || 5000;

if (!process.env.PORT && process.env.NODE_ENV === 'production') {
    console.warn('WARNING: PORT is not defined in environment variables. Defaulting to 5000.');
}

// Listen only if not running as a Vercel serverless function
if (!process.env.VERCEL) {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;

