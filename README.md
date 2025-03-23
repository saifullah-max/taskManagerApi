Task Manager API
🚀 Overview
The Task Manager API is a robust RESTful API that enables users to efficiently manage their tasks with authentication, validation, and secure session handling. Built using Node.js, Express, and MongoDB, this API provides JWT-based authentication, refresh tokens, and middleware support.

✨ Features
User Authentication (Signup, Login, Logout, JWT-based Authorization, Refresh Token)
Task Management (Create, Read, Update, Delete)
Task Status Handling (Pending, Completed, etc.)
Secure Session Handling (Access & Refresh Tokens)
Error Handling & Input Validation using Zod
Middleware for Authentication & Logging

🛠️ Tech Stack
Backend: Node.js, Express.js
Database: MongoDB & Mongoose
Authentication: JWT (JSON Web Token), Refresh Token
Validation: Zod
Middleware: Express Middleware

📥 Installation & Setup
✅ Prerequisites
Ensure you have the following installed:

Node.js (v16+ recommended)
MongoDB (Local or MongoDB Atlas)

🚀 Steps to Set Up Locally
Clone the Repository
git clone https://github.com/saifullah-max/taskManagerApi.git
cd task-manager-api

Install Dependencies
npm install
Create a .env File

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
REFRESH_SECRET=your_refresh_token_secret

Run the Server
npm start
The server will start at http://localhost:5000.

🌐 API Endpoints
🔑 Authentication

Method	Endpoint	Description
POST	/signup	Register a new user
POST	/login	Authenticate user & get tokens
GET	/auth/refresh	Refresh access token
POST	/logout	Logout user & clear refresh token

📌 Task Management
Method	Endpoint	Description
POST	/task/add	Create a new task
GET	/task/view	Get all tasks for user
PATCH	/task/update/:taskId	Update task details
PUT	/task/delete/:taskId	Delete a specific task

📌 Request & Response Examples
🔹 User Signup
Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
Response
{
  "success": true,
  "message": "User registered successfully",
  "token": "access_token_here",
  "refreshToken": "refresh_token_here"
}

🔹 Create Task
Request (Authenticated)
{
  "title": "Complete Project",
  "description": "Finish the final report",
  "dueDate": "2025-03-30"
}
Response
{
    "success": true,
    "message": "Task added successfully"
}

🔹 Logout
Request
POST /logout

Response
{
  "success": true,
  "message": "Logged out successfully"
}

⚙️ Middleware & Validation
Authentication Middleware (authMiddleware.js)
Request Validation with Zod (validationSchemas.js)
Error Handling Middleware (errorHandler.js)

🚀 Deployment
To deploy this API, consider using:

Render, Vercel, or Railway (for Express Backend)
MongoDB Atlas (for Database)

📬 Contact
For issues or contributions, feel free to open a pull request or contact me at saifullahahmed380@gmail.com or saifullahahmed945@gmail.com.
