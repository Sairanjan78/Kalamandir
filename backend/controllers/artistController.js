const ArtistProfile = require('../models/ArtistProfile');
const User = require('../models/User');
const Product = require('../models/Product');

// Get all artists
exports.getAllArtists = async (req, res) => {
    try {
        const { category, location, featured, page = 1, limit = 10 } = req.query;

        const query = {};

        // Filter by category
        if (category) {
            query.categories = category;
        }

        // Filter by location
        if (location) {
            query['workshopAddress.city'] = new RegExp(location, 'i');
        }

        // Filter by featured
        if (featured === 'true') {
            query.isFeatured = true;
        }

        const skip = (page - 1) * limit;

        const artists = await ArtistProfile.find(query)
            .populate('userId', 'name email profileImage bio location')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ rating: -1, createdAt: -1 });

        const total = await ArtistProfile.countDocuments(query);

        res.json({
            success: true,
            data: {
                artists,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get artists error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching artists',
            error: error.message
        });
    }
};

// Get artist by ID
exports.getArtistById = async (req, res) => {
    try {
        const { id } = req.params;

        const artistProfile = await ArtistProfile.findOne({ userId: id })
            .populate('userId', 'name email profileImage bio location phone createdAt');

        if (!artistProfile) {
            return res.status(404).json({
                success: false,
                message: 'Artist not found'
            });
        }

        // Get artist's products
        const products = await Product.find({ artistId: id, isActive: true })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            success: true,
            data: {
                artist: artistProfile,
                products,
                stats: {
                    totalProducts: await Product.countDocuments({ artistId: id, isActive: true }),
                    totalSales: 0 // Would come from orders in real implementation
                }
            }
        });
    } catch (error) {
        console.error('Get artist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching artist',
            error: error.message
        });
    }
};

// Update artist profile
exports.updateArtistProfile = async (req, res) => {
    try {
        const updates = req.body;

        // Find artist profile
        let artistProfile = await ArtistProfile.findOne({ userId: req.user._id });

        if (!artistProfile) {
            // Create artist profile if it doesn't exist
            artistProfile = new ArtistProfile({
                userId: req.user._id,
                ...updates
            });
        } else {
            // Update existing profile
            Object.keys(updates).forEach(key => {
                artistProfile[key] = updates[key];
            });
        }

        await artistProfile.save();

        res.json({
            success: true,
            message: 'Artist profile updated successfully',
            data: artistProfile
        });
    } catch (error) {
        console.error('Update artist profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating artist profile',
            error: error.message
        });
    }
};

// Get featured artists
exports.getFeaturedArtists = async (req, res) => {
    try {
        const artists = await ArtistProfile.find({ isFeatured: true })
            .populate('userId', 'name profileImage bio location')
            .limit(8)
            .sort({ rating: -1 });

        res.json({
            success: true,
            data: artists
        });
    } catch (error) {
        console.error('Get featured artists error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching featured artists',
            error: error.message
        });
    }
};

// Search artists
exports.searchArtists = async (req, res) => {
    try {
        const { q, category, location } = req.query;

        const userQuery = {};
        if (q) {
            userQuery.name = new RegExp(q, 'i');
        }

        // Find users matching search
        const users = await User.find(userQuery).select('_id');
        const userIds = users.map(user => user._id);

        const artistQuery = { userId: { $in: userIds } };

        if (category) {
            artistQuery.categories = category;
        }

        if (location) {
            artistQuery['workshopAddress.city'] = new RegExp(location, 'i');
        }

        const artists = await ArtistProfile.find(artistQuery)
            .populate('userId', 'name profileImage bio location')
            .limit(20);

        res.json({
            success: true,
            data: artists
        });
    } catch (error) {
        console.error('Search artists error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching artists',
            error: error.message
        });
    }
};

// Get artist categories
exports.getArtistCategories = async (req, res) => {
    try {
        const categories = await ArtistProfile.aggregate([
            { $unwind: '$categories' },
            { $group: { _id: '$categories', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};