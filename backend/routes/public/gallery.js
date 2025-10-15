const express = require('express');
const router = express.Router();
const galleryController = require('../../controllers/public/galleryController');

// Public gallery routes
router.get('/categories', galleryController.getCategories);
router.get('/images', galleryController.getImages);
router.get('/images/category/:category', galleryController.getImagesByCategory);
router.get('/images/:id', galleryController.getImageById);

module.exports = router;
