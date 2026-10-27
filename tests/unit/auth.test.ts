import request from "supertest";
import app from "../../src/app";
import { prisma } from "../setup";

describe("Auth Endpoints", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.role).toBe("USER");
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
    });

    it("should reject invalid email", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ email: "invalid-email", password: "password123" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject short password", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ email: "valid@example.com", password: "123" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should not register duplicate email", async () => {
      await request(app).post("/api/auth/register").send(testUser);

      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(testUser);
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tokens.accessToken).toBeDefined();
    });

    it("should reject invalid password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: "wrongpassword" })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    it("should return success for existing email", async () => {
      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: testUser.email })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe("POST /api/auth/reset-password", () => {
    it("should reset password with valid token", async () => {
      // First get a reset token
      const forgotResponse = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: testUser.email })
        .expect(200);

      const tokenMatch = forgotResponse.body.message.match(/Reset token: (\S+)/);
      const token = tokenMatch ? tokenMatch[1] : "";

      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({ token, password: "newPassword123" })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should reject invalid token", async () => {
      const response = await request(app)
        .post("/api/auth/reset-password")
        .send({ token: "invalid-token", password: "newPassword123" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  afterAll(async () => {
    await prisma.passwordResetToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
});