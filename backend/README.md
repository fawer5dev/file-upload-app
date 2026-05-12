# File Upload Backend API

A RESTful API built with Node.js and Express for handling file uploads with validation and metadata management.

## Features

- File upload with configurable size and type restrictions
- File metadata storage (persistent JSON storage)
- File validation (type and size)
- Grouped file retrieval by category
- File download functionality
- Layered architecture (Controllers, Services, Models, Middleware)
- Comprehensive unit tests
- CORS enabled for frontend integration

## Architecture

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper utilities
│   └── server.js        # Application entry point
├── tests/               # Unit tests
├── uploads/             # Uploaded files storage
└── metadata.json        # File metadata storage
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional):
Edit `.env` file to customize:
- `PORT`: Server port (default: 3000)
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 5242880 = 5MB)
- `ALLOWED_FILE_TYPES`: Comma-separated list of allowed extensions

### Running the Application

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### Running Tests

Execute unit tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## API Endpoints

### 1. Get Configuration
```
GET /api/config
```
Returns allowed file types and maximum file size.

### 2. Upload File
```
POST /api/upload
Content-Type: multipart/form-data
Body: file (form-data)
```
Uploads a file with validation.

### 3. Get All Files
```
GET /api/files
```
Returns all files grouped by category (documents, images, spreadsheets, etc.).

### 4. Get Files by Extension
```
GET /api/files/extension/:extension
```
Returns files filtered by specific extension.

### 5. Download File
```
GET /api/download/:id
```
Downloads a file by its ID.

### 6. Health Check
```
GET /health
```
Returns server status.

## Configuration

Default configuration in `.env`:
- **Allowed Types**: .pdf, .doc, .docx, .jpg, .jpeg, .png, .txt, .csv, .xlsx
- **Max Size**: 5MB (5242880 bytes)
- **Upload Directory**: uploads/
- **Metadata Storage**: metadata.json

## Testing

The project includes comprehensive unit tests covering:

### Backend Tests (Positive Scenarios):
- Valid file validation
- Multiple file type validation
- Successful file upload
- Correct file grouping by category
- Configuration retrieval

### Backend Tests (Negative Scenarios):
- Missing file validation
- Invalid file type rejection
- File size limit enforcement
- Multiple validation errors
- Non-existent file handling
- Missing file upload error

## Technologies Used

- **Express**: Web framework
- **Multer**: File upload middleware
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment configuration
- **Jest**: Testing framework
- **Supertest**: HTTP assertions

## Notes

- Files are stored in the `uploads/` directory
- Metadata is persisted in `metadata.json`
- Storage remains persistent during runtime
- CORS is configured for Angular frontend (http://localhost:4200)
