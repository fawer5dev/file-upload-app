const FileService = require('../src/services/file.service');
const storageService = require('../src/services/storage.service');
const FileHelper = require('../src/utils/file.helper');
const config = require('../src/config/app.config');

// Mock dependencies
jest.mock('../src/services/storage.service');
jest.mock('../src/utils/file.helper');

describe('FileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateFile - Positive Scenarios', () => {
    test('should validate a valid file successfully', () => {
      const mockFile = {
        originalname: 'test.pdf',
        size: 1024000, // 1MB
        mimetype: 'application/pdf'
      };

      FileHelper.getFileExtension.mockReturnValue('.pdf');
      FileHelper.isAllowedFileType.mockReturnValue(true);
      FileHelper.isValidFileSize.mockReturnValue(true);

      const result = FileService.validateFile(mockFile);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(FileHelper.getFileExtension).toHaveBeenCalledWith(mockFile.originalname);
      expect(FileHelper.isAllowedFileType).toHaveBeenCalledWith('.pdf');
      expect(FileHelper.isValidFileSize).toHaveBeenCalledWith(mockFile.size);
    });

    test('should validate multiple allowed file types', () => {
      const fileTypes = [
        { name: 'document.pdf', ext: '.pdf' },
        { name: 'image.jpg', ext: '.jpg' },
        { name: 'spreadsheet.xlsx', ext: '.xlsx' }
      ];

      fileTypes.forEach(({ name, ext }) => {
        const mockFile = {
          originalname: name,
          size: 1024000,
          mimetype: 'application/octet-stream'
        };

        FileHelper.getFileExtension.mockReturnValue(ext);
        FileHelper.isAllowedFileType.mockReturnValue(true);
        FileHelper.isValidFileSize.mockReturnValue(true);

        const result = FileService.validateFile(mockFile);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe('validateFile - Negative Scenarios', () => {
    test('should reject file when no file is provided', () => {
      const result = FileService.validateFile(null);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('No file provided');
    });

    test('should reject file with invalid file type', () => {
      const mockFile = {
        originalname: 'test.exe',
        size: 1024000,
        mimetype: 'application/x-msdownload'
      };

      config.allowedFileTypes = ['.pdf', '.jpg', '.png'];
      FileHelper.getFileExtension.mockReturnValue('.exe');
      FileHelper.isAllowedFileType.mockReturnValue(false);
      FileHelper.isValidFileSize.mockReturnValue(true);

      const result = FileService.validateFile(mockFile);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('not allowed');
    });

    test('should reject file exceeding maximum size', () => {
      const mockFile = {
        originalname: 'large-file.pdf',
        size: 10485760, // 10MB
        mimetype: 'application/pdf'
      };

      config.maxFileSize = 5242880; // 5MB
      FileHelper.getFileExtension.mockReturnValue('.pdf');
      FileHelper.isAllowedFileType.mockReturnValue(true);
      FileHelper.isValidFileSize.mockReturnValue(false);
      FileHelper.formatFileSize.mockReturnValue('5 MB');

      const result = FileService.validateFile(mockFile);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('exceeds maximum');
    });

    test('should reject file with both invalid type and size', () => {
      const mockFile = {
        originalname: 'large-file.exe',
        size: 10485760,
        mimetype: 'application/x-msdownload'
      };

      FileHelper.getFileExtension.mockReturnValue('.exe');
      FileHelper.isAllowedFileType.mockReturnValue(false);
      FileHelper.isValidFileSize.mockReturnValue(false);
      FileHelper.formatFileSize.mockReturnValue('5 MB');

      const result = FileService.validateFile(mockFile);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(2);
    });
  });

  describe('uploadFile - Positive Scenario', () => {
    test('should upload file and save metadata successfully', async () => {
      const mockFile = {
        filename: 'file-123456.pdf',
        originalname: 'test.pdf',
        size: 1024000,
        mimetype: 'application/pdf'
      };

      const mockMetadata = {
        id: 'mock-id-123',
        filename: mockFile.filename,
        originalName: mockFile.originalname,
        size: mockFile.size,
        mimeType: mockFile.mimetype,
        extension: '.pdf',
        uploadDate: expect.any(String)
      };

      FileHelper.getFileExtension.mockReturnValue('.pdf');
      storageService.addFile.mockResolvedValue(mockMetadata);

      const result = await FileService.uploadFile(mockFile);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('filename', mockFile.filename);
      expect(result).toHaveProperty('originalName', mockFile.originalname);
      expect(result).toHaveProperty('size', mockFile.size);
      expect(result).toHaveProperty('extension', '.pdf');
      expect(storageService.addFile).toHaveBeenCalled();
    });
  });

  describe('getAllFilesGrouped - Positive Scenario', () => {
    test('should group files by category correctly', async () => {
      const mockFiles = [
        { id: '1', filename: 'file1.pdf', extension: '.pdf', size: 1024, uploadDate: '2025-12-28' },
        { id: '2', filename: 'file2.jpg', extension: '.jpg', size: 2048, uploadDate: '2025-12-28' },
        { id: '3', filename: 'file3.pdf', extension: '.pdf', size: 1536, uploadDate: '2025-12-28' },
        { id: '4', filename: 'file4.xlsx', extension: '.xlsx', size: 3072, uploadDate: '2025-12-28' }
      ];

      storageService.getAllFiles.mockResolvedValue(mockFiles);
      FileHelper.getFileTypeCategory.mockImplementation((ext) => {
        if (ext === '.pdf') return 'documents';
        if (ext === '.jpg') return 'images';
        if (ext === '.xlsx') return 'spreadsheets';
        return 'others';
      });

      const result = await FileService.getAllFilesGrouped();

      expect(result).toHaveProperty('documents');
      expect(result).toHaveProperty('images');
      expect(result).toHaveProperty('spreadsheets');
      expect(result.documents).toHaveLength(2);
      expect(result.images).toHaveLength(1);
      expect(result.spreadsheets).toHaveLength(1);
    });
  });

  describe('getConfiguration', () => {
    test('should return correct configuration', () => {
      config.maxFileSize = 5242880;
      config.allowedFileTypes = ['.pdf', '.jpg', '.png'];
      FileHelper.formatFileSize.mockReturnValue('5 MB');

      const result = FileService.getConfiguration();

      expect(result).toHaveProperty('maxFileSize', 5242880);
      expect(result).toHaveProperty('maxFileSizeFormatted', '5 MB');
      expect(result).toHaveProperty('allowedFileTypes');
      expect(result.allowedFileTypes).toEqual(['.pdf', '.jpg', '.png']);
    });
  });
});
