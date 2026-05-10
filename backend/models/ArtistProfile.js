const mongoose = require('mongoose');

const artistProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    categories: [{
        type: String,
        enum: [
            'Madhubani', 'Warli', 'Pattachitra', 'Miniature',
            'Tanjore', 'Kalamkari', 'Phad', 'Gond',
            'Pottery', 'Terracotta', 'Metalwork', 'Woodwork',
            'Textile', 'Embroidery', 'Jewelry', 'Sculpture',
            'Other'
        ]
    }],
    experience: {
        type: Number, // years of experience
        min: 0
    },
    awards: [{
        title: String,
        year: Number,
        description: String
    }],
    education: [{
        degree: String,
        institution: String,
        year: Number
    }],
    portfolio: [{
        imageUrl: String,
        title: String,
        description: String,
        year: Number,
        category: String
    }],
    socialLinks: {
        website: String,
        instagram: String,
        facebook: String,
        youtube: String
    },
    artStyle: {
        type: String,
        maxlength: 200
    },
    materialsUsed: [String],
    workshopAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: {
            type: String,
            default: 'India'
        }
    },
    acceptsCommissions: {
        type: Boolean,
        default: false
    },
    commissionDetails: {
        type: String,
        maxlength: 500
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    verifiedArtist: {
        type: Boolean,
        default: false
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

// Update timestamp on save
artistProfileSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create index for search
artistProfileSchema.index({ categories: 1, rating: -1 });
artistProfileSchema.index({ 'workshopAddress.city': 1, 'workshopAddress.state': 1 });

const ArtistProfile = mongoose.model('ArtistProfile', artistProfileSchema);

module.exports = ArtistProfile;