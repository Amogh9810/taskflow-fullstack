# TaskFlow - Setup Instructions

## Quick Start (5 minutes)

### 1. Prepare Database
- Ensure PostgreSQL is running
- Create a database: `createdb taskflow`

### 2. Configure Backend

```bash
cd taskflow-api

# Edit .env with your database credentials
# DATABASE_URL should point to your PostgreSQL instance
nano .env

# Create tables
pnpm run prisma:push

# Start backend server
pnpm run dev
```

Backend will be available at: **http://localhost:3000**  
Swagger docs: **http://localhost:3000/api/v1/docs**

### 3. Configure Frontend

```bash
cd taskflow-ui

# .env should already have correct API URL
# Start frontend dev server
pnpm run dev
```

Frontend will be available at: **http://localhost:5173**

### 4. Test the Application

**Create Account:**
- Go to http://localhost:5173/register
- Enter name, email, password
- Password requirements: min 8 chars, 1 uppercase, 1 number
- Register button will be disabled until requirements met

**Use Application:**
- After registration, you'll be logged in automatically
- Go to Dashboard to create your first task
- Try filtering by status, editing, and deleting tasks

**Test Admin Features (Optional):**
1. Create a regular user account first
2. Manually update the user role in database:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```
3. Log out and log back in
4. Click "Admin" in the navbar to see all users and tasks

## Environment Variables

### Backend (.env in taskflow-api/)

```bash
# PostgreSQL connection string
DATABASE_URL=postgresql://username:password@localhost:5432/taskflow?schema=public

# JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-secret-key-here

# Frontend URL for CORS
CORS_ORIGIN=http://localhost:5173

# Development or production
NODE_ENV=development

# Server port
PORT=3000
```

### Frontend (.env in taskflow-ui/)

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in backend .env file
# Change port in vite.config.js (Vite frontend)
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check DATABASE_URL format:
# postgresql://user:password@host:port/database?schema=public
```

### CORS Errors in Browser
```bash
# Ensure CORS_ORIGIN in backend matches frontend URL
# CORS_ORIGIN should be: http://localhost:5173
```

### Prisma Schema Sync Issues
```bash
cd taskflow-api
pnpm run prisma:push
```

### API Returns 401 Everywhere
```bash
# Regenerate JWT_SECRET
openssl rand -base64 32

# Update in taskflow-api/.env
JWT_SECRET=new-secret-here

# Restart backend server
```

## Project Structure Reference

```
taskflow/
├── taskflow-api/                    # Node.js/Express backend
│   ├── src/
│   │   ├── modules/auth/            # Authentication
│   │   ├── modules/tasks/           # Task management
│   │   ├── modules/admin/           # Admin features
│   │   ├── middleware/              # Auth, validation, errors
│   │   ├── utils/                   # JWT, passwords, logging
│   │   ├── config/                  # Database, Swagger
│   │   ├── app.js                   # Express setup
│   │   └── index.js                 # Server entry point
│   ├── prisma/schema.prisma         # Database schema
│   ├── package.json
│   ├── .env                         # Configuration
│   └── README.md
│
├── taskflow-ui/                     # React/Vite frontend
│   ├── src/
│   │   ├── pages/                   # Login, Register, Dashboard, Admin
│   │   ├── components/              # Navbar, TaskCard, TaskModal, etc.
│   │   ├── context/AuthContext.jsx  # Auth state
│   │   ├── api/axios.js             # HTTP client
│   │   ├── styles/index.css         # Global styles
│   │   ├── App.jsx                  # Router
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env                         # Configuration
│   └── README.md
│
├── package.json                     # Root workspace
├── pnpm-workspace.yaml              # Workspace config
├── README.md                        # Full documentation
├── SETUP_INSTRUCTIONS.md            # This file
└── IMPLEMENTATION_CHECKLIST.md      # Verification checklist
```

## Running the Application

### Option 1: Run Both Servers Together
```bash
cd /vercel/share/v0-project
pnpm dev
```

### Option 2: Run Separately
```bash
# Terminal 1 - Backend
cd taskflow-api
pnpm run dev

# Terminal 2 - Frontend  
cd taskflow-ui
pnpm run dev
```

### Option 3: Run with Package Scripts
```bash
# From root directory
pnpm api       # Runs backend only
pnpm ui        # Runs frontend only
pnpm dev       # Runs both
```

## Available API Endpoints

### Authentication
```
POST /auth/register
POST /auth/login
GET /auth/me
```

### Tasks
```
GET /tasks?page=1&limit=10&status=TODO
GET /tasks/:id
POST /tasks
PATCH /tasks/:id
DELETE /tasks/:id
```

### Admin
```
GET /admin/users
GET /admin/tasks
```

All task endpoints require authentication (Bearer token).  
Admin endpoints require ADMIN role.

## Test Data

### Create Test User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Login Test User
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

Response will include JWT token. Use it for subsequent requests:

### Create Test Task
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "status": "TODO",
    "priority": "MEDIUM",
    "dueDate": "2026-06-15T00:00:00Z"
  }'
```

## Performance Tips

1. **Database Optimization**: Add indexes on frequently queried fields
2. **Caching**: Implement Redis for frequently accessed tasks
3. **Pagination**: Always use pagination for task lists (limit=10)
4. **Compression**: Enable gzip compression in production

See `taskflow-api/SCALABILITY.md` for detailed scaling strategies.

## Deployment Checklist

- [ ] Update DATABASE_URL to production database
- [ ] Generate strong JWT_SECRET: `openssl rand -base64 32`
- [ ] Set NODE_ENV=production
- [ ] Update CORS_ORIGIN to production frontend URL
- [ ] Enable HTTPS on frontend
- [ ] Set up SSL certificate for API
- [ ] Configure production logging
- [ ] Run database migrations on production
- [ ] Set up monitoring and error tracking
- [ ] Test all auth flows in production
- [ ] Verify rate limiting is working
- [ ] Create admin user on production database

## Support & Documentation

- **Full API Docs**: http://localhost:3000/api/v1/docs (Swagger)
- **Backend README**: See `taskflow-api/README.md`
- **Frontend README**: See `taskflow-ui/README.md`
- **Scalability Guide**: See `taskflow-api/SCALABILITY.md`
- **Implementation Checklist**: See `IMPLEMENTATION_CHECKLIST.md`

## Next Steps After Setup

1. **Test Core Features**
   - [ ] Register a new user
   - [ ] Login with registered user
   - [ ] Create a task
   - [ ] Update task status
   - [ ] Delete a task
   - [ ] Filter tasks by status

2. **Test Admin Features**
   - [ ] Promote user to admin role in database
   - [ ] View admin dashboard
   - [ ] Verify user list shows all users
   - [ ] Verify task list shows all tasks

3. **Test Error Handling**
   - [ ] Test invalid login credentials
   - [ ] Test expired JWT token
   - [ ] Test invalid email format
   - [ ] Test password requirements

4. **Prepare for Production**
   - [ ] Review security checklist
   - [ ] Set up monitoring
   - [ ] Configure backup strategy
   - [ ] Plan scaling strategy
   - [ ] Set up CI/CD pipeline

## Need Help?

- Check the specific README.md in each workspace folder
- Review IMPLEMENTATION_CHECKLIST.md for verification details
- Check backend logs: `pnpm run dev` output
- Use Swagger UI at `/api/v1/docs` to test API endpoints
- Review error messages in browser console and terminal

Happy coding! 🚀
