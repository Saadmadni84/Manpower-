const express = require('express');
const router = express.Router();
const contractController = require('../../controllers/public/contractController');

// Public contract routes
router.get('/', contractController.getAllContracts);
router.get('/:id', contractController.getContractById);
router.get('/status/:status', contractController.getContractsByStatus);

module.exports = router;
