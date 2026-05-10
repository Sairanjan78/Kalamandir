const User = require('../models/User');
const Product = require('../models/Product');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeArtists = await User.countDocuments({ role: 'artist' });
        const totalProducts = await Product.countDocuments();
        
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
                    totalRevenue: 84200 // Mock for now until a Payment/Orders system exists
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

        // If rejected, auto-delete the user
        if (status === 'rejected') {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot remove admin' });
            await User.findByIdAndDelete(userId);
            return res.json({ success: true, message: 'Artist application rejected and account removed' });
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

        await User.findByIdAndDelete(userId);
        res.json({ success: true, message: 'User removed successfully' });
    } catch (err) {
        console.error('Admin Delete User Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
