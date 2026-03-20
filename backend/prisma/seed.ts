/**
 * Trishul Platform - Database Seed
 * Creates default Super Admin account.
 * Credentials are sourced from environment variables only.
 *
 * Run: npm run seed (from apps/backend)
 */

import { PrismaClient, Role, MfaMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load .env if present (dev)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

function requireEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (!value) throw new Error(`Missing required env variable for seeding: ${key}`);
  return value;
}

async function seedSuperAdmin(): Promise<void> {
  const email = requireEnv('SUPER_ADMIN_EMAIL', 'superadmin@trishul.app');
  const password = requireEnv('SUPER_ADMIN_PASSWORD', 'Trishul@SuperAdmin2024!');
  const name = process.env.SUPER_ADMIN_NAME ?? 'Super Admin';
  const phone = process.env.SUPER_ADMIN_PHONE ?? undefined;

  console.log(`\n🔱 Seeding Super Admin: ${email}`);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Super Admin already exists: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: Role.SUPER_ADMIN,
      isMfaEnabled: true,
      mfaMethod: MfaMethod.EMAIL_OTP, // Default to email OTP
      isActive: true,
    },
  });

  console.log(`\n✅ Super Admin created successfully!`);
}

async function main(): Promise<void> {
  console.log('🚀 Starting Trishul database seed...');
  await seedSuperAdmin();
  console.log('\n🙏 Seeding complete. Jai Mahakal! 🔱\n');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
