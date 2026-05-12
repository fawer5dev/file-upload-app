require('dotenv').config();

/**
 * Application configuration module
 * Centralizes all configuration settings
 */
module.exports = {
  port: process.env.PORT || 3000,
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB default
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES 
    ? process.env.ALLOWED_FILE_TYPES.split(',')
    : ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt', '.csv', '.xlsx'],
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  metadataFile: process.env.METADATA_FILE || 'metadata.json',
  corsOptions: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true
  }
};
