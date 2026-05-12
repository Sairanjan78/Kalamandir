const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth, isAdmin } = require('../middleware/auth');

// Public route to submit a message
router.post('/', messageController.submitMessage);

// Admin routes to manage messages
router.get('/', auth, isAdmin, messageController.getMessages);
router.put('/:id', auth, isAdmin, messageController.updateMessageStatus);
router.delete('/:id', auth, isAdmin, messageController.deleteMessage);

module.exports = router;
