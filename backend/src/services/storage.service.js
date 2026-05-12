const fs = require('fs').promises;
const path = require('path');
const config = require('../config/app.config');

/**
 * Storage Service
 * Handles persistent storage of file metadata
 */
class StorageService {
  constructor() {
    this.metadataPath = path.join(process.cwd(), config.metadataFile);
  }

  /**
   * Initialize metadata file if it doesn't exist
   */
  async initialize() {
    try {
      await fs.access(this.metadataPath);
    } catch {
      await fs.writeFile(this.metadataPath, JSON.stringify([], null, 2));
    }
  }

  /**
   * Read all file metadata
   */
  async readMetadata() {
    try {
      await this.initialize();
      const data = await fs.readFile(this.metadataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading metadata:', error);
      return [];
    }
  }

  /**
   * Write file metadata
   */
  async writeMetadata(metadata) {
    try {
      await fs.writeFile(this.metadataPath, JSON.stringify(metadata, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing metadata:', error);
      return false;
    }
  }

  /**
   * Add new file metadata
   */
  async addFile(fileMetadata) {
    const metadata = await this.readMetadata();
    metadata.push(fileMetadata);
    await this.writeMetadata(metadata);
    return fileMetadata;
  }

  /**
   * Get all files
   */
  async getAllFiles() {
    return await this.readMetadata();
  }

  /**
   * Get files by type
   */
  async getFilesByType(fileType) {
    const metadata = await this.readMetadata();
    return metadata.filter(file => file.extension === fileType);
  }

  /**
   * Get file by id
   */
  async getFileById(id) {
    const metadata = await this.readMetadata();
    return metadata.find(file => file.id === id);
  }

  /**
   * Delete file metadata
   */
  async deleteFile(id) {
    const metadata = await this.readMetadata();
    const updatedMetadata = metadata.filter(file => file.id !== id);
    await this.writeMetadata(updatedMetadata);
    return true;
  }
}

module.exports = new StorageService();
