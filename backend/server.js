const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artists');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, '../frontend')));

// THE POWER: Link your local folder directly to the website
app.use('/api/my-pics', express.static('D:\\craft\\pic'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const connectDB = async () => {
    try {
        console.log('⏳ Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully (Atlas)');
    } catch (err) {
        console.error('❌ Primary MongoDB connection failed:', err.message);
        console.log('🔄 Attempting to connect to local MongoDB fallback...');
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/artMarketplace');
            console.log('✅ Connected to Local MongoDB successfully!');
        } catch (localErr) {
            console.error('❌ Failed to connect to local MongoDB as well:', localErr.message);
            return; // Exit if both fail
        }
    }

    // Auto-seed admin user from environment variables
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        try {
            const adminAccount = await User.findOne({ email: process.env.ADMIN_EMAIL });
            if (!adminAccount) {
                await User.create({
                    name: 'System Admin',
                    email: process.env.ADMIN_EMAIL,
                    password: process.env.ADMIN_PASSWORD,
                    role: 'admin',
                    isVerified: true
                });
                console.log(`👑 Admin user (${process.env.ADMIN_EMAIL}) created automatically`);
            } else if (adminAccount.role !== 'admin') {
                adminAccount.role = 'admin';
                await adminAccount.save();
                console.log(`⬆️  Existing user (${process.env.ADMIN_EMAIL}) promoted to Admin`);
            }
        } catch (err) {
            console.error('❌ Error seeding admin user:', err.message);
        }
    }
};

connectDB();

// Routes
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Welcome to the Indian Art Marketplace API',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// SPA Routing: Serve index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        message: 'Indian Art Marketplace API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 API available at http://localhost:${PORT}/api`);
});