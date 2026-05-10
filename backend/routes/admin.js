const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

router.get('/dashboard', auth, isAdmin, adminController.getDashboardStats);
router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.put('/update-status', auth, isAdmin, adminController.updateUserStatus);
router.delete('/user/:userId', auth, isAdmin, adminController.deleteUser);

module.exports = router;
