# TaskFlow API

Production-grade task management API built with Node.js, Express, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (15-minute expiry)
- **Validation**: Zod
- **Security**: helmet, cors, bcryptjs, express-rate-limit
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL 12+
- (Optional) Docker

## Local Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in the required variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow?schema=public
JWT_SECRET=your-secret-key-here (generate with: openssl rand -base64 32)
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=3000
```

### 3. Setup Database

```bash
npm run prisma:push
# or create migrations with:
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3000`  
Swagger docs: `http://localhost:3000/api/v1/docs`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user (returns JWT) |
| GET | `/auth/me` | Get current user profile |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List user's tasks (paginated) |
| GET | `/tasks/:id` | Get specific task |
| POST | `/tasks` | Create new task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

### Admin (requires ADMIN role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users with task count |
| GET | `/admin/tasks` | List all tasks across all users |

## Project Structure

```
taskflow-api/
├── src/
│   ├── config/              # Configuration (database, Swagger)
│   ├── middleware/          # Auth, validation, error handling
│   ├── modules/             # Feature modules (auth, tasks, admin)
│   ├── utils/               # Utilities (JWT, password, logger)
│   ├── app.js               # Express app setup
│   └── index.js             # Entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── .env.example             # Environment variables template
└── package.json             # Dependencies and scripts
```

## Security Features

- JWT tokens with 15-minute expiry
- bcryptjs password hashing (12 salt rounds)
- Helmet for security headers
- CORS with configurable origin
- Rate limiting (100 global, 10 on auth routes per 15 minutes)
- Input validation with Zod
- Role-based authorization (USER, ADMIN)
- No passwords returned in API responses
- Winston logging with production file output

## Database Schema

### User

- `id`: UUID (primary key)
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: Role enum (USER, ADMIN)
- `createdAt`, `updatedAt`: Timestamps

### Task

- `id`: UUID (primary key)
- `title`: String
- `description`: String (optional)
- `status`: TaskStatus enum (TODO, IN_PROGRESS, DONE, ARCHIVED)
- `priority`: Priority enum (LOW, MEDIUM, HIGH, CRITICAL)
- `dueDate`: DateTime (optional)
- `userId`: UUID (foreign key)
- `createdAt`, `updatedAt`: Timestamps

## For Scaling

See [SCALABILITY.md](./SCALABILITY.md) for detailed information on:
- Microservices architecture
- Caching strategies
- Horizontal scaling
- Docker containerization
- Message queues for async operations

## Troubleshooting

**Port already in use**: Change PORT in `.env`  
**Database connection error**: Verify DATABASE_URL and PostgreSQL is running  
**JWT errors**: Regenerate JWT_SECRET with `openssl rand -base64 32`  
**Prisma sync issues**: Run `npm run prisma:push` to sync schema

## License

MIT
