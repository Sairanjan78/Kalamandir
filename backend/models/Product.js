const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Painting', 'Sculpture', 'Pottery', 'Textile',
            'Jewelry', 'Woodwork', 'Metalwork', 'Paper Art',
            'Mixed Media', 'Digital Art', 'Traditional Craft',
            'Home Decor', 'Fashion', 'Other'
        ]
    },
    subCategory: {
        type: String,
        enum: [
            'Madhubani', 'Warli', 'Pattachitra', 'Miniature',
            'Tanjore', 'Kalamkari', 'Phad', 'Gond',
            'Terracotta', 'Bronze', 'Brass', 'Copper',
            'Silk', 'Cotton', 'Wool', 'Bamboo',
            'Clay', 'Stone', 'Wood', 'Glass'
        ]
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative'],
        default: 1
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        altText: String,
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    dimensions: {
        height: String,
        width: String,
        depth: String,
        unit: {
            type: String,
            enum: ['cm', 'inch', 'mm', 'm'],
            default: 'cm'
        }
    },
    weight: {
        value: Number,
        unit: {
            type: String,
            enum: ['g', 'kg', 'lb'],
            default: 'g'
        }
    },
    materials: [String],
    techniques: [String],
    yearCreated: Number,
    isHandmade: {
        type: Boolean,
        default: true
    },
    isCustomizable: {
        type: Boolean,
        default: false
    },
    customizationOptions: {
        type: String,
        maxlength: 500
    },
    shippingInfo: {
        domestic: {
            cost: Number,
            days: String
        },
        international: {
            cost: Number,
            days: String,
            available: {
                type: Boolean,
                default: false
            }
        }
    },
    tags: [String],
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
    isActive: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
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

// Calculate discounted price
productSchema.virtual('discountedPrice').get(function () {
    if (this.discount > 0) {
        return this.price * (1 - this.discount / 100);
    }
    return this.price;
});

// Update timestamp on save
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    // Set primary image if not set
    if (this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
        this.images[0].isPrimary = true;
    }

    next();
});

// Create indexes for search
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1, rating: -1 });
productSchema.index({ artistId: 1, createdAt: -1 });
productSchema.index({ isFeatured: 1, createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;