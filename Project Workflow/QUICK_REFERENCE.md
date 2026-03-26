# TMS - Quick Reference

### Quick Launch (Docker)

```bash
run_app.bat          # Automated startup
# OR
docker-compose up -d  # Manual docker start
```

## Key Endpoints

| Method | Endpoint                     | Auth Required | Role Required  |
| ------ | ---------------------------- | ------------- | -------------- |
| POST   | `/api/auth/register`         | No            | -              |
| POST   | `/api/auth/login`            | No            | -              |
| GET    | `/api/auth/profile`          | Yes           | -              |
| GET    | `/api/departments`           | Yes           | -              |
| POST   | `/api/departments`           | Yes           | SuperAdmin     |
| GET    | `/api/programmes`            | Yes           | -              |
| POST   | `/api/programmes`            | Yes           | SuperAdmin     |
| GET    | `/api/blocks`                | Yes           | -              |
| POST   | `/api/blocks`                | Yes           | SuperAdmin     |
| GET    | `/api/rooms`                 | Yes           | -              |
| POST   | `/api/rooms`                 | Yes           | SuperAdmin     |
| GET    | `/api/roles`                 | Yes           | -              |
| POST   | `/api/roles`                 | Yes           | SuperAdmin     |
| POST   | `/api/users`                 | Yes           | SuperAdmin     |
| GET    | `/api/complaints`            | Yes           | -              |
| POST   | `/api/complaints`            | Yes           | User/Admin     |
| PATCH  | `/api/complaints/:id/assign` | Yes           | SuperAdmin     |
| PATCH  | `/api/complaints/:id/status` | Yes           | Assignee/Admin |

## Default Credentials

- **Username**: superadmin
- **Email**: superadmin@example.com
- **Password**: SuperAdmin@123
- **Role**: SuperAdmin

## client Routes

| Path           | Component  | Access     |
| -------------- | ---------- | ---------- |
| `/`            | Home       | Public     |
| `/login`       | Login      | Public     |
| `/departments` | Department | SuperAdmin |
| `/programmes`  | Programme  | SuperAdmin |
| `/blocks`      | Block      | SuperAdmin |
| `/rooms`       | Room       | SuperAdmin |
| `/roles`       | Role       | SuperAdmin |
| `/users`       | User       | SuperAdmin |
| `/reports`     | Reports    | Protected  |

## Available Roles

- SuperAdmin - Full system access
- User - Basic access
- Networking Staff - Networking complaints
- Plumber - Plumbing complaints
- Electrician - Electrical complaints
- Software Developer - Software complaints

## Database Collections

6. **roles** - Role definitions
7. **complaints** - Ticket/complaint records

## Environment Setup

### server `.env`

```
MONGODB_URI=mongodb://localhost:27017/tms-complaints
PORT=5000
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
NODE_ENV=development
```

### client (Automatic)

- API Base: `http://localhost:5000/api`
- Token Storage: localStorage

## Important Notes

1. MongoDB must be running before starting server
2. server must be running before starting client
3. Only SuperAdmin can access master screens
4. JWT tokens expire in 7 days (configurable)
5. Passwords are hashed using bcryptjs
6. CORS enabled for localhost:3000

## Common Issues & Solutions

| Issue                     | Solution                            |
| ------------------------- | ----------------------------------- |
| MongoDB connection failed | Start MongoDB service               |
| Port 5000 in use          | Kill process or change PORT in .env |
| Port 3000 in use          | Run `PORT=3001 npm start`           |
| CORS errors               | Ensure server is running            |
| Login fails               | Check email and password            |
| No departments showing    | Create one first as SuperAdmin      |

## API Testing

**Postman Collection Variables**:

```json
{
  "base_url": "http://localhost:5000/api",
  "token": "your_jwt_token_here"
}
```

**Common Headers**:

```
Authorization: Bearer <token>
Content-Type: application/json
```

## File Structure Summary

```
TMS-TEST-PROJECT/
├── server/             # Node.js/Express server
│   ├── config/         # Configuration files
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth & role checking
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   └── server.js       # Entry point
│
└── client/           # React client
    ├── public/         # Static files
    └── src/
        ├── components/ # React components
        ├── pages/      # Page components
        ├── services/   # API calls
        ├── context/    # Auth context
        └── App.js      # Root component
```

## Documentation Files

- **README.md** - Complete project documentation
- **POSTMAN_SETUP.md** - Postman API testing guide
- **STARTUP_GUIDE.md** - Step-by-step startup instructions
- **QUICK_REFERENCE.md** - This file

---

For detailed information, refer to the respective documentation files.
