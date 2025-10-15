const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/public/serviceController');

// Public service routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.get('/category/:category', serviceController.getServicesByCategory);

module.exports = router;
