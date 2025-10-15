const express = require('express');
const router = express.Router();
const clientController = require('../../controllers/public/clientController');

// Public client routes
router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.get('/industry/:industry', clientController.getClientsByIndustry);

module.exports = router;
