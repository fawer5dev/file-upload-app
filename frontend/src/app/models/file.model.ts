/**
 * File metadata model
 */
export interface FileMetadata {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  extension: string;
  uploadDate: string;
}

/**
 * API response model
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
  message?: string;
}

/**
 * File configuration model
 */
export interface FileConfiguration {
  maxFileSize: number;
  maxFileSizeFormatted: string;
  allowedFileTypes: string[];
}

/**
 * Grouped files model
 */
export interface GroupedFiles {
  [category: string]: FileMetadata[];
}

/**
 * Upload result model
 */
export interface UploadResult {
  success: boolean;
  file?: FileMetadata;
  error?: string;
}
