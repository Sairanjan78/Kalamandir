const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    title: String,
    image: String
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        name: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: {
            type: String,
            default: 'India'
        }
    },
    billingAddress: {
        sameAsShipping: {
            type: Boolean,
            default: true
        },
        name: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    shippingCost: {
        type: Number,
        default: 0,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ['razorpay', 'cod', 'bank_transfer', 'other'],
        default: 'razorpay'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
        default: 'pending'
    },
    paymentId: String,
    paymentSignature: String,
    orderStatus: {
        type: String,
        enum: [
            'pending', 'confirmed', 'processing', 'shipped',
            'delivered', 'cancelled', 'returned', 'refunded'
        ],
        default: 'pending'
    },
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    notes: {
        type: String,
        maxlength: 500
    },
    cancellationReason: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate order ID before validation
orderSchema.pre('validate', function (next) {
    if (!this.orderId) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderId = `ORD${timestamp}${random}`;
    }
    this.updatedAt = Date.now();
    next();
});

// Create indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ artistId: 1, orderStatus: 1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ paymentStatus: 1, orderStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;