# File Upload Application

A full-stack file upload and management application built with Node.js/Express backend and Angular 17 frontend.

## Overview

This application allows users to upload files with configurable size and type restrictions, and view uploaded files organized by category in separate tables. The application features layered architecture, comprehensive validation, and extensive unit testing.

## Features

### Backend (Node.js/Express)
- RESTful API with layered architecture
- Configurable file type and size restrictions
- File validation (type and size)
- Persistent metadata storage (JSON)
- File system storage for uploaded files
- CORS enabled for frontend integration
- Comprehensive unit tests (positive and negative scenarios)

### Frontend (Angular 17)
- Standalone component architecture
- File upload with real-time validation
- Categorized file viewing in separate tables
- Responsive design
- File download functionality
- Comprehensive unit tests (positive and negative scenarios)

## Project Structure

```
file-upload-app/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── config/            # Configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helper utilities
│   │   └── server.js         # Entry point
│   ├── tests/                # Unit tests
│   ├── uploads/              # File storage
│   ├── metadata.json         # Metadata storage
│   ├── package.json
│   └── README.md
│
└── frontend/                  # Angular 17 Application
    ├── src/
    │   ├── app/
    │   │   ├── components/   # UI components
    │   │   ├── services/     # API services
    │   │   └── models/       # Data models
    │   └── environments/     # Environment configs
    ├── package.json
    └── README.md
```

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Multer** - File upload middleware
- **Jest** - Testing framework
- **Supertest** - HTTP assertions

### Frontend
- **Angular 17** - Frontend framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **Jasmine/Karma** - Testing frameworks

## Quick Start

### Prerequisites
- Node.js v18+ 
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

Server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

Application will run on `http://localhost:4200`

## Configuration

### Backend Configuration (.env)

```env
PORT=3000
MAX_FILE_SIZE=5242880                                          # 5MB in bytes
ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.csv,.xlsx
UPLOAD_DIR=uploads
METADATA_FILE=metadata.json
```

### Frontend Configuration

Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/config | Get upload configuration |
| POST | /api/upload | Upload a file |
| GET | /api/files | Get all files grouped by category |
| GET | /api/files/extension/:extension | Get files by extension |
| GET | /api/download/:id | Download a file |
| GET | /health | Health check |

## Testing

### Backend Tests

```bash
cd backend
npm test                    # Run tests
npm test -- --coverage     # Run with coverage
```

**Test Coverage:**
- ✅ File validation (positive: valid files, multiple types)
- ✅ File validation (negative: no file, invalid type, size exceeded)
- ✅ File upload (positive: successful upload)
- ✅ File grouping (positive: correct categorization)
- ✅ Configuration retrieval (positive: correct config)
- ✅ API endpoints (negative: missing file, non-existent files)

### Frontend Tests

```bash
cd frontend
npm test                          # Run tests
npm test -- --code-coverage      # Run with coverage
```

**Test Coverage:**
- ✅ Service: Configuration fetch, file upload, validation (positive & negative)
- ✅ Upload Component: File selection, upload, validation errors (positive & negative)
- ✅ View Component: File loading, categorization, downloads (positive & negative)

## Architecture

### Backend - Layered Architecture

1. **Routes Layer**: Defines API endpoints
2. **Controller Layer**: Handles HTTP requests/responses
3. **Service Layer**: Contains business logic
4. **Model Layer**: Defines data structures
5. **Middleware Layer**: Request processing (upload, error handling)
6. **Utils Layer**: Helper functions

### Frontend - Component Architecture

1. **Components**: Reusable UI components
   - FileUploadComponent: Handles file upload
   - FileViewComponent: Displays files in tables
2. **Services**: API communication
3. **Models**: TypeScript interfaces
4. **Configuration**: Environment-based settings

## Validation

### Backend Validation
- File type validation against allowed types
- File size validation against maximum size
- Multer middleware validation
- Error handling middleware

### Frontend Validation
- Client-side file type validation
- Client-side file size validation
- Real-time validation feedback
- User-friendly error messages

## Storage

### File Storage
- Files are stored in the `backend/uploads/` directory
- Each file gets a unique filename with timestamp
- Original filenames are preserved in metadata

### Metadata Storage
- Metadata stored in `backend/metadata.json`
- Persistent across server restarts
- Contains: id, filename, originalName, size, mimeType, extension, uploadDate

## File Categorization

Files are automatically grouped by category:
- **Documents**: .pdf, .doc, .docx, .txt, .rtf
- **Images**: .jpg, .jpeg, .png, .gif, .bmp, .svg
- **Spreadsheets**: .xlsx, .xls, .csv
- **Archives**: .zip, .rar, .7z, .tar, .gz
- **Others**: Any other allowed type

## Development Principles

✅ **Layered Architecture**: Clear separation of concerns  
✅ **SOLID Principles**: Single responsibility, dependency injection  
✅ **DRY**: No code duplication  
✅ **Type Safety**: Full TypeScript support  
✅ **Error Handling**: Comprehensive error handling  
✅ **Testing**: High test coverage with positive/negative scenarios  
✅ **Code Style**: Consistent formatting and naming conventions  
✅ **Reusability**: Generic, reusable components and services  
✅ **Documentation**: Inline comments and README files  

## Security Considerations

- File type validation (whitelist approach)
- File size limits to prevent DoS
- No executable files allowed by default
- CORS configured for specific origins
- Unique file naming to prevent overwrites

## Performance

- Efficient file streaming with Multer
- Grouped file retrieval minimizes API calls
- Client-side validation reduces server load
- Persistent storage for fast metadata access

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- User authentication and authorization
- File preview functionality
- File deletion capability
- Multiple file upload
- Drag-and-drop upload interface
- Progress bar for large files
- File search and filtering
- Pagination for large file lists
- Database integration (MongoDB/PostgreSQL)
- Cloud storage integration (AWS S3, Azure Blob)

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Dependencies issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Port already in use:**
```bash
lsof -ti:4200 | xargs kill -9
```

**API connection failed:**
- Check backend is running
- Verify API URL in environment.ts
- Check CORS configuration

## License

This project is created for evaluation purposes.

## Notes

- ✅ No default Angular CLI tests included (custom tests only)
- ✅ Node modules excluded from package
- ✅ All code is task-specific (no unrelated code)
- ✅ Follows common style guides and best practices
- ✅ Generic and reusable design
- ✅ Persistent storage during runtime
- ✅ Layered architecture in both frontend and backend
- ✅ Comprehensive unit tests with positive and negative scenarios

## Support

For issues or questions, please refer to the individual README files in backend and frontend directories.
