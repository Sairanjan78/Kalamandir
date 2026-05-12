const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ArtistProfile = require('../models/ArtistProfile');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeArtists = await User.countDocuments({ role: 'artist', artistStatus: 'approved' });
        const totalProducts = await Product.countDocuments({ isActive: true });
        
        // Calculate real revenue from completed orders
        let totalRevenue = 0;
        try {
            const revenueResult = await Order.aggregate([
                { $match: { status: { $in: ['delivered', 'shipped', 'confirmed'] } } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]);
            totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
        } catch (err) {
            // Order collection may not exist yet
            totalRevenue = 0;
        }
        
        // Fetch most recent users
        const recentUsers = await User.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .select('-password');
            
        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    activeArtists,
                    totalProducts,
                    totalRevenue
                },
                recentUsers
            }
        });
    } catch (err) {
        console.error('Admin Stats Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (err) {
        console.error('Admin Fetch Users Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateUserStatus = async (req, res) => {
    try {
        const { userId, status } = req.body;

        if (!['approved', 'rejected', 'pending', 'none'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        // If rejected, auto-delete the user and their products
        if (status === 'rejected') {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot remove admin' });
            
            // Cascading delete: Remove all products and profile created by this artist before deleting the account
            await Product.deleteMany({ artistId: userId });
            await ArtistProfile.deleteOne({ userId });
            
            await User.findByIdAndDelete(userId);
            return res.json({ success: true, message: 'Artist application rejected and account/products removed' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { artistStatus: status },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, data: user, message: `Artist status updated to ${status}` });
    } catch (err) {
        console.error('Admin Update Status Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user exists and is not an admin
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (userToDelete.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Administrator accounts cannot be removed for security reasons' });
        }

        // Cascading delete: Remove all products and profile data created by this user
        if (userToDelete.role === 'artist') {
            await Product.deleteMany({ artistId: userId });
            await ArtistProfile.deleteOne({ userId });
        }

        await User.findByIdAndDelete(userId);
        res.json({ success: true, message: 'User and their products removed successfully' });
    } catch (err) {
        console.error('Admin Delete User Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { price, stock } = req.body;
        
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        if (price !== undefined) product.price = price;
        if (stock !== undefined) product.stock = stock;
        
        await product.save();
        res.json({ success: true, message: 'Product updated successfully', data: product });
    } catch (err) {
        console.error('Admin Update Product Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: products });
    } catch (err) {
        console.error('Admin Fetch Products Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
