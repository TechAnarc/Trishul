/**
 * Trishul Platform - Database Seed
 * Creates default Super Admin account.
 * Credentials are sourced from environment variables only.
 *
 * Run: npm run seed (from apps/backend)
 */

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load .env if present (dev)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

  await prisma.user.create({
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

async function seedAdmin(): Promise<void> {
  const email = 'admin@trishul.com';
  const password = 'admin';
  
  console.log(`\n👨‍💼 Seeding Agency Admin: ${email}`);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Admin already exists: ${email}`);
    // Update password just in case
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { email }, data: { password: hashedPassword } });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: 'Agency Manager',
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: '+918888888888',
      role: Role.ADMIN,
      isMfaEnabled: false,
      isActive: true,
      adminProfile: {
        create: {
          agencyName: 'Trishul Travels',
        }
      }
    },
  });

  console.log(`✅ Admin created successfully!`);
}

async function seedDriver(): Promise<void> {
  const email = 'driver@trishul.com';
  const password = 'driver';
  
  console.log(`\n🚗 Seeding Driver: ${email}`);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Driver already exists: ${email}`);
    // Update password just in case
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { email }, data: { password: hashedPassword } });
    return;
  }

  // Find the admin profile to associate the driver with
  const adminUser = await prisma.user.findUnique({ 
    where: { email: 'admin@trishul.com' }, 
    include: { adminProfile: true } 
  });
  
  if (!adminUser || !adminUser.adminProfile) {
    console.log(`❌ Cannot seed driver: Associated Admin not found.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: 'Rajan Sharma',
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: '+919999999999',
      role: Role.DRIVER,
      isMfaEnabled: false,
      isActive: true,
      driver: {
        create: {
          licenseNumber: 'DL-2041',
          experience: 5,
          adminId: adminUser.adminProfile.id
        }
      }
    },
  });

  console.log(`✅ Driver created successfully!`);
}

async function seedVehicle(adminId: string): Promise<string> {
  const vehicleNumber = 'MH-01-AB-1234';
  
  const existing = await prisma.vehicle.findUnique({ where: { vehicleNumber } });
  if (existing) {
    console.log(`✅ Vehicle already exists: ${vehicleNumber}`);
    return existing.id;
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      vehicleNumber,
      model: 'Innova Crysta',
      make: 'Toyota',
      year: 2023,
      color: 'Pearl White',
      fuelType: 'DIESEL',
      seatingCapacity: 7,
      status: 'AVAILABLE',
      adminId,
    }
  });

  console.log(`✅ Vehicle created: ${vehicleNumber}`);
  return vehicle.id;
}

async function seedTripsAndLogs(adminId: string, driverId: string, vehicleId: string): Promise<void> {
  // 1. Create a Completed Trip
  await prisma.trip.create({
    data: {
      tripCode: 'TRP-1001',
      adminId,
      driverId,
      vehicleId,
      clientName: 'Rahul Mehta',
      clientPhone: '+919876543210',
      startLocation: 'Mumbai Airport (T2)',
      endLocation: 'Gateway of India, Mumbai',
      status: 'COMPLETED',
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24h ago
      endTime: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22h ago
      distance: 28.5,
      notes: 'Business trip transfer.',
    }
  });

  // 2. Create an In-Progress Trip
  const activeTrip = await prisma.trip.create({
    data: {
      tripCode: 'TRP-LIVE-77',
      adminId,
      driverId,
      vehicleId,
      clientName: 'Suresh Deshmukh',
      clientPhone: '+918877665544',
      startLocation: 'Dadar Station, Mumbai',
      endLocation: 'Lonavala, MH',
      status: 'IN_PROGRESS',
      startTime: new Date(Date.now() - 30 * 60 * 1000), // 30m ago
      scheduledAt: new Date(),
    }
  });

  // 3. Add Location Logs for the live trip
  const logs = [
    { latitude: 19.0178, longitude: 72.8478, speed: 40 }, // Dadar
    { latitude: 19.0473, longitude: 72.8752, speed: 65 }, // Sion
    { latitude: 19.0645, longitude: 72.8801, speed: 80 }, // Kurla
  ];

  for (const [index, log] of logs.entries()) {
    await prisma.locationLog.create({
      data: {
        tripId: activeTrip.id,
        latitude: log.latitude,
        longitude: log.longitude,
        speed: log.speed,
        timestamp: new Date(Date.now() - (3 - index) * 5 * 60 * 1000),
      }
    });
  }

  // 4. Add some expenses
  await prisma.expense.createMany({
    data: [
      {
        tripId: activeTrip.id,
        driverId,
        adminId,
        category: 'FUEL',
        amount: 1500,
        note: 'Full tank diesel refill.',
        isVerified: true,
      },
      {
        tripId: activeTrip.id,
        driverId,
        adminId,
        category: 'TOLL',
        amount: 320,
        note: 'Mumbai-Pune Expressway toll.',
      }
    ]
  });

  console.log(`✅ Trips, Logs, and Expenses seeded!`);
}

async function main(): Promise<void> {
  console.log('🚀 Starting Trishul database seed...');
  
  // ── Seed Users ──
  await seedSuperAdmin();
  await seedAdmin();
  await seedDriver();

  // ── Seed Relations ──
  const adminProfile = await prisma.admin.findFirst({
    where: { user: { email: 'admin@trishul.com' } }
  });
  const driverProfile = await prisma.driver.findFirst({
    where: { user: { email: 'driver@trishul.com' } }
  });

  if (adminProfile && driverProfile) {
    const vehicleId = await seedVehicle(adminProfile.id);
    await seedTripsAndLogs(adminProfile.id, driverProfile.id, vehicleId);
  }

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
