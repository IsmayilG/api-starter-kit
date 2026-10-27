export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "API Starter Kit",
    version: "1.0.0",
    description:
      "A professional backend API with JWT auth, role-based access control, task management, and password reset.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT access token",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Tasks", description: "Task management endpoints" },
    { name: "System", description: "System health and info" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        description: "Check if the API and database are running",
        responses: {
          200: {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    message: { type: "string", example: "API is running 🚀" },
                    timestamp: {
                      type: "string",
                      example: "2024-01-01T00:00:00.000Z",
                    },
                    database: { type: "string", example: "connected" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "user@example.com" },
                  password: { type: "string", example: "password123" },
                  name: { type: "string", example: "John Doe" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Validation error or email already exists" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "user@example.com" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request password reset",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", example: "user@example.com" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Reset token generated" },
        },
      },
    },
    "/api/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password with token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "password"],
                properties: {
                  token: { type: "string", example: "uuid-token" },
                  password: { type: "string", example: "newPassword123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password reset successful" },
          400: { description: "Invalid or expired token" },
        },
      },
    },
    "/api/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "List all tasks (paginated)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: { description: "Tasks list with pagination meta" },
          401: { description: "Unauthorized" },
        },
      },
      post: {
        tags: ["Tasks"],
        summary: "Create a new task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string", example: "Buy groceries" },
                  description: { type: "string", example: "Milk, eggs, bread" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Task created" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/tasks/{id}": {
      get: {
        tags: ["Tasks"],
        summary: "Get task by ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Task found" },
          401: { description: "Unauthorized" },
          404: { description: "Task not found" },
        },
      },
      put: {
        tags: ["Tasks"],
        summary: "Update a task",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  completed: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Task updated" },
          401: { description: "Unauthorized" },
          404: { description: "Task not found" },
        },
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete a task",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Task deleted" },
          401: { description: "Unauthorized" },
          404: { description: "Task not found" },
        },
      },
    },
    "/api/tasks/admin/all": {
      get: {
        tags: ["Tasks"],
        summary: "Admin-only endpoint",
        responses: {
          200: { description: "Admin access granted" },
          401: { description: "Unauthorized" },
          403: { description: "Insufficient permissions (ADMIN required)" },
        },
      },
    },
  },
};