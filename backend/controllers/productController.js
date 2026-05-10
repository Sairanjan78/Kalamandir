const Product = require('../models/Product');
const User = require('../models/User');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            artistId,
            featured,
            search,
            page = 1,
            limit = 12,
            sort = 'createdAt',
            order = 'desc'
        } = req.query;

        const query = { isActive: true };

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        // Filter by artist
        if (artistId) {
            query.artistId = artistId;
        }

        // Filter by featured
        if (featured === 'true') {
            query.isFeatured = true;
        }

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        const skip = (page - 1) * limit;
        const sortOrder = order === 'asc' ? 1 : -1;

        const products = await Product.find(query)
            .populate('artistId', 'name profileImage location')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ [sort]: sortOrder });

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate('artistId', 'name profileImage bio location phone');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Increment view count
        product.views += 1;
        await product.save();

        // Get related products
        const relatedProducts = await Product.find({
            _id: { $ne: id },
            category: product.category,
            isActive: true
        })
            .limit(4)
            .populate('artistId', 'name profileImage');

        res.json({
            success: true,
            data: {
                product,
                relatedProducts
            }
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Create product (artist only)
exports.createProduct = async (req, res) => {
    try {
        const productData = req.body;

        // Set artist ID from authenticated user
        productData.artistId = req.user._id;

        const product = new Product(productData);
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// Update product (artist only)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find product and verify ownership
        const product = await Product.findOne({ _id: id, artistId: req.user._id });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or you are not authorized to update it'
            });
        }

        Object.keys(updates).forEach(key => {
            product[key] = updates[key];
        });

        await product.save();

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete product (artist only)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find product and verify ownership
        const product = await Product.findOne({ _id: id, artistId: req.user._id });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or you are not authorized to delete it'
            });
        }

        // Soft delete by setting isActive to false
        product.isActive = false;
        await product.save();

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({
            isFeatured: true,
            isActive: true,
            stock: { $gt: 0 }
        })
            .populate('artistId', 'name profileImage location')
            .limit(8)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching featured products',
            error: error.message
        });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const products = await Product.find({
            category,
            isActive: true,
            stock: { $gt: 0 }
        })
            .populate('artistId', 'name profileImage location')
            .limit(20)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products by category',
            error: error.message
        });
    }
};

// Get product categories
exports.getProductCategories = async (req, res) => {
    try {
        const categories = await Product.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get product categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product categories',
            error: error.message
        });
    }
};