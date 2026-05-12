const express = require('express');
const cors = require('cors');
const config = require('./config/app.config');
const fileRoutes = require('./routes/file.routes');
const errorHandler = require('./middleware/error.middleware');
const storageService = require('./services/storage.service');
const FileHelper = require('./utils/file.helper');
const path = require('path');

const app = express();

// Initialize storage
storageService.initialize().then(() => {
  console.log('Storage initialized');
});

// Ensure upload directory exists
FileHelper.ensureDirectoryExists(path.join(process.cwd(), config.uploadDir))
  .then(() => console.log('Upload directory ready'));

// Middleware
app.use(cors(config.corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', fileRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Allowed file types: ${config.allowedFileTypes.join(', ')}`);
  console.log(`Max file size: ${config.maxFileSize} bytes`);
});

module.exports = app;
