# File Upload Frontend Application

An Angular 17 application for uploading and viewing files with validation and categorization.

## Features

- File upload with client-side validation
- Configurable file size and type restrictions
- Real-time validation feedback
- File viewing grouped by category (Documents, Images, Spreadsheets, etc.)
- Responsive tables showing file metadata (name, size, upload date)
- File download functionality
- Comprehensive unit tests with positive and negative scenarios
- Component-based architecture for reusability

## Architecture

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── file-upload/      # Upload component
│   │   │   └── file-view/        # View component
│   │   ├── services/
│   │   │   └── file.service.ts   # API service
│   │   ├── models/
│   │   │   └── file.model.ts     # Data models
│   │   ├── app.component.*       # Main component
│   │   └── app.config.ts         # App configuration
│   ├── environments/             # Environment configs
│   └── styles.css                # Global styles
├── angular.json                  # Angular configuration
├── tsconfig.json                 # TypeScript configuration
└── karma.conf.js                 # Test configuration
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (will be installed with dependencies)

## Setup Instructions

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Configuration

The API endpoint is configured in environment files:

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000/api'
};
```

Update the `apiUrl` if your backend runs on a different port or domain.

## Running the Application

### Development Server

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

The app will automatically reload when you make changes to the source files.

### Production Build

Build the application for production:
```bash
npm run build
```

Build files will be generated in the `dist/` directory.

## Running Tests

### Execute Unit Tests

Run all unit tests:
```bash
npm test
```

Run tests with code coverage:
```bash
npm run test -- --code-coverage
```

Coverage reports will be generated in the `coverage/` directory.

### Test Files

The application includes comprehensive unit tests:

1. **File Service Tests** (`file.service.spec.ts`):
   - Positive: Configuration fetching, file upload, grouped files retrieval, validation, formatting
   - Negative: Invalid file types, size limits, HTTP errors

2. **File Upload Component Tests** (`file-upload.component.spec.ts`):
   - Positive: Component creation, configuration loading, file selection, successful upload
   - Negative: Configuration errors, invalid files, upload failures

3. **File View Component Tests** (`file-view.component.spec.ts`):
   - Positive: Files loading, category filtering, formatting, downloads
   - Negative: Loading errors, empty states

## Components

### FileUploadComponent

**Purpose**: Handles file selection and upload with validation

**Features**:
- Displays allowed file types and size limits
- Client-side file validation
- Upload progress indication
- Success/error messages
- Automatic form reset after upload

**Inputs**: None

**Outputs**: Emits 'fileUploaded' event via window event dispatcher

### FileViewComponent

**Purpose**: Displays uploaded files in categorized tables

**Features**:
- Groups files by category (Documents, Images, Spreadsheets, Others)
- Displays file metadata (name, size, upload date)
- File download functionality
- Auto-refresh on new uploads
- Loading and error states

**Inputs**: None

**Outputs**: None

## Services

### FileService

**Purpose**: Handles all HTTP communication with the backend API

**Methods**:
- `getConfiguration()`: Fetch upload configuration
- `uploadFile(file: File)`: Upload a file
- `getAllFilesGrouped()`: Get files grouped by category
- `getFilesByExtension(extension: string)`: Get files by extension
- `getDownloadUrl(id: string)`: Get download URL
- `validateFile(file, config)`: Client-side validation
- `formatFileSize(bytes)`: Format bytes to readable format
- `getFileExtension(filename)`: Extract file extension

## Models

### FileMetadata
```typescript
interface FileMetadata {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  extension: string;
  uploadDate: string;
}
```

### FileConfiguration
```typescript
interface FileConfiguration {
  maxFileSize: number;
  maxFileSizeFormatted: string;
  allowedFileTypes: string[];
}
```

### GroupedFiles
```typescript
interface GroupedFiles {
  [category: string]: FileMetadata[];
}
```

## Styling

The application uses custom CSS with:
- Responsive design
- Modern UI components
- Color-coded feedback (success, error)
- Hover effects and transitions
- Mobile-friendly layout

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Principles

- **Standalone Components**: Uses Angular 17 standalone components
- **Reactive Programming**: RxJS for async operations
- **Separation of Concerns**: Clear separation between components, services, and models
- **Type Safety**: Full TypeScript type coverage
- **Testing**: Comprehensive unit test coverage
- **Reusability**: Generic components that can be reused
- **Error Handling**: Proper error handling and user feedback

## Integration with Backend

Ensure the backend API is running before starting the frontend application.

Backend should be available at: `http://localhost:3000`

CORS is configured in the backend to allow requests from `http://localhost:4200`

## Troubleshooting

### Port Already in Use
```bash
# Kill the process using port 4200
lsof -ti:4200 | xargs kill -9

# Or use a different port
ng serve --port 4201
```

### API Connection Issues
- Verify backend is running on port 3000
- Check CORS configuration in backend
- Verify environment.ts has correct API URL

### Test Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

## Notes

- The application does not include default CLI-generated test files
- All tests are custom-written for the specific functionality
- File storage and metadata are managed by the backend
- The frontend provides real-time validation before upload
- Files are automatically grouped by type on the server side
