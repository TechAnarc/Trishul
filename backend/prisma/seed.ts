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
  // Use user-provided credentials directly as the robust fallback
  const email = requireEnv('SUPER_ADMIN_EMAIL', 'mahakal.mahakali014@gmail.com');
  const password = requireEnv('SUPER_ADMIN_PASSWORD', 'Mahakali@0786');
  const name = process.env.SUPER_ADMIN_NAME ?? 'Piyush';
  const phone = process.env.SUPER_ADMIN_PHONE ?? '+919876543210';

  console.log(`\n🔱 Seeding Super Admin: ${email}`);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Super Admin already exists: ${email}`);
    // Update password if it already exists to ensure requested credentials work
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });
    console.log(`🔄 Password synchronized for: ${email}`);
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
      isMfaEnabled: false, // Disabling MFA initially for easier first login
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
