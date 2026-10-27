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
    });

    it("should reject missing token", async () => {
      await request(app)
        .post("/api/tasks")
        .send({ title: "No Auth Task" })
        .expect(401);
    });
  });

  describe("GET /api/tasks", () => {
    it("should list all tasks for the user", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
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

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
});