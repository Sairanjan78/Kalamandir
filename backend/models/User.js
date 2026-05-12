const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['artist', 'customer', 'admin'],
        default: 'customer'
    },
    profileImage: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        trim: true
    },
    location: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: {
            type: String,
            default: 'India'
        }
    },
    addresses: [{
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' },
        label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
        isDefault: { type: Boolean, default: false }
    }],
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    artistStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'none'],
        default: 'none'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Update updatedAt timestamp
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;