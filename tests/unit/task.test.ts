import request from "supertest";
import app from "../../src/app";
import { prisma } from "../setup";

let accessToken: string;
let testUserId: string;

describe("Task Endpoints", () => {
  beforeAll(async () => {
    // Register and login a test user
    await request(app)
      .post("/api/auth/register")
      .send({
        email: "taskuser@example.com",
        password: "password123",
        name: "Task User",
      });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "taskuser@example.com", password: "password123" })
      .expect(200);

    accessToken = loginResponse.body.data.tokens.accessToken;
    testUserId = loginResponse.body.data.user.id;
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "Test Task", description: "Test description" })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Test Task");
      expect(response.body.data.description).toBe("Test description");
    });

    it("should reject missing title", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject missing token", async () => {
      await request(app)
        .post("/api/tasks")
        .send({ title: "No Auth Task" })
        .expect(401);
    });
  });

  describe("GET /api/tasks", () => {
    it("should list all tasks for the user with pagination", async () => {
      const response = await request(app)
        .get("/api/tasks?page=1&limit=5")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toBeDefined();
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(5);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should get a specific task", async () => {
      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "Single Task" })
        .expect(201);

      const taskId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(taskId);
    });

    it("should return 404 for non-existent task", async () => {
      const response = await request(app)
        .get("/api/tasks/00000000-0000-0000-0000-000000000000")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update a task", async () => {
      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "To Update" })
        .expect(201);

      const taskId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ completed: true })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.completed).toBe(true);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task", async () => {
      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ title: "To Delete" })
        .expect(201);

      const taskId = createResponse.body.data.id;

      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      // Verify deletion
      await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe("GET /api/tasks/admin/all", () => {
    it("should return 403 for non-admin user", async () => {
      const response = await request(app)
        .get("/api/tasks/admin/all")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.passwordResetToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
});