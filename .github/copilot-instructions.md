<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# MERN Stack Agent Management System

This is a full-stack web application built with MongoDB, Express.js, React.js, and Node.js for managing agents and distributing CSV/Excel data among them.

## Key Features
- Admin authentication with JWT
- Agent CRUD operations with validation
- CSV/Excel file upload and parsing
- Automatic data distribution among agents
- Responsive React frontend with modern UI
- RESTful API with proper error handling

## Architecture
- **Backend**: Express.js server with MongoDB database using Mongoose ODM
- **Frontend**: React.js SPA with React Router and Context API for state management
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Processing**: Multer for uploads, csv-parser and xlsx for file parsing
- **UI/UX**: Custom CSS with responsive design and toast notifications

## Development Guidelines
- Follow RESTful API conventions
- Use async/await for asynchronous operations
- Implement proper error handling and validation
- Use React hooks and functional components
- Follow component-based architecture
- Maintain clean code with comments
