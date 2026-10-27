# API Starter Kit

A backend starter template built with TypeScript, Express, and Prisma.
Includes JWT auth, PostgreSQL, Docker setup, and CI/CD.

## Tech Stack

- **TypeScript** + **Express 4**
- **PostgreSQL** + **Prisma ORM**
- **JWT** (access + refresh tokens)
- **Zod** for request validation
- **Jest** + **Supertest** for testing
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

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /health | Server status | No |
| GET | / | API info | No |
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login user | No |
| POST | /api/auth/refresh | Refresh access token | No |
| POST | /api/tasks | Create a task | Yes |
| GET | /api/tasks | List all tasks | Yes |
| GET | /api/tasks/:id | Get task by ID | Yes |
| PUT | /api/tasks/:id | Update task | Yes |
| DELETE | /api/tasks/:id | Delete task | Yes |

### Authentication

Protected routes require a Bearer token in the Authorization header:

\\\
Authorization: Bearer <access_token>
\\\

## Project Structure

\\\
src/
├── config/         # env, db connection
├── controllers/    # request handlers
├── services/       # business logic
├── repositories/   # data access layer
├── middlewares/    # auth, error handler
├── routes/         # route definitions
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

## License

MIT
