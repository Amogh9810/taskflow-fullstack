# TaskFlow

Production-grade task management system with Node.js/Express backend and React/Vite frontend.

## Overview

TaskFlow is a full-stack web application for managing tasks with the following features:

- **User Authentication**: Secure registration and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by status and priority
- **Admin Dashboard**: View all users and tasks across the system
- **Role-Based Access**: USER and ADMIN roles with appropriate permissions
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-Time Notifications**: Toast notifications for user actions
- **Security**: Bcrypt password hashing, rate limiting, CORS, security headers

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (15-minute expiry)
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API

## Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL 12+

### 1. Clone & Install

```bash
# Install root dependencies
pnpm install

# Dependencies for each workspace are installed automatically
```

### 2. Configure Environment

#### Backend (.env)
```bash
cd taskflow-api
cp .env.example .env
# Edit .env with your database credentials
```

```
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow?schema=public
JWT_SECRET=your-secret-key (generate with: openssl rand -base64 32)
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=3000
```

#### Frontend (.env)
```bash
cd taskflow-ui
cp .env.example .env
# Should work as-is if backend runs on default port
```

```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 3. Setup Database

```bash
cd taskflow-api
pnpm run prisma:push
```

This creates the database schema with User and Task tables.

### 4. Start Development Servers

#### Option A: Run both in parallel
```bash
pnpm dev
```

#### Option B: Run separately
```bash
# Terminal 1: Backend
pnpm api

# Terminal 2: Frontend
pnpm ui
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- Swagger Docs: http://localhost:3000/api/v1/docs

## Project Structure

```
taskflow/
├── taskflow-api/              # Express.js backend
│   ├── src/
│   │   ├── config/            # Database, Swagger config
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── modules/           # Feature modules (auth, tasks, admin)
│   │   ├── utils/             # JWT, password, logger utilities
│   │   ├── app.js             # Express app setup
│   │   └── index.js           # Server entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── README.md              # Backend documentation
│
├── taskflow-ui/               # React/Vite frontend
│   ├── src/
│   │   ├── api/               # Axios configuration
│   │   ├── components/        # Reusable components
│   │   ├── context/           # Auth state management
│   │   ├── pages/             # Page components
│   │   ├── styles/            # Global CSS
│   │   ├── App.jsx            # Router setup
│   │   └── main.jsx           # React entry point
│   ├── index.html             # HTML entry point
│   ├── vite.config.js         # Vite configuration
│   └── README.md              # Frontend documentation
│
├── package.json               # Root workspace definition
├── pnpm-workspace.yaml        # Workspace configuration
└── README.md                  # This file
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user, returns JWT |
| GET | `/auth/me` | Get current user profile |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List user's tasks (paginated) |
| GET | `/tasks/:id` | Get specific task |
| POST | `/tasks` | Create new task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users (admin only) |
| GET | `/admin/tasks` | List all tasks (admin only) |

## Database Schema

### User
```sql
CREATE TABLE "User" (
  id String @id @default(cuid()),
  name String,
  email String @unique,
  password String,
  role Role @default(USER),
  createdAt DateTime @default(now()),
  updatedAt DateTime @updatedAt
);
```

### Task
```sql
CREATE TABLE "Task" (
  id String @id @default(cuid()),
  title String,
  description String?,
  status TaskStatus @default(TODO),
  priority Priority @default(MEDIUM),
  dueDate DateTime?,
  userId String,
  createdAt DateTime @default(now()),
  updatedAt DateTime @updatedAt
);
```

## Security Features

- ✅ JWT authentication with 15-minute expiry
- ✅ Bcryptjs password hashing (12 salt rounds)
- ✅ Helmet security headers
- ✅ CORS with configurable origin
- ✅ Rate limiting (100 global, 10 on auth routes per 15 minutes)
- ✅ Zod input validation
- ✅ Role-based authorization
- ✅ No passwords returned in API responses
- ✅ Winston logging with production file output

## Frontend Features

- ✅ Responsive design (mobile-first)
- ✅ Real-time task filtering and search
- ✅ Task status updates via dropdown
- ✅ Create/edit tasks in modal
- ✅ Admin analytics dashboard
- ✅ Automatic JWT token management
- ✅ Protected routes
- ✅ Toast notifications
- ✅ Dark theme

## Development Workflow

### Add a Backend Package
```bash
cd taskflow-api
pnpm add package-name
```

### Add a Frontend Package
```bash
cd taskflow-ui
pnpm add package-name
```

### Database Migrations
```bash
cd taskflow-api

# Create new migration
pnpm run prisma:migrate

# View database in Prisma Studio
pnpm run prisma:studio
```

## Testing the Application

### 1. Register a New User
Go to http://localhost:5173/register and create an account.

### 2. Test Task Management
- Create a task on the dashboard
- Edit the task
- Change status via dropdown
- Delete the task

### 3. Test Admin Dashboard
- Create an admin account (manually update role in database)
- Go to http://localhost:5173/admin
- View all users and tasks

### 4. Test API Directly
```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"Password123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'

# Get current user (use token from login response)
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Building for Production

### Backend
```bash
cd taskflow-api
pnpm run build
# Deploy dist/ folder to your server
```

### Frontend
```bash
cd taskflow-ui
pnpm run build
# Deploy dist/ folder to Vercel, Netlify, or any static host
```

## Environment Variables

### Backend (taskflow-api/.env)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for signing JWT tokens
- `CORS_ORIGIN`: Comma-separated list of allowed origins
- `NODE_ENV`: development or production
- `PORT`: Server port (default: 3000)

### Frontend (taskflow-ui/.env)
- `VITE_API_BASE_URL`: Backend API base URL (default: http://localhost:3000/api/v1)

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Check PORT is not in use

### Frontend won't connect to API
- Verify backend is running on the correct port
- Check VITE_API_BASE_URL is correct
- Check browser console for CORS errors

### Prisma errors
- Run `pnpm run prisma:push` to sync schema
- Clear node_modules and reinstall: `pnpm install`

## Scaling to Production

See `taskflow-api/SCALABILITY.md` for detailed information on scaling strategies including:
- Caching with Redis
- Database read replicas
- Microservices architecture
- Message queues
- Docker containerization
- Kubernetes deployment

## Contributing

1. Follow the existing code style
2. Add types/validation for all inputs
3. Update tests when adding features
4. Follow the security guidelines

## License

MIT

## Support

For issues and questions, please open a GitHub issue or contact the development team.
