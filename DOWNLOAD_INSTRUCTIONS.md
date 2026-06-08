# How to Download & Run TaskFlow Locally

## Overview

TaskFlow is a complete monorepo with a Node.js/Express backend and React/Vite frontend. Once downloaded, it can be run entirely on your local machine.

## Step 1: Download the Project

### Using v0 CLI (Recommended)
```bash
v0 download <project-name>
# This will create a `taskflow` folder with all source files
```

### Using Git (If Connected to GitHub)
```bash
git clone <your-repo-url>
cd taskflow
```

### Manual Download
Download the ZIP file from the v0 interface and extract it:
```bash
unzip taskflow.zip
cd taskflow
```

## Step 2: Requirements

Ensure you have installed:
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/) OR use a cloud database
- **Package Manager** - pnpm (recommended) or npm

Check your installations:
```bash
node --version        # Should be v18+
npm --version         # Should be v8+
postgres --version    # Or use cloud alternative
```

## Step 3: Install Dependencies

### Using pnpm (Recommended)
```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install all dependencies
pnpm install
```

### Using npm
```bash
npm install
```

This will install dependencies for both the backend and frontend automatically (workspace setup).

## Step 4: Set Up Database

### Option A: Local PostgreSQL

1. Create a database:
```bash
psql -U postgres
CREATE DATABASE taskflow;
\q
```

2. Get your connection string:
```
postgresql://postgres:password@localhost:5432/taskflow
```

3. Update `taskflow-api/.env`:
```bash
cp taskflow-api/.env.example taskflow-api/.env
# Edit taskflow-api/.env and update DATABASE_URL
```

### Option B: Cloud Database (Recommended)

Use one of these services (free tier available):

**Neon.tech** (Easiest)
1. Sign up at https://neon.tech
2. Create a project and database
3. Copy connection string
4. Paste in `taskflow-api/.env`

**Railway.app**
1. Sign up at https://railway.app
2. Create a PostgreSQL service
3. Copy connection string
4. Paste in `taskflow-api/.env`

**Supabase**
1. Sign up at https://supabase.com
2. Create a project
3. Get PostgreSQL connection string
4. Paste in `taskflow-api/.env`

## Step 5: Configure Environment Variables

### Backend (`taskflow-api/.env`)
```bash
cp taskflow-api/.env.example taskflow-api/.env
```

Edit `taskflow-api/.env`:
```
DATABASE_URL=postgresql://user:password@host:port/taskflow
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key-here-min-32-chars
JWT_EXPIRY=15m
BCRYPT_SALT_ROUNDS=12
LOG_LEVEL=info
API_URL=http://localhost:3000
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (`taskflow-ui/.env`)
```bash
cp taskflow-ui/.env.example taskflow-ui/.env
```

Edit `taskflow-ui/.env`:
```
VITE_API_URL=http://localhost:3000
```

## Step 6: Initialize Database Schema

Run Prisma migrations:
```bash
cd taskflow-api
pnpm exec prisma db push
cd ..
```

This creates all necessary tables in your PostgreSQL database.

## Step 7: Start the Application

### Option A: Run Both Frontend & Backend Together
```bash
pnpm dev
```

This starts:
- **Backend** on http://localhost:3000
- **Frontend** on http://localhost:5173
- **Swagger API Docs** on http://localhost:3000/api-docs

### Option B: Run Separately (Useful for Development)

Terminal 1 - Backend:
```bash
pnpm api
# or: cd taskflow-api && pnpm dev
```

Terminal 2 - Frontend:
```bash
pnpm ui
# or: cd taskflow-ui && pnpm dev
```

## Step 8: Use the Application

1. Open http://localhost:5173 in your browser
2. Click "Create account" to sign up
3. Log in with your credentials
4. Start creating and managing tasks!

## Useful Commands

### Development
```bash
# Start everything
pnpm dev

# Start only backend
pnpm api

# Start only frontend
pnpm ui

# Build for production
pnpm build
```

### Database
```bash
cd taskflow-api

# Open Prisma Studio (GUI for database)
pnpm exec prisma studio

# Create a migration
pnpm exec prisma migrate dev --name add_feature

# Push schema changes
pnpm exec prisma db push

# Reset database (⚠️ Deletes all data)
pnpm exec prisma db push --force-reset
```

### Testing
```bash
# Backend API at
http://localhost:3000/api-docs

# Health check
curl http://localhost:3000/health
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

Solution:
1. Check DATABASE_URL in `taskflow-api/.env`
2. Verify PostgreSQL is running
3. Test connection: `psql <connection-string>`

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Prisma Client Issues
```bash
cd taskflow-api
pnpm exec prisma generate
pnpm exec prisma db push
```

## Project Structure

```
taskflow/
├── taskflow-api/              # Express backend
│   ├── src/
│   │   ├── modules/           # Feature modules (auth, tasks, admin)
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── config/            # Database, Swagger config
│   │   ├── utils/             # JWT, hashing, logging
│   │   ├── app.js             # Express app setup
│   │   └── index.js           # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── package.json
│   ├── .env                   # Environment variables
│   └── README.md              # Backend documentation
│
├── taskflow-ui/               # React/Vite frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context (Auth)
│   │   ├── api/               # Axios client setup
│   │   ├── styles/            # Tailwind CSS
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # React entry point
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── package.json
│   ├── .env                   # Environment variables
│   └── README.md              # Frontend documentation
│
├── package.json               # Root workspace config
├── pnpm-workspace.yaml        # Workspace definition
├── README.md                  # Project overview
├── START_HERE.md              # Quick start guide (read this first!)
├── QUICK_START.md             # Detailed quick start
├── SETUP_INSTRUCTIONS.md      # Complete setup walkthrough
├── IMPLEMENTATION_CHECKLIST.md # Verification checklist
└── DOWNLOAD_INSTRUCTIONS.md   # This file!
```

## Default Credentials

After setup, create your account:
1. Sign up with any email and password
2. First user account automatically gets ADMIN role
3. Additional accounts default to USER role

## API Endpoints

Once running, view all endpoints at:
http://localhost:3000/api-docs

Common endpoints:
- `POST /auth/register` - Create account
- `POST /auth/login` - Sign in
- `GET /auth/me` - Get current user
- `GET /tasks` - List user's tasks
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /admin/users` - List all users (admin only)
- `GET /admin/tasks` - List all tasks (admin only)

## Need Help?

- Check `START_HERE.md` for quick answers
- Read `README.md` for overview
- See `taskflow-api/README.md` for backend details
- See `taskflow-ui/README.md` for frontend details
- Review `taskflow-api/SCALABILITY.md` for production deployment

## Production Deployment

When ready to deploy:
1. Set `NODE_ENV=production`
2. Use a production database (Neon, Railway, AWS, etc.)
3. Generate secure JWT_SECRET
4. Use HTTPS
5. See `taskflow-api/SCALABILITY.md` for detailed deployment guide

---

**You're all set! Enjoy TaskFlow! 🚀**
