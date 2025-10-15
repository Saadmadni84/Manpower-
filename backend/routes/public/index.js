const express = require('express');
const router = express.Router();

// Import route modules
const companyRoutes = require('./company');
const servicesRoutes = require('./services');
const clientsRoutes = require('./clients');
const contractsRoutes = require('./contracts');
const jobsRoutes = require('./jobs');
const contactRoutes = require('./contact');
const galleryRoutes = require('./gallery');
const locationsRoutes = require('./locations');

// Use route modules
router.use('/company', companyRoutes);
router.use('/services', servicesRoutes);
router.use('/clients', clientsRoutes);
router.use('/contracts', contractsRoutes);
router.use('/jobs', jobsRoutes);
router.use('/contact', contactRoutes);
router.use('/gallery', galleryRoutes);
router.use('/locations', locationsRoutes);

module.exports = router;
