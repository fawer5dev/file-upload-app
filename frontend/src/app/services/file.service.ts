import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  FileConfiguration,
  FileMetadata,
  GroupedFiles
} from '../models/file.model';

/**
 * File Service
 * Handles all HTTP requests related to file operations
 */
@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get file upload configuration
   */
  getConfiguration(): Observable<FileConfiguration> {
    return this.http.get<ApiResponse<FileConfiguration>>(`${this.apiUrl}/config`)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  /**
   * Upload a file
   */
  uploadFile(file: File): Observable<FileMetadata> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse<FileMetadata>>(`${this.apiUrl}/upload`, formData)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  /**
   * Get all files grouped by category
   */
  getAllFilesGrouped(): Observable<GroupedFiles> {
    return this.http.get<ApiResponse<GroupedFiles>>(`${this.apiUrl}/files`)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  /**
   * Get files by extension
   */
  getFilesByExtension(extension: string): Observable<FileMetadata[]> {
    return this.http.get<ApiResponse<FileMetadata[]>>(`${this.apiUrl}/files/extension/${extension}`)
      .pipe(
        map(response => response.data!),
        catchError(this.handleError)
      );
  }

  /**
   * Get download URL for a file
   */
  getDownloadUrl(id: string): string {
    return `${this.apiUrl}/download/${id}`;
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, config: FileConfiguration): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check file size
    if (file.size > config.maxFileSize) {
      errors.push(`File size exceeds maximum allowed size of ${config.maxFileSizeFormatted}`);
    }

    // Check file type
    const extension = this.getFileExtension(file.name);
    if (!config.allowedFileTypes.includes(extension)) {
      errors.push(`File type ${extension} is not allowed. Allowed types: ${config.allowedFileTypes.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get file extension
   */
  getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? '.' + parts[parts.length - 1].toLowerCase() : '';
  }

  /**
   * Format file size to human readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.error || error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
