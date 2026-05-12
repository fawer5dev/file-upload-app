import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../../services/file.service';
import { FileMetadata, GroupedFiles } from '../../models/file.model';
import { Subscription } from 'rxjs';

/**
 * File View Component
 * Displays uploaded files in tables grouped by category
 */
@Component({
  selector: 'app-file-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css']
})
export class FileViewComponent implements OnInit, OnDestroy {
  groupedFiles: GroupedFiles = {};
  loading = false;
  error = '';
  categories: string[] = [];
  private fileUploadSubscription?: Subscription;

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.loadFiles();
    
    // Listen for file upload events
    window.addEventListener('fileUploaded', () => this.loadFiles());
  }

  ngOnDestroy(): void {
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription.unsubscribe();
    }
    window.removeEventListener('fileUploaded', () => this.loadFiles());
  }

  /**
   * Load all files grouped by category
   */
  loadFiles(): void {
    this.loading = true;
    this.error = '';

    this.fileService.getAllFilesGrouped().subscribe({
      next: (files) => {
        this.groupedFiles = files;
        this.categories = Object.keys(files);
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  /**
   * Get files for a specific category
   */
  getFilesForCategory(category: string): FileMetadata[] {
    return this.groupedFiles[category] || [];
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    return this.fileService.formatFileSize(bytes);
  }

  /**
   * Format upload date
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  /**
   * Download file
   */
  downloadFile(file: FileMetadata): void {
    const url = this.fileService.getDownloadUrl(file.id);
    window.open(url, '_blank');
  }

  /**
   * Get category display name
   */
  getCategoryDisplayName(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  /**
   * Check if there are any files
   */
  hasFiles(): boolean {
    return this.categories.length > 0;
  }
}
