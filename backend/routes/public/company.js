const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/public/companyController');

// Company routes
router.get('/', companyController.getCompanyInfo);
router.get('/seo', companyController.getCompanySEO);
router.get('/stats', companyController.getCompanyStats);
router.get('/achievements', companyController.getCompanyAchievements);
router.get('/values', companyController.getCompanyValues);
router.get('/mission-vision', companyController.getCompanyMissionVision);

module.exports = router;
