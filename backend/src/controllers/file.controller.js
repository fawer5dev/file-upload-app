const fileService = require('../services/file.service');

/**
 * File Controller
 * Handles HTTP requests for file operations
 */
class FileController {
  /**
   * Upload a file
   */
  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Validate file
      const validation = fileService.validateFile(req.file);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors
        });
      }

      // Upload file
      const fileMetadata = await fileService.uploadFile(req.file);

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: fileMetadata
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all files grouped by type
   */
  async getAllFiles(req, res, next) {
    try {
      const files = await fileService.getAllFilesGrouped();

      res.status(200).json({
        success: true,
        data: files
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get files by extension
   */
  async getFilesByExtension(req, res, next) {
    try {
      const { extension } = req.params;
      const files = await fileService.getFilesByExtension(extension);

      res.status(200).json({
        success: true,
        data: files
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get configuration
   */
  async getConfiguration(req, res, next) {
    try {
      const config = fileService.getConfiguration();

      res.status(200).json({
        success: true,
        data: config
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Download file
   */
  async downloadFile(req, res, next) {
    try {
      const { id } = req.params;
      const result = await fileService.downloadFile(id);

      if (!result) {
        return res.status(404).json({
          success: false,
          error: 'File not found'
        });
      }

      res.download(result.path, result.metadata.originalName);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FileController();
