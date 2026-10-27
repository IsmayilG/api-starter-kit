import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { AuthRepository } from "../repositories/auth.repository";
import { env } from "../config/env";
import { AppError } from "../utils/app-error.util";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<{ user: { id: string; email: string; name?: string; role: string }; tokens: TokenPair }> {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.authRepository.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    const tokens = this.generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        role: user.role,
      },
      tokens,
    };
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: { id: string; email: string; name?: string; role: string }; tokens: TokenPair }> {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const tokens = this.generateTokens(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        role: user.role,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET as Secret) as { userId: string; role: string };
      const accessToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, env.JWT_SECRET as Secret, {
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      });
      return { accessToken };
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return { message: "If email exists, a reset link has been generated" };
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.authRepository.createResetToken({ token, userId: user.id, expiresAt });

    // In production, send email here. For now, return token in response for testing
    return { message: `Reset token: ${token} (check email in production)` };
  }

  async resetPassword(data: { token: string; password: string }): Promise<{ message: string }> {
    const resetToken = await this.authRepository.findValidResetToken(data.token);
    if (!resetToken) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    await this.authRepository.updatePassword(resetToken.userId, hashedPassword);
    await this.authRepository.markTokenAsUsed(resetToken.id);

    return { message: "Password has been reset successfully" };
  }

  private generateTokens(userId: string, role: string): TokenPair {
    const accessToken = jwt.sign({ userId, role }, env.JWT_SECRET as Secret, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign({ userId, role }, env.JWT_REFRESH_SECRET as Secret, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    return { accessToken, refreshToken };
  }
}