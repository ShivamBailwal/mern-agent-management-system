# MERN Stack Agent Management System

A comprehensive web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for managing agents and distributing CSV/Excel data among them.

## Features

### 🔐 Authentication
- Admin user login with JWT authentication
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 👥 Agent Management
- Create, read, update, and delete agents
- Each agent has: Name, Email, Mobile Number, Password
- Activate/deactivate agents
- Input validation and error handling

### 📊 CSV/Excel Upload & Distribution
- Upload CSV, XLSX, and XLS files
- Automatic validation of file format and structure
- Equal distribution of records among active agents
- Support for FirstName, Phone, and Notes columns
- View detailed distribution history
- Real-time distribution visualization

### 📈 Dashboard
- Overview statistics (total agents, active agents, distributions, records processed)
- Recent distributions list
- Quick action buttons

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **csv-parser** - CSV file parsing
- **xlsx** - Excel file parsing
- **joi** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Dropzone** - File upload interface

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mern-agent-management
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/mern-agent-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Setup
Make sure MongoDB is running. The application will automatically create the database and collections.

#### Create Admin User
Use a tool like MongoDB Compass or make a POST request to create the admin user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

## Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will run on http://localhost:5000

#### Start Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will run on http://localhost:3000

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Backend
```bash
cd backend
npm start
```

## Usage

### 1. Login
- Open http://localhost:3000
- Use the demo credentials:
  - Email: `admin@example.com`
  - Password: `password123`

### 2. Manage Agents
- Navigate to the "Agents" section
- Add new agents with their details
- Edit, activate/deactivate, or delete existing agents
- Ensure you have at least 5 active agents for proper distribution

### 3. Upload & Distribute
- Navigate to "Upload & Distribute"
- Drag and drop or click to select a CSV/Excel file
- Supported file formats: CSV, XLSX, XLS
- Required columns: FirstName, Phone, Notes
- The system will automatically distribute records equally among active agents

### 4. View Results
- Check the distribution history
- View detailed breakdown of how records were distributed
- Monitor statistics on the dashboard

## File Format Requirements

### CSV Format Example
```csv
FirstName,Phone,Notes
John,+1234567890,Follow up next week
Jane,+1987654321,Interested in product demo
Mike,+1122334455,
```

### Excel Format
- Use the same column headers: FirstName, Phone, Notes
- Data should be in the first worksheet

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register admin user

### Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get agent by ID
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Upload & Distribution
- `POST /api/upload` - Upload and distribute file
- `GET /api/upload/distributions` - Get all distributions
- `GET /api/upload/distributions/:id` - Get specific distribution

## Project Structure

```
mern-agent-management/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Agent.js
│   │   └── DistributedList.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── agents.js
│   │   └── upload.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Agents.js
│   │   │   ├── Upload.js
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .gitignore
│   └── package.json
└── README.md
```

## Features Implemented

✅ **Admin User Login** - JWT-based authentication with secure login
✅ **Agent Creation & Management** - Full CRUD operations for agents
✅ **CSV/Excel Upload** - Support for multiple file formats with validation
✅ **Data Distribution** - Equal distribution among agents with remainder handling
✅ **Responsive UI** - Modern, user-friendly interface
✅ **Error Handling** - Comprehensive validation and error messages
✅ **Dashboard** - Statistics and recent activity overview

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation with Joi
- File type and size validation
- Protected API routes
- SQL injection prevention with Mongoose

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the development team or create an issue in the repository.
