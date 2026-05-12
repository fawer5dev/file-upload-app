const multer = require('multer');
const path = require('path');
const config = require('../config/app.config');
const FileHelper = require('../utils/file.helper');

/**
 * Configure multer storage
 */
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), config.uploadDir);
    await FileHelper.ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = FileHelper.getFileExtension(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

/**
 * File filter for multer
 */
const fileFilter = (req, file, cb) => {
  const extension = FileHelper.getFileExtension(file.originalname);
  
  if (FileHelper.isAllowedFileType(extension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${extension} is not allowed`), false);
  }
};

/**
 * Upload middleware configuration
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.maxFileSize
  },
  fileFilter: fileFilter
});

module.exports = upload;
