const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const { auth, isArtist } = require('../middleware/auth');

// Public routes
router.get('/', artistController.getAllArtists);
router.get('/featured', artistController.getFeaturedArtists);
router.get('/search', artistController.searchArtists);
router.get('/categories', artistController.getArtistCategories);
router.get('/:id', artistController.getArtistById);

// Protected routes (artist only)
router.put('/profile', auth, isArtist, artistController.updateArtistProfile);

module.exports = router;