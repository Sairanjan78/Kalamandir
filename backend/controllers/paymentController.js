const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { orderId, amount, currency = 'INR' } = req.body;

        // Validate order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns the order
        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            receipt: `receipt_${orderId}`,
            payment_capture: 1 // Auto capture
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Update order with Razorpay order ID
        order.paymentId = razorpayOrder.id;
        await order.save();

        res.json({
            success: true,
            data: {
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (error) {
        console.error('Create Razorpay order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment order',
            error: error.message
        });
    }
};

// Verify payment signature
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Update order with payment details
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.paymentStatus = 'paid';
        order.paymentId = razorpay_payment_id;
        order.paymentSignature = razorpay_signature;
        order.orderStatus = 'confirmed';

        await order.save();

        // Update product stock (in real implementation, you would decrement stock)

        res.json({
            success: true,
            message: 'Payment verified successfully',
            data: {
                orderId: order._id,
                paymentId: razorpay_payment_id,
                status: 'paid'
            }
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message
        });
    }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns the order
        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: {
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus,
                paymentId: order.paymentId,
                amount: order.totalAmount
            }
        });
    } catch (error) {
        console.error('Get payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment status',
            error: error.message
        });
    }
};

// Refund payment
exports.createRefund = async (req, res) => {
    try {
        const { orderId, amount, reason } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user is admin or artist
        if (req.user.role !== 'admin' && order.artistId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if payment was made
        if (!order.paymentId || order.paymentStatus !== 'paid') {
            return res.status(400).json({
                success: false,
                message: 'No payment to refund'
            });
        }

        // Create refund (in real implementation, call Razorpay API)
        // const refund = await razorpay.payments.refund(order.paymentId, {
        //   amount: Math.round(amount * 100),
        //   speed: 'normal',
        //   notes: {
        //     reason: reason || 'Customer request'
        //   }
        // });

        // For demo, simulate refund
        order.paymentStatus = 'refunded';
        order.orderStatus = 'refunded';
        await order.save();

        res.json({
            success: true,
            message: 'Refund initiated successfully',
            data: {
                orderId: order._id,
                refundStatus: 'processed'
            }
        });
    } catch (error) {
        console.error('Create refund error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating refund',
            error: error.message
        });
    }
};

// Get payment methods
exports.getPaymentMethods = async (req, res) => {
    try {
        // In real implementation, fetch from Razorpay API
        const paymentMethods = [
            {
                id: 'razorpay',
                name: 'Credit/Debit Card',
                description: 'Visa, Mastercard, RuPay, American Express',
                icon: '💳'
            },
            {
                id: 'upi',
                name: 'UPI',
                description: 'Google Pay, PhonePe, Paytm, BHIM',
                icon: '📱'
            },
            {
                id: 'netbanking',
                name: 'Net Banking',
                description: 'All major Indian banks',
                icon: '🏦'
            },
            {
                id: 'wallet',
                name: 'Wallets',
                description: 'Paytm Wallet, MobiKwik, FreeCharge',
                icon: '💰'
            },
            {
                id: 'cod',
                name: 'Cash on Delivery',
                description: 'Pay when you receive (limited availability)',
                icon: '💵'
            }
        ];

        res.json({
            success: true,
            data: paymentMethods
        });
    } catch (error) {
        console.error('Get payment methods error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment methods',
            error: error.message
        });
    }
};