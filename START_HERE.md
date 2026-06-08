# TaskFlow - Start Here

Welcome to TaskFlow! This is a production-grade task management application built with Node.js/Express backend and React/Vite frontend.

## Quick Setup (3 Steps)

### 1. Install Dependencies
```bash
pnpm install
# or if you don't have pnpm: npm install -g pnpm && pnpm install
# or use npm: npm install
```

### 2. Set Up PostgreSQL Database
Choose one:
- **Local**: `postgresql://user:password@localhost:5432/taskflow`
- **Railway**: `postgresql://user:password@host:port/taskflow`
- **Neon**: `postgresql://user:password@host/taskflow`
- **Supabase**: Your connection string from Supabase

Update `taskflow-api/.env` with your `DATABASE_URL`

### 3. Run Migrations & Start
```bash
cd taskflow-api
pnpm exec prisma db push

cd ..
pnpm dev  # Starts both backend and frontend
```

Visit: **http://localhost:5173**

## Features

- User authentication (register/login with JWT)
- Create, read, update, delete tasks
- Filter tasks by status and priority
- Admin dashboard to view all users and tasks
- Role-based access control
- Dark-themed responsive UI
- Real-time toast notifications
- Swagger API documentation

## Project Structure

```
TaskFlow/
├── taskflow-api/          # Express backend
│   ├── src/
│   │   ├── modules/       # Auth, Tasks, Admin routes
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── config/        # Database, Swagger
│   │   ├── utils/         # JWT, hashing, logging
│   │   └── app.js         # Express app
│   └── prisma/            # Database schema
│
├── taskflow-ui/           # Vite + React frontend
│   ├── src/
│   │   ├── pages/         # Login, Register, Dashboard, Admin
│   │   ├── components/    # UI components
│   │   ├── context/       # Auth context
│   │   ├── api/           # Axios client
│   │   └── styles/        # Tailwind CSS
│   └── vite.config.js     # Vite configuration
│
└── Documentation/         # READMEs and guides
```

## Commands

```bash
pnpm dev              # Start both backend and frontend
pnpm api              # Start backend only (port 3000)
pnpm ui               # Start frontend only (port 5173)

# Backend specific
cd taskflow-api
pnpm exec prisma db push    # Run migrations
pnpm exec prisma studio     # Open Prisma Studio

# Frontend specific
cd taskflow-ui
pnpm build            # Build for production
```

## Default Credentials (After Setup)

1. Sign up a new account at http://localhost:5173
2. Use the admin panel to manage users and tasks

## Troubleshooting

**Port 3000/5173 already in use?**
```bash
# Kill process on port
lsof -i :3000      # Find process ID
kill -9 <PID>      # Kill it

# Or use different ports (edit taskflow-api/src/index.js and taskflow-ui/vite.config.js)
```

**Database connection error?**
- Check your DATABASE_URL in `taskflow-api/.env`
- Ensure PostgreSQL is running
- Verify credentials and host/port

**Prisma schema needs update?**
```bash
cd taskflow-api
pnpm exec prisma migrate dev --name <migration_name>
```

## Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT authentication
- Zod validation
- Swagger/OpenAPI docs

**Frontend:**
- React 19
- Vite
- React Router v6
- Axios HTTP client
- Tailwind CSS 4
- Context API for state

## Documentation

- `README.md` - Full project documentation
- `QUICK_START.md` - Detailed quick start guide
- `SETUP_INSTRUCTIONS.md` - Complete setup walkthrough
- `taskflow-api/README.md` - API documentation
- `taskflow-ui/README.md` - Frontend documentation
- `taskflow-api/SCALABILITY.md` - Production scaling guide

## Next Steps

1. Read `QUICK_START.md` for detailed setup
2. Review `taskflow-api/README.md` for API endpoints
3. Check `taskflow-ui/README.md` for frontend features
4. Visit http://localhost:3000/api-docs for Swagger documentation

---

**Built with ❤️ - Ready for production!**
