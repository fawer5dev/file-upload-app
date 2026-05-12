const path = require('path');
const fs = require('fs').promises;
const config = require('../config/app.config');

/**
 * File Helper Utility
 * Provides utility functions for file operations
 */
class FileHelper {
  /**
   * Get file extension from filename
   */
  static getFileExtension(filename) {
    return path.extname(filename).toLowerCase();
  }

  /**
   * Check if file type is allowed
   */
  static isAllowedFileType(extension) {
    return config.allowedFileTypes.includes(extension);
  }

  /**
   * Check if file size is within limit
   */
  static isValidFileSize(size) {
    return size <= config.maxFileSize;
  }

  /**
   * Format file size to human readable format
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Ensure directory exists
   */
  static async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Get grouped file types based on extension
   */
  static getFileTypeCategory(extension) {
    const categories = {
      images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'],
      documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
      spreadsheets: ['.xlsx', '.xls', '.csv'],
      archives: ['.zip', '.rar', '.7z', '.tar', '.gz']
    };

    for (const [category, extensions] of Object.entries(categories)) {
      if (extensions.includes(extension)) {
        return category;
      }
    }
    return 'others';
  }
}

module.exports = FileHelper;
