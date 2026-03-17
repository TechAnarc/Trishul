import { prisma } from '../../config/database';
import { RegisterDto } from './auth.types';
import { User, Role } from '@prisma/client';

class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(dto: RegisterDto, hashedPassword: string): Promise<User> {
    return prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        phone: dto.phone,
        role: dto.role ?? Role.DRIVER,
      },
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async updateMfaSecret(id: string, secret: string, method: any): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        isMfaEnabled: true,
        mfaMethod: method,
        mfaSecret: secret,
      },
    });
  }
}

export const authRepository = new AuthRepository();
