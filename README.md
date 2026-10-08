# API Starter Kit

A backend starter template built with TypeScript, Express, and Prisma.
Includes JWT auth, PostgreSQL, and Docker setup.

## Why I Built This

I got tired of rewriting the same boilerplate for every new project — auth, 
database connection, test setup, Docker config. I wanted to set it up once, 
properly, and reuse it.

## Tech Stack

- **TypeScript** + **Express 4**
- **PostgreSQL** + **Prisma ORM**
- **JWT** (access + refresh tokens)
- **Zod** for request validation
- **Jest** + **Supertest** for testing
- **Docker** + **docker-compose**

## Getting Started

Requirements: Node.js 20+, Docker

```bash
git clone https://github.com/IsmayilG/api-starter-kit.git
cd api-starter-kit
npm install
cp .env.example .env
docker-compose up -d
npm run prisma:migrate
npm run dev
Server runs at http://localhost:3000.

Endpoints
text
GET  /health              # Server status
POST /api/auth/register   # Register
POST /api/auth/login      # Login
GET  /api/tasks           # List tasks (auth required)
Project Structure
text
src/
├── config/         # env, db connection
├── controllers/    # request handlers
├── services/       # business logic
├── repositories/   # data access layer
├── middlewares/    # auth, error handler
├── routes/         # route definitions
├── app.ts          # express app
└── server.ts       # entry point
Scripts
Command	Description
npm run dev	Dev server (hot reload)
npm run build	Production build
npm test	Run tests
npm run prisma:studio	Database GUI
Notes
Still in development. Working on auth and CRUD endpoints.

License
MIT