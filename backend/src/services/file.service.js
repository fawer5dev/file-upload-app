const path = require('path');
const FileModel = require('../models/file.model');
const storageService = require('./storage.service');
const FileHelper = require('../utils/file.helper');
const config = require('../config/app.config');
const fs = require('fs').promises;

/**
 * File Service
 * Business logic for file operations
 */
class FileService {
  /**
   * Validate file before upload
   */
  validateFile(file) {
    const errors = [];

    if (!file) {
      errors.push('No file provided');
      return { valid: false, errors };
    }

    const extension = FileHelper.getFileExtension(file.originalname);

    if (!FileHelper.isAllowedFileType(extension)) {
      errors.push(`File type ${extension} is not allowed. Allowed types: ${config.allowedFileTypes.join(', ')}`);
    }

    if (!FileHelper.isValidFileSize(file.size)) {
      errors.push(`File size exceeds maximum allowed size of ${FileHelper.formatFileSize(config.maxFileSize)}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Upload file and save metadata
   */
  async uploadFile(file) {
    const extension = FileHelper.getFileExtension(file.originalname);
    
    const fileMetadata = new FileModel(
      file.filename,
      file.originalname,
      file.size,
      file.mimetype,
      extension,
      new Date().toISOString()
    );

    await storageService.addFile(fileMetadata.toJSON());
    return fileMetadata.toJSON();
  }

  /**
   * Get all files grouped by type
   */
  async getAllFilesGrouped() {
    const allFiles = await storageService.getAllFiles();
    const grouped = {};

    allFiles.forEach(file => {
      const category = FileHelper.getFileTypeCategory(file.extension);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(file);
    });

    return grouped;
  }

  /**
   * Get files by extension
   */
  async getFilesByExtension(extension) {
    return await storageService.getFilesByType(extension);
  }

  /**
   * Get configuration
   */
  getConfiguration() {
    return {
      maxFileSize: config.maxFileSize,
      maxFileSizeFormatted: FileHelper.formatFileSize(config.maxFileSize),
      allowedFileTypes: config.allowedFileTypes
    };
  }

  /**
   * Download file
   */
  async downloadFile(id) {
    const fileMetadata = await storageService.getFileById(id);
    if (!fileMetadata) {
      return null;
    }

    const filePath = path.join(process.cwd(), config.uploadDir, fileMetadata.filename);
    
    try {
      await fs.access(filePath);
      return {
        path: filePath,
        metadata: fileMetadata
      };
    } catch {
      return null;
    }
  }
}

module.exports = new FileService();
