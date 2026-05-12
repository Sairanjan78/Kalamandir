const Message = require('../models/Message');

// Submit a new message (Public)
exports.submitMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        const newMessage = await Message.create({ name, email, message });
        
        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully! We will get back to you soon.',
            data: newMessage
        });
    } catch (err) {
        console.error('Message Submission Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get all messages (Admin)
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort('-createdAt');
        res.json({ success: true, data: messages });
    } catch (err) {
        console.error('Get Messages Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update message status (Admin)
exports.updateMessageStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.json({ success: true, data: message });
    } catch (err) {
        console.error('Update Message Status Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete message (Admin)
exports.deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.json({ success: true, message: 'Message deleted successfully' });
    } catch (err) {
        console.error('Delete Message Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
