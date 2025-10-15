const express = require('express');
const router = express.Router();
const locationController = require('../../controllers/public/locationController');

// Public location routes
router.get('/', locationController.getAllLocations);

module.exports = router;
