import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FileViewComponent } from './file-view.component';
import { FileService } from '../../services/file.service';
import { of, throwError } from 'rxjs';
import { GroupedFiles, FileMetadata } from '../../models/file.model';

describe('FileViewComponent', () => {
  let component: FileViewComponent;
  let fixture: ComponentFixture<FileViewComponent>;
  let fileService: jasmine.SpyObj<FileService>;

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
      },
      {
        id: '2',
        filename: 'file2.docx',
        originalName: 'doc2.docx',
        size: 2048,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extension: '.docx',
        uploadDate: '2025-12-28T11:00:00Z'
      }
    ],
    images: [
      {
        id: '3',
        filename: 'file3.jpg',
        originalName: 'image1.jpg',
        size: 3072,
        mimeType: 'image/jpeg',
        extension: '.jpg',
        uploadDate: '2025-12-28T12:00:00Z'
      }
    ]
  };

  beforeEach(async () => {
    const fileServiceSpy = jasmine.createSpyObj('FileService', [
      'getAllFilesGrouped',
      'formatFileSize',
      'getDownloadUrl'
    ]);

    await TestBed.configureTestingModule({
      imports: [FileViewComponent, HttpClientTestingModule],
      providers: [
        { provide: FileService, useValue: fileServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FileViewComponent);
    component = fixture.componentInstance;
    fileService = TestBed.inject(FileService) as jasmine.SpyObj<FileService>;
  });

  describe('Positive Scenarios', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load files on init', () => {
      fileService.getAllFilesGrouped.and.returnValue(of(mockGroupedFiles));

      component.ngOnInit();

      expect(fileService.getAllFilesGrouped).toHaveBeenCalled();
      expect(component.groupedFiles).toEqual(mockGroupedFiles);
      expect(component.categories.length).toBe(2);
      expect(component.loading).toBe(false);
    });

    it('should get files for specific category', () => {
      component.groupedFiles = mockGroupedFiles;

      const documentFiles = component.getFilesForCategory('documents');
      const imageFiles = component.getFilesForCategory('images');

      expect(documentFiles.length).toBe(2);
      expect(imageFiles.length).toBe(1);
    });

    it('should return empty array for non-existent category', () => {
      component.groupedFiles = mockGroupedFiles;

      const files = component.getFilesForCategory('nonexistent');

      expect(files.length).toBe(0);
    });

    it('should format file size correctly', () => {
      fileService.formatFileSize.and.returnValue('1 KB');

      const result = component.formatFileSize(1024);

      expect(fileService.formatFileSize).toHaveBeenCalledWith(1024);
      expect(result).toBe('1 KB');
    });

    it('should format date correctly', () => {
      const dateString = '2025-12-28T10:00:00Z';
      const result = component.formatDate(dateString);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should get category display name correctly', () => {
      expect(component.getCategoryDisplayName('documents')).toBe('Documents');
      expect(component.getCategoryDisplayName('images')).toBe('Images');
      expect(component.getCategoryDisplayName('spreadsheets')).toBe('Spreadsheets');
    });

    it('should check if files exist', () => {
      component.categories = ['documents', 'images'];
      expect(component.hasFiles()).toBe(true);

      component.categories = [];
      expect(component.hasFiles()).toBe(false);
    });

    it('should trigger file download', () => {
      const mockFile: FileMetadata = mockGroupedFiles.documents[0];
      const downloadUrl = 'http://localhost:3000/api/download/1';
      
      fileService.getDownloadUrl.and.returnValue(downloadUrl);
      spyOn(window, 'open');

      component.downloadFile(mockFile);

      expect(fileService.getDownloadUrl).toHaveBeenCalledWith(mockFile.id);
      expect(window.open).toHaveBeenCalledWith(downloadUrl, '_blank');
    });
  });

  describe('Negative Scenarios', () => {
    it('should handle error when loading files', () => {
      const errorMessage = 'Failed to load files';
      fileService.getAllFilesGrouped.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      component.loadFiles();

      setTimeout(() => {
        expect(component.loading).toBe(false);
        expect(component.error).toBe(errorMessage);
        expect(component.groupedFiles).toEqual({});
      }, 100);
    });

    it('should handle empty file list', () => {
      fileService.getAllFilesGrouped.and.returnValue(of({}));

      component.ngOnInit();

      expect(component.groupedFiles).toEqual({});
      expect(component.categories.length).toBe(0);
      expect(component.hasFiles()).toBe(false);
    });

    it('should show loading state while fetching files', () => {
      fileService.getAllFilesGrouped.and.returnValue(of(mockGroupedFiles));

      component.loadFiles();

      // Before the observable completes
      expect(component.loading).toBe(true);
    });
  });
});
