import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ConflictError } from '../../middleware/errorHandler';
import { CreateAdminInput } from './admin.schema';

const prisma = new PrismaClient();

export class AdminService {
  /**
   * Creates a new Admin (Travel Agency) along with their User account.
   */
  static async createAdmin(data: CreateAdminInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictError('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Use a Prisma transaction to ensure both User and Admin records are created atomically
    const newAdmin = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase(),
          password: hashedPassword,
          phone: data.phone,
          role: Role.ADMIN,
          isActive: true, // We auto-activate admins created by Super Admin for now
        },
      });

      const adminProfile = await tx.admin.create({
        data: {
          userId: user.id,
          agencyName: data.agencyName,
        },
      });

      return { user, adminProfile };
    });

    // Strip password before returning
    const { password, ...userWithoutPassword } = newAdmin.user;
    
    return {
      user: userWithoutPassword,
      admin: newAdmin.adminProfile,
    };
  }

  /**
   * List all Admins (Agencies)
   */
  static async getAdmins() {
    const admins = await prisma.admin.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isActive: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' }
    });
    return admins;
  }
}
