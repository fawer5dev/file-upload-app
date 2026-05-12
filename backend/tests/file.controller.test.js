const request = require('supertest');
const express = require('express');
const fileRoutes = require('../src/routes/file.routes');
const fileController = require('../src/controllers/file.controller');
const errorHandler = require('../src/middleware/error.middleware');

// Mock the controller
jest.mock('../src/controllers/file.controller');

// Create test app
const app = express();
app.use(express.json());
app.use('/api', fileRoutes);
app.use(errorHandler);

describe('File Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/config - Positive Scenario', () => {
    test('should return configuration successfully', async () => {
      const mockConfig = {
        maxFileSize: 5242880,
        maxFileSizeFormatted: '5 MB',
        allowedFileTypes: ['.pdf', '.jpg', '.png', '.docx']
      };

      fileController.getConfiguration.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockConfig
        });
      });

      const response = await request(app).get('/api/config');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('maxFileSize');
      expect(response.body.data).toHaveProperty('allowedFileTypes');
      expect(Array.isArray(response.body.data.allowedFileTypes)).toBe(true);
    });
  });

  describe('GET /api/files - Positive Scenario', () => {
    test('should return grouped files successfully', async () => {
      const mockFiles = {
        documents: [
          { id: '1', filename: 'doc1.pdf', size: 1024, uploadDate: '2025-12-28' }
        ],
        images: [
          { id: '2', filename: 'img1.jpg', size: 2048, uploadDate: '2025-12-28' }
        ]
      };

      fileController.getAllFiles.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: mockFiles
        });
      });

      const response = await request(app).get('/api/files');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('documents');
      expect(response.body.data).toHaveProperty('images');
    });

    test('should return empty object when no files exist', async () => {
      fileController.getAllFiles.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: {}
        });
      });

      const response = await request(app).get('/api/files');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({});
    });
  });

  describe('GET /api/files/extension/:extension - Negative Scenario', () => {
    test('should handle request for non-existent extension', async () => {
      fileController.getFilesByExtension.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: []
        });
      });

      const response = await request(app).get('/api/files/extension/.xyz');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/download/:id - Negative Scenario', () => {
    test('should return 404 when file does not exist', async () => {
      fileController.downloadFile.mockImplementation((req, res) => {
        res.status(404).json({
          success: false,
          error: 'File not found'
        });
      });

      const response = await request(app).get('/api/download/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('File not found');
    });
  });

  describe('POST /api/upload - Negative Scenario', () => {
    test('should return error when no file is uploaded', async () => {
      fileController.uploadFile.mockImplementation((req, res) => {
        res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      });

      const response = await request(app).post('/api/upload');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('No file uploaded');
    });
  });
});
