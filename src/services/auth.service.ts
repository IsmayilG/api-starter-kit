import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { AuthRepository } from "../repositories/auth.repository";
import { env } from "../config/env";

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
  }): Promise<{ user: { id: string; email: string; name?: string }; tokens: TokenPair }> {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.authRepository.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    const tokens = this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
      },
      tokens,
    };
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: { id: string; email: string; name?: string }; tokens: TokenPair }> {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const tokens = this.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET as Secret) as { userId: string };
      const accessToken = jwt.sign({ userId: decoded.userId }, env.JWT_SECRET as Secret, {
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      });
      return { accessToken };
    } catch {
      throw new Error("Invalid or expired refresh token");
    }
  }

  private generateTokens(userId: string): TokenPair {
    const accessToken = jwt.sign({ userId }, env.JWT_SECRET as Secret, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET as Secret, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    return { accessToken, refreshToken };
  }
}