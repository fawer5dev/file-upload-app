import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FileService } from './file.service';
import { FileConfiguration, FileMetadata, GroupedFiles } from '../models/file.model';
import { environment } from '../../environments/environment';

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileService]
    });
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Positive Scenarios', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should fetch configuration successfully', () => {
      const mockConfig: FileConfiguration = {
        maxFileSize: 5242880,
        maxFileSizeFormatted: '5 MB',
        allowedFileTypes: ['.pdf', '.jpg', '.png']
      };

      service.getConfiguration().subscribe(config => {
        expect(config).toEqual(mockConfig);
        expect(config.maxFileSize).toBe(5242880);
        expect(config.allowedFileTypes.length).toBe(3);
      });

      const req = httpMock.expectOne(`${apiUrl}/config`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockConfig });
    });

    it('should upload file successfully', () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const mockResponse: FileMetadata = {
        id: '123',
        filename: 'file-123.pdf',
        originalName: 'test.pdf',
        size: 1024,
        mimeType: 'application/pdf',
        extension: '.pdf',
        uploadDate: '2025-12-28T10:00:00Z'
      };

      service.uploadFile(mockFile).subscribe(result => {
        expect(result).toEqual(mockResponse);
        expect(result.originalName).toBe('test.pdf');
        expect(result.extension).toBe('.pdf');
      });

      const req = httpMock.expectOne(`${apiUrl}/upload`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);
      req.flush({ success: true, data: mockResponse });
    });

    it('should fetch all files grouped successfully', () => {
      const mockGroupedFiles: GroupedFiles = {
        documents: [
          {
            id: '1',
            filename: 'file1.pdf',
            originalName: 'doc1.pdf',
            size: 1024,
            mimeType: 'application/pdf',
            extension: '.pdf',
            uploadDate: '2025-12-28T10:00:00Z'
          }
        ],
        images: [
          {
            id: '2',
            filename: 'file2.jpg',
            originalName: 'image1.jpg',
            size: 2048,
            mimeType: 'image/jpeg',
            extension: '.jpg',
            uploadDate: '2025-12-28T11:00:00Z'
          }
        ]
      };

      service.getAllFilesGrouped().subscribe(files => {
        expect(files).toEqual(mockGroupedFiles);
        expect(Object.keys(files).length).toBe(2);
        expect(files['documents'].length).toBe(1);
        expect(files['images'].length).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/files`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockGroupedFiles });
    });

    it('should validate file correctly with valid file', () => {
      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(mockFile, 'size', { value: 1024000 });

      const mockConfig: FileConfiguration = {
        maxFileSize: 5242880,
        maxFileSizeFormatted: '5 MB',
        allowedFileTypes: ['.pdf', '.jpg', '.png']
      };

      const result = service.validateFile(mockFile, mockConfig);

      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should format file size correctly', () => {
      expect(service.formatFileSize(0)).toBe('0 Bytes');
      expect(service.formatFileSize(1024)).toBe('1 KB');
      expect(service.formatFileSize(1048576)).toBe('1 MB');
      expect(service.formatFileSize(1073741824)).toBe('1 GB');
    });

    it('should get file extension correctly', () => {
      expect(service.getFileExtension('test.pdf')).toBe('.pdf');
      expect(service.getFileExtension('image.jpg')).toBe('.jpg');
      expect(service.getFileExtension('document.DOCX')).toBe('.docx');
      expect(service.getFileExtension('noextension')).toBe('');
    });
  });

  describe('Negative Scenarios', () => {
    it('should reject file exceeding size limit', () => {
      const mockFile = new File(['test'], 'large.pdf', { type: 'application/pdf' });
      Object.defineProperty(mockFile, 'size', { value: 10485760 }); // 10MB

      const mockConfig: FileConfiguration = {
        maxFileSize: 5242880, // 5MB
        maxFileSizeFormatted: '5 MB',
        allowedFileTypes: ['.pdf', '.jpg', '.png']
      };

      const result = service.validateFile(mockFile, mockConfig);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('exceeds maximum');
    });

    it('should reject file with invalid type', () => {
      const mockFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
      Object.defineProperty(mockFile, 'size', { value: 1024 });

      const mockConfig: FileConfiguration = {
        maxFileSize: 5242880,
        maxFileSizeFormatted: '5 MB',
        allowedFileTypes: ['.pdf', '.jpg', '.png']
      };

      const result = service.validateFile(mockFile, mockConfig);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('not allowed');
    });

    it('should reject file with both invalid size and type', () => {
      const mockFile = new File(['test'], 'large.exe', { type: 'application/x-msdownload' });
      Object.defineProperty(mockFile, 'size', { value: 10485760 });

      const mockConfig: FileConfiguration = {
        maxFileSize: 5242880,
        maxFileSizeFormatted: '5 MB',
        allowedFileTypes: ['.pdf', '.jpg', '.png']
      };

      const result = service.validateFile(mockFile, mockConfig);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(2);
    });

    it('should handle HTTP error when fetching configuration', () => {
      service.getConfiguration().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('error');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/config`);
      req.flush({ error: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle HTTP error when uploading file', () => {
      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

      service.uploadFile(mockFile).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/upload`);
      req.flush({ error: 'Upload failed' }, { status: 400, statusText: 'Bad Request' });
    });
  });
});
