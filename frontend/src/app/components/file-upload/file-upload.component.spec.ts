import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FileUploadComponent } from './file-upload.component';
import { FileService } from '../../services/file.service';
import { of, throwError } from 'rxjs';
import { FileConfiguration, FileMetadata } from '../../models/file.model';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let fileService: jasmine.SpyObj<FileService>;

  const mockConfig: FileConfiguration = {
    maxFileSize: 5242880,
    maxFileSizeFormatted: '5 MB',
    allowedFileTypes: ['.pdf', '.jpg', '.png']
  };

  beforeEach(async () => {
    const fileServiceSpy = jasmine.createSpyObj('FileService', [
      'getConfiguration',
      'uploadFile',
      'validateFile',
      'formatFileSize'
    ]);

    await TestBed.configureTestingModule({
      imports: [FileUploadComponent, HttpClientTestingModule],
      providers: [
        { provide: FileService, useValue: fileServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fileService = TestBed.inject(FileService) as jasmine.SpyObj<FileService>;
  });

  describe('Positive Scenarios', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load configuration on init', () => {
      fileService.getConfiguration.and.returnValue(of(mockConfig));

      component.ngOnInit();

      expect(fileService.getConfiguration).toHaveBeenCalled();
      expect(component.configuration).toEqual(mockConfig);
    });

    it('should handle file selection successfully', () => {
      component.configuration = mockConfig;
      fileService.validateFile.and.returnValue({ valid: true, errors: [] });

      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const event = {
        target: {
          files: [mockFile]
        }
      } as any;

      component.onFileSelected(event);

      expect(component.selectedFile).toEqual(mockFile);
      expect(component.errors.length).toBe(0);
    });

    it('should upload file successfully', (done) => {
      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      component.selectedFile = mockFile;

      const mockResult: FileMetadata = {
        id: '123',
        filename: 'file-123.pdf',
        originalName: 'test.pdf',
        size: 1024,
        mimeType: 'application/pdf',
        extension: '.pdf',
        uploadDate: '2025-12-28T10:00:00Z'
      };

      fileService.uploadFile.and.returnValue(of(mockResult));

      component.uploadFile();

      setTimeout(() => {
        expect(component.uploadSuccess).toBe(true);
        expect(component.uploading).toBe(false);
        expect(component.successMessage).toContain('uploaded successfully');
        expect(component.selectedFile).toBeNull();
        done();
      }, 100);
    });

    it('should clear messages when clearing', () => {
      component.errors = ['Error 1', 'Error 2'];
      component.successMessage = 'Success';
      component.uploadSuccess = true;

      component.clearMessages();

      expect(component.errors.length).toBe(0);
      expect(component.successMessage).toBe('');
      expect(component.uploadSuccess).toBe(false);
    });

    it('should format file size correctly', () => {
      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      component.selectedFile = mockFile;
      fileService.formatFileSize.and.returnValue('1 KB');

      const result = component.getFileSize();

      expect(fileService.formatFileSize).toHaveBeenCalled();
      expect(result).toBe('1 KB');
    });
  });

  describe('Negative Scenarios', () => {
    it('should handle configuration loading error', () => {
      const errorMessage = 'Failed to load configuration';
      fileService.getConfiguration.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      component.ngOnInit();

      setTimeout(() => {
        expect(component.errors.length).toBeGreaterThan(0);
        expect(component.errors[0]).toBe(errorMessage);
      }, 100);
    });

    it('should reject invalid file type', () => {
      component.configuration = mockConfig;
      fileService.validateFile.and.returnValue({
        valid: false,
        errors: ['File type .exe is not allowed']
      });

      const mockFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
      const event = {
        target: {
          files: [mockFile]
        }
      } as any;

      component.onFileSelected(event);

      expect(component.selectedFile).toBeNull();
      expect(component.errors.length).toBeGreaterThan(0);
      expect(component.errors[0]).toContain('not allowed');
    });

    it('should reject file exceeding size limit', () => {
      component.configuration = mockConfig;
      fileService.validateFile.and.returnValue({
        valid: false,
        errors: ['File size exceeds maximum allowed size']
      });

      const mockFile = new File(['test'], 'large.pdf', { type: 'application/pdf' });
      Object.defineProperty(mockFile, 'size', { value: 10485760 });

      const event = {
        target: {
          files: [mockFile]
        }
      } as any;

      component.onFileSelected(event);

      expect(component.selectedFile).toBeNull();
      expect(component.errors.length).toBeGreaterThan(0);
    });

    it('should handle upload error', (done) => {
      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      component.selectedFile = mockFile;

      const errorMessage = 'Upload failed';
      fileService.uploadFile.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      component.uploadFile();

      setTimeout(() => {
        expect(component.uploading).toBe(false);
        expect(component.uploadSuccess).toBe(false);
        expect(component.errors.length).toBeGreaterThan(0);
        expect(component.errors[0]).toBe(errorMessage);
        done();
      }, 100);
    });

    it('should show error when trying to upload without selecting file', () => {
      component.selectedFile = null;

      component.uploadFile();

      expect(component.errors.length).toBeGreaterThan(0);
      expect(component.errors[0]).toContain('select a file');
    });
  });
});
