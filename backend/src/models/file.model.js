/**
 * File Model
 * Represents the structure of a file metadata object
 */
class FileModel {
  constructor(filename, originalName, size, mimeType, extension, uploadDate) {
    this.id = this.generateId();
    this.filename = filename;
    this.originalName = originalName;
    this.size = size;
    this.mimeType = mimeType;
    this.extension = extension;
    this.uploadDate = uploadDate || new Date().toISOString();
  }

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      id: this.id,
      filename: this.filename,
      originalName: this.originalName,
      size: this.size,
      mimeType: this.mimeType,
      extension: this.extension,
      uploadDate: this.uploadDate
    };
  }
}

module.exports = FileModel;
