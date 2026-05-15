const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const { auth } = require('../middleware/auth');

// Cloudinary storage config
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "kalamandir",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "mp4", "webm", "mov"],
        resource_type: "auto" // Support both image and video
    },
});


// File filter for images and videos
const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|webm|mov/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images (jpg, png, gif, webp) and videos (mp4, webm, mov) are allowed'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

// Upload multiple files (max 6)
router.post('/', auth, upload.array('media', 6), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        const files = req.files.map(file => ({
            url: file.path, // Cloudinary URL
            originalName: file.originalname,
            type: file.mimetype.startsWith('video') ? 'video' : 'image',
            size: file.size
        }));

        res.json({ success: true, data: files });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

// Upload single profile photo (also using Cloudinary)
const profileUpload = multer({
    storage: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: "kalamandir/profiles",
            allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
            transformation: [{ width: 500, height: 500, crop: "fill" }]
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max for profile photos
});

router.post('/profile-photo', auth, profileUpload.single('photo'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const fileUrl = req.file.path; // Cloudinary URL
        res.json({ success: true, data: { url: fileUrl } });
    } catch (err) {
        console.error('Profile photo upload error:', err);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

module.exports = router;
