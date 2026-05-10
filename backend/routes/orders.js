const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, isArtist } = require('../middleware/auth');

// Customer routes
router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getUserOrders);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id/cancel', auth, orderController.cancelOrder);

// Artist routes
router.get('/artist/orders', auth, isArtist, orderController.getArtistOrders);
router.put('/:id/status', auth, isArtist, orderController.updateOrderStatus);

module.exports = router;