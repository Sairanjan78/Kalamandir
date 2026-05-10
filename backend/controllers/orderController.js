const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Create order from cart
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, billingAddress, paymentMethod } = req.body;

        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Calculate totals and validate products
        let subtotal = 0;
        const validatedItems = [];
        const artistIds = new Set();

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.productId} not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.title}`
                });
            }

            const itemPrice = product.discountedPrice || product.price;
            const itemTotal = itemPrice * item.quantity;

            validatedItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: itemPrice,
                title: product.title,
                image: product.images[0]?.url || ''
            });

            subtotal += itemTotal;
            artistIds.add(product.artistId.toString());
        }

        // For simplicity, assume one artist per order
        const artistId = Array.from(artistIds)[0];

        // Calculate shipping and tax (simplified)
        const shippingCost = 100; // Fixed shipping for demo
        const tax = subtotal * 0.18; // 18% GST
        const totalAmount = subtotal + shippingCost + tax;

        // Create order
        const order = new Order({
            userId: req.user._id,
            artistId,
            items: validatedItems,
            shippingAddress,
            billingAddress: billingAddress || { sameAsShipping: true },
            subtotal,
            shippingCost,
            tax,
            totalAmount,
            paymentMethod
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { userId: req.user._id };

        if (status) {
            query.orderStatus = status;
        }

        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('items.productId', 'title images');

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate('userId', 'name email phone')
            .populate('artistId', 'name email')
            .populate('items.productId', 'title images category');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns the order or is the artist
        if (order.userId._id.toString() !== req.user._id.toString() &&
            order.artistId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// Update order status (artist/admin only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, trackingNumber, trackingUrl } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user is the artist or admin
        if (order.artistId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only the artist or admin can update order status.'
            });
        }

        // Update order
        order.orderStatus = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (trackingUrl) order.trackingUrl = trackingUrl;

        if (status === 'shipped') {
            order.estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
        }

        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order',
            error: error.message
        });
    }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const order = await Order.findById(id);

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

        // Check if order can be cancelled
        const cancellableStatuses = ['pending', 'confirmed'];
        if (!cancellableStatuses.includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled in ${order.orderStatus} status`
            });
        }

        // Update order
        order.orderStatus = 'cancelled';
        order.cancellationReason = reason;

        await order.save();

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling order',
            error: error.message
        });
    }
};

// Get artist orders
exports.getArtistOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { artistId: req.user._id };

        if (status) {
            query.orderStatus = status;
        }

        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get artist orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching artist orders',
            error: error.message
        });
    }
};