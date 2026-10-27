import { prisma } from "../config/db";
import { User, PasswordResetToken } from "@prisma/client";

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async createResetToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<PasswordResetToken> {
    return prisma.passwordResetToken.create({
      data: {
        token: data.token,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findValidResetToken(token: string): Promise<PasswordResetToken | null> {
    return prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  async markTokenAsUsed(tokenId: string): Promise<void> {
    await prisma.passwordResetToken.update({
      where: { id: tokenId },
      data: { used: true },
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}