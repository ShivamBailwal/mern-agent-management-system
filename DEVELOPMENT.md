# Development Setup Instructions

## Quick Start

### 1. Prerequisites
- MongoDB running locally on port 27017
- Node.js installed (v14 or higher)

### 2. Setup Admin User
Before starting the application, create the admin user:

```bash
cd backend
npm run setup
```

This will create an admin user with:
- Email: admin@example.com
- Password: password123

### 3. Start the Application
Use VS Code task: `Ctrl+Shift+P` → "Tasks: Run Task" → "Start MERN Application"

Or manually:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 5. Test Data
A sample CSV file (`sample-data.csv`) is included in the root directory for testing the upload functionality.

## Development Tasks Available

1. **Start MERN Application** - Starts both backend and frontend servers
2. **Setup Admin User** - Creates the initial admin user
3. **Start Backend Server** - Starts only the backend server
4. **Start Frontend Server** - Starts only the frontend server

## Environment Variables

The backend uses the following environment variables (see `backend/.env`):
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Backend server port (default: 5000)

## Features to Test

1. **Login** - Use admin@example.com / password123
2. **Agent Management** - Create, edit, delete agents
3. **File Upload** - Upload the sample CSV file
4. **Data Distribution** - View how data is distributed among agents
5. **Dashboard** - View statistics and recent activity
