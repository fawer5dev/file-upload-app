import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../../services/file.service';
import { FileConfiguration } from '../../models/file.model';

/**
 * File Upload Component
 * Handles file selection and upload with validation
 */
@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  selectedFile: File | null = null;
  configuration: FileConfiguration | null = null;
  uploading = false;
  uploadSuccess = false;
  errors: string[] = [];
  successMessage = '';

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.loadConfiguration();
  }

  /**
   * Load file upload configuration
   */
  loadConfiguration(): void {
    this.fileService.getConfiguration().subscribe({
      next: (config) => {
        this.configuration = config;
      },
      error: (error) => {
        this.errors = [error.message];
      }
    });
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    this.clearMessages();
    
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.validateSelectedFile();
    }
  }

  /**
   * Validate selected file
   */
  validateSelectedFile(): void {
    if (!this.selectedFile || !this.configuration) {
      return;
    }

    const validation = this.fileService.validateFile(this.selectedFile, this.configuration);
    
    if (!validation.valid) {
      this.errors = validation.errors;
      this.selectedFile = null;
    }
  }

  /**
   * Upload selected file
   */
  uploadFile(): void {
    if (!this.selectedFile) {
      this.errors = ['Please select a file'];
      return;
    }

    this.uploading = true;
    this.clearMessages();

    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: (result) => {
        this.uploading = false;
        this.uploadSuccess = true;
        this.successMessage = `File "${result.originalName}" uploaded successfully!`;
        this.selectedFile = null;
        
        // Reset file input
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }

        // Emit event to parent component to refresh file list
        window.dispatchEvent(new Event('fileUploaded'));
      },
      error: (error) => {
        this.uploading = false;
        this.errors = [error.message];
      }
    });
  }

  /**
   * Clear all messages
   */
  clearMessages(): void {
    this.errors = [];
    this.successMessage = '';
    this.uploadSuccess = false;
  }

  /**
   * Get formatted file size
   */
  getFileSize(): string {
    return this.selectedFile 
      ? this.fileService.formatFileSize(this.selectedFile.size)
      : '';
  }
}
