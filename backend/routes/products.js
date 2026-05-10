const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, isArtist } = require('../middleware/auth');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/categories', productController.getProductCategories);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);

// Protected routes (artist only)
router.post('/', auth, isArtist, productController.createProduct);
router.put('/:id', auth, isArtist, productController.updateProduct);
router.delete('/:id', auth, isArtist, productController.deleteProduct);

module.exports = router;