# TMS - Complaint Management System

## Project Complete ✓

### What Has Been Created

A complete MERN stack application for managing complaints related to hardware, software, and various other issues.

---

## Project Components

### server (Node.js + Express + MongoDB)

#### Configuration & Setup

- ✓ `.env.example` - Environment configuration template
- ✓ `.gitignore` - Git ignore rules
- ✓ `package.json` - Dependencies and scripts
- ✓ `server.js` - Main server entry point

#### Database Models (MongoDB)

- ✓ `User.js` - User accounts with roles and departments
- ✓ `Department.js` - Department master data
- ✓ `Programme.js` - Programme/course data
- ✓ `Block.js` - Building/block information
- ✓ `Room.js` - Room/classroom data
- ✓ `Role.js` - Role definitions
- ✓ `Complaint.js` - Ticket/complaint system logic

#### Middleware

- ✓ `auth.js` - JWT authentication middleware
- ✓ `roleCheck.js` - Role-based access control

#### Controllers (Business Logic)

- ✓ `authController.js` - Login, Register, Profile
- ✓ `departmentController.js` - CRUD operations
- ✓ `programmeController.js` - CRUD operations
- ✓ `blockController.js` - CRUD operations
- ✓ `roomController.js` - CRUD operations
- ✓ `roleController.js` - CRUD operations
- ✓ `userController.js` - CRUD operations
- ✓ `complaintController.js` - Ticket management logic

#### API Routes

- ✓ `authRoutes.js` - Authentication endpoints
- ✓ `departmentRoutes.js` - Department endpoints
- ✓ `programmeRoutes.js` - Programme endpoints
- ✓ `blockRoutes.js` - Block endpoints
- ✓ `roomRoutes.js` - Room endpoints
- ✓ `roleRoutes.js` - Role endpoints
- ✓ `userRoutes.js` - User endpoints
- ✓ `complaintRoutes.js` - Ticket/Complaint endpoints

---

### client (React + React Router + Axios)

#### Configuration & Setup

- ✓ `package.json` - Dependencies and scripts
- ✓ `public/index.html` - HTML entry point
- ✓ `src/index.js` - React entry point
- ✓ `src/index.css` - Global styles

#### Context & State Management

- ✓ `context/AuthContext.js` - Authentication context and provider

#### Services

- ✓ `services/api.js` - Axios API client with interceptors

#### Components

- ✓ `components/Navbar.js` - Navigation bar with role-aware menu
- ✓ `components/Navbar.css` - Navigation styles

#### Pages

- ✓ `pages/HomePage.js` - Dashboard/home page
- ✓ `pages/LoginPage.js` - Login form with JWT
- ✓ `pages/LoginPage.css` - Login styles
- ✓ `pages/DepartmentPage.js` - Department management
- ✓ `pages/ProgrammePage.js` - Programme management
- ✓ `pages/BlockPage.js` - Block management
- ✓ `pages/RoomPage.js` - Room management
- ✓ `pages/RolePage.js` - Role management
- ✓ `pages/UserPage.js` - User management
- ✓ `pages/MasterScreen.css` - Master screens styling

#### Main Application

- ✓ `App.js` - Application routing with SuperAdmin protection
- ✓ `App.css` - Application styles
- ✓ `Reports.js` - Analytics and reporting interface

---

## Documentation

- ✓ **README.md** - Comprehensive project documentation
- ✓ **STARTUP_GUIDE.md** - Step-by-step startup instructions
- ✓ **POSTMAN_SETUP.md** - Postman API testing guide
- ✓ **QUICK_REFERENCE.md** - Quick reference for developers

---

## Features Implemented

### Authentication & Authorization

- ✓ User registration and login with JWT tokens
- ✓ Role-based access control (RBAC)
- ✓ SuperAdmin exclusive access to master screens
- ✓ Protected API endpoints
- ✓ Password hashing with bcryptjs
- ✓ Token-based authentication

### Master Screens (SuperAdmin Only)

1. **Department Screen**
   - Create, Read, Update, Delete departments
   - Fields: Name, Short Name, Description

2. **Programme Screen**
   - Create, Read, Update, Delete programmes
   - Fields: Name, Short Name, Department, Description

3. **Block Screen**
   - Create, Read, Update, Delete blocks
   - Fields: Name, Department, Programme, Description

4. **Room Screen**
   - Create, Read, Update, Delete rooms
   - Fields: Room Number, Department, Programme, Block, Floor, Capacity

5. **Role Screen**
   - Create, Read, Update, Delete roles
   - Fields: Name, Description, Permissions

6. **User Screen**
   - Create, Read, Update, Delete users
   - Fields: Username, Email, Phone, Password, Role, Department, Programme

### User Roles

- SuperAdmin - Full system access
- User - Basic user
- Networking Staff - Networking related
- Plumber - Plumbing complaints
- Electrician - Electrical complaints
- Software Developer - Software complaints
- (Customizable - add more as needed)

### client Features

- ✓ Complaint Management (Assign, Close, Reopen)
- ✓ Dockerization (Containers for all services)
- ✓ Automated Startup Script (`run_app.bat`)
- ✓ Responsive design
- ✓ Clean and intuitive UI
- ✓ Role-aware navigation
- ✓ Form validation
- ✓ Error handling
- ✓ Loading states
- ✓ Token persistence

### server Features

- ✓ RESTful API endpoints
- ✓ CORS enabled
- ✓ Error handling middleware
- ✓ Request validation
- ✓ Database relationships
- ✓ Health check endpoint

---

## Database Schema

### User Collection

```json
{
  "_id": ObjectId,
  "username": String (unique),
  "email": String (unique),
  "phone": String,
  "password": String (hashed),
  "role": String (enum),
  "department": ObjectId (ref),
  "programme": ObjectId (ref),
  "isActive": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}
```

Similar schemas exist for Department, Programme, Block, Room, and Role.

---

## API Endpoints Summary

### Authentication (Public)

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (Protected)

### Master Data (Protected - SuperAdmin)

- GET/POST/PUT/DELETE `/api/departments`
- GET/POST/PUT/DELETE `/api/programmes`
- GET/POST/PUT/DELETE `/api/blocks`
- GET/POST/PUT/DELETE `/api/rooms`
- GET/POST/PUT/DELETE `/api/roles`
- GET/POST/PUT/DELETE `/api/users`

---

## Project Statistics

- **server Files**: 30+ files
  - 7 Models (Including Complaint)
  - 8 Controllers (Including Complaint)
  - 8 Routes (Including Complaint)
  - 2 Middleware
  - 1 Config
  - Server setup

- **client Files**: 20+ files
  - 9 Page components (Including Reports)
  - 1 Navigation component
  - 1 Auth context
  - 1 API service
  - 2 Main app files

- **Documentation**: 10 comprehensive guides (Including Docker)

---

## Getting Started

### Quick Start (3 Steps)

1. **Start MongoDB**

   ```bash
   mongod
   ```

2. **Start server**

   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Start client**
   ```bash
   cd client
   npm install
   npm start
   ```

### Create SuperAdmin User

Use Postman to POST to `http://localhost:5000/api/auth/register`:

```json
{
  "username": "superadmin",
  "email": "superadmin@example.com",
  "phone": "+1234567890",
  "password": "SuperAdmin@123",
  "role": "SuperAdmin",
  "department": null
}
```

Then login at `http://localhost:3000/login`

---

## Technology Stack

| Layer             | Technology                               |
| ----------------- | ---------------------------------------- |
| client            | React 18.2, React Router 6.11, Axios 1.4 |
| server            | Node.js, Express.js, MongoDB, Mongoose   |
| Authentication    | JWT (JSON Web Tokens)                    |
| Password Security | bcryptjs                                 |
| API Communication | REST with CORS                           |
| Database          | MongoDB                                  |

---

## Key Features

✓ Complete MERN Stack Implementation
✓ JWT-based Authentication
✓ Role-Based Access Control
✓ Six Master Screen Modules
✓ Comprehensive Error Handling
✓ Responsive UI Design
✓ Database Relationships
✓ Full CRUD Operations
✓ Protected API Routes
✓ SuperAdmin Access Control

---

## Next Steps (Future Enhancements)

1. Create Complaint Management System (COMPLETED)
   - Complaint registration
   - Status tracking
   - Assignment to staff

2. Create Reports Module (COMPLETED)
   - Filtered database views
   - Status breakdowns

3. Add Dockerization (COMPLETED)
   - Containerization for all services
   - Automation scripts

---

## Support & Documentation

- **Installation**: See `STARTUP_GUIDE.md`
- **API Testing**: See `POSTMAN_SETUP.md`
- **Full Documentation**: See `README.md`
- **Quick Reference**: See `QUICK_REFERENCE.md`

---

## Project Ready! 🚀

All files have been created and are ready for:

1. Installation of dependencies
2. Configuration and setup
3. Database initialization
4. API testing with Postman
5. client development and testing

For step-by-step instructions, refer to `STARTUP_GUIDE.md`
