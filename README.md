# API Starter Kit

A professional backend starter template built with TypeScript, Express, and Prisma.
Includes JWT auth (access + refresh tokens), role-based access control, task management,
password reset, Swagger API documentation, pagination, PostgreSQL, Docker, and CI/CD.

## Tech Stack

- **TypeScript** + **Express 4**
- **PostgreSQL** + **Prisma ORM**
- **JWT** (access + refresh tokens)
- **Zod** for request validation
- **Jest** + **Supertest** for testing
- **Swagger/OpenAPI** for API documentation
- **Docker** + **docker-compose**
- **GitHub Actions** for CI

## Getting Started

Requirements: Node.js 20+, Docker

\\\ash
git clone https://github.com/IsmayilG/api-starter-kit.git
cd api-starter-kit
npm install
cp .env.example .env
docker-compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run dev
\\\

Server runs at http://localhost:3000.
API documentation: http://localhost:3000/api-docs

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| POST | /api/auth/refresh | Refresh access token | No |
| POST | /api/auth/forgot-password | Request password reset | No |
| POST | /api/auth/reset-password | Reset password with token | No |

### Tasks (Auth required)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/tasks | Create a task | Yes (Bearer) |
| GET | /api/tasks?page=1&limit=10 | List tasks (paginated) | Yes (Bearer) |
| GET | /api/tasks/:id | Get task by ID | Yes (Bearer) |
| PUT | /api/tasks/:id | Update task | Yes (Bearer) |
| DELETE | /api/tasks/:id | Delete task | Yes (Bearer) |
| GET | /api/tasks/admin/all | Admin-only endpoint | Yes (ADMIN role) |

### System

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /health | Health check (with DB status) | No |
| GET | / | API info | No |

### Authentication Header

Protected routes require a Bearer token:

\\\
Authorization: Bearer <access_token>
\\\

## Project Structure

\\\
src/
├── config/         # env, db, swagger config
├── controllers/    # request handlers
├── services/       # business logic
├── repositories/   # data access layer
├── middlewares/    # auth, RBAC, validation, error handling
├── routes/         # route definitions
├── utils/          # response, error, validation schemas
├── app.ts          # express app
└── server.ts       # entry point
\\\

## Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Dev server (hot reload) |
| npm run build | Production build |
| npm start | Start production server |
| npm test | Run tests |
| npm run prisma:generate | Generate Prisma client |
| npm run prisma:migrate | Run database migrations |
| npm run prisma:studio | Database GUI |

## Features

- JWT authentication with access + refresh tokens
- Password reset flow (forgot/reset)
- Role-Based Access Control (USER / ADMIN)
- Zod request validation
- Paginated task listing
- Standardized API responses
- Swagger/OpenAPI documentation at /api-docs
- Database health check
- Global error handling
- Jest + Supertest unit tests
- GitHub Actions CI with PostgreSQL service

## License

MIT
