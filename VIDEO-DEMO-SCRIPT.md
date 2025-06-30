# Video Demonstration Script

## MERN Stack Agent Management System Demo

### Introduction (30 seconds)
- Welcome to the MERN Stack Agent Management System demonstration
- This application manages agents and distributes CSV/Excel data among them
- Built with MongoDB, Express.js, React.js, and Node.js

### 1. Application Overview (45 seconds)
- Show the login page with demo credentials
- Highlight the modern, responsive UI design
- Explain the three main features:
  1. Admin Authentication
  2. Agent Management
  3. CSV/Excel Upload & Distribution

### 2. Admin Login Demo (30 seconds)
- Navigate to http://localhost:3000
- Show the login form with validation
- Enter demo credentials:
  - Email: admin@example.com
  - Password: password123
- Demonstrate successful login and redirect to dashboard

### 3. Dashboard Overview (45 seconds)
- Show the main dashboard with statistics cards:
  - Total Agents
  - Active Agents
  - Total Distributions
  - Records Processed
- Display recent distributions table
- Show quick action buttons

### 4. Agent Management Demo (2 minutes)
- Navigate to the Agents section
- Demonstrate adding a new agent:
  - Name: John Doe
  - Email: john@example.com
  - Mobile: +1234567890
  - Password: password123
- Show form validation (required fields, email format, password length)
- Add 4 more agents to reach the required 5 agents:
  - Jane Smith (jane@example.com, +1987654321)
  - Mike Johnson (mike@example.com, +1122334455)
  - Sarah Wilson (sarah@example.com, +1555666777)
  - David Brown (david@example.com, +1444555666)
- Demonstrate editing an agent
- Show activate/deactivate functionality
- Display the agents list with status indicators

### 5. CSV Upload & Distribution Demo (2 minutes)
- Navigate to Upload & Distribute section
- Show file format requirements and validation rules
- Demonstrate file upload using the provided sample-data.csv:
  - Drag and drop the file into the upload area
  - Show upload progress indicator
  - Display successful upload message
- Show the distribution results:
  - Total records processed (25 records)
  - How records are distributed among 5 agents (5 each)
  - Agent-wise breakdown

### 6. Distribution Details (1 minute)
- Click "View Details" on a distribution
- Show the modal with complete distribution breakdown
- Display records assigned to each agent:
  - FirstName, Phone, Notes columns
  - How remainder records are handled
- Close the details modal

### 7. Excel File Demo (1 minute)
- Create a quick Excel file with the same data structure
- Upload the Excel file to show format support
- Confirm it processes correctly

### 8. Error Handling Demo (45 seconds)
- Try uploading an invalid file format (e.g., .txt)
- Show validation error message
- Try uploading with no agents active
- Demonstrate appropriate error handling

### 9. Features Recap (30 seconds)
- Summarize key features implemented:
  ✅ JWT Authentication
  ✅ Agent CRUD Operations
  ✅ File Upload with Validation
  ✅ Equal Distribution Algorithm
  ✅ Responsive UI Design
  ✅ Error Handling
  ✅ Dashboard Statistics

### 10. Technical Implementation (45 seconds)
- Briefly mention the tech stack:
  - Backend: Node.js, Express.js, MongoDB, JWT
  - Frontend: React.js, React Router, Axios
  - File Processing: Multer, csv-parser, xlsx
  - UI: Custom CSS with responsive design

### Conclusion (15 seconds)
- Thank you for watching the demonstration
- The application successfully meets all requirements
- Ready for production with proper environment configuration

## Total Video Duration: ~8-9 minutes

## Demo Checklist:
- [ ] MongoDB is running
- [ ] Admin user is created
- [ ] Both servers are running (backend & frontend)
- [ ] Sample CSV file is available
- [ ] All features are working correctly
- [ ] Recording software is set up

## Notes for Recording:
- Use screen recording software (OBS, Camtasia, etc.)
- Record in 1080p for better quality
- Speak clearly and at moderate pace
- Show actual functionality, not just UI
- Demonstrate error cases to show robustness
- Upload to Google Drive and share the link
