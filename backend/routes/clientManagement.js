const express = require('express');
const router = express.Router();
const ClientManagementController = require('../controllers/clientManagementController');
const { authenticateAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Logo upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/client-logos');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'client-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|svg|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPEG, PNG, SVG, WEBP) are allowed!'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB limit
  fileFilter: fileFilter
});

// All routes require authentication
router.use(authenticateAdmin);

// Client routes
router.get('/', ClientManagementController.getAllClients);
router.get('/stats', ClientManagementController.getStatistics);
router.get('/export', ClientManagementController.exportClients);
router.get('/:id', ClientManagementController.getClientById);
router.post('/', upload.single('logo'), ClientManagementController.createClient);
router.put('/:id', upload.single('logo'), ClientManagementController.updateClient);
router.delete('/:id', ClientManagementController.deleteClient);
router.put('/reorder', ClientManagementController.reorderClients);
router.put('/:id/feature-toggle', ClientManagementController.toggleFeatured);
router.post('/bulk-actions', ClientManagementController.bulkActions);

module.exports = router;

