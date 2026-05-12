const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');
const upload = require('../middleware/upload.middleware');

/**
 * File Routes
 */

// Upload file
router.post('/upload', upload.single('file'), fileController.uploadFile);

// Get all files grouped by type
router.get('/files', fileController.getAllFiles);

// Get files by extension
router.get('/files/extension/:extension', fileController.getFilesByExtension);

// Get configuration
router.get('/config', fileController.getConfiguration);

// Download file
router.get('/download/:id', fileController.downloadFile);

module.exports = router;
