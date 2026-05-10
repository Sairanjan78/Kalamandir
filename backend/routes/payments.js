const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// Public routes
router.get('/methods', paymentController.getPaymentMethods);

// Protected routes
router.post('/create-order', auth, paymentController.createRazorpayOrder);
router.post('/verify', auth, paymentController.verifyPayment);
router.get('/status/:orderId', auth, paymentController.getPaymentStatus);
router.post('/refund', auth, paymentController.createRefund);

module.exports = router;