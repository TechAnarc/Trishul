import { prisma } from '../../config/database';
import { Trip, TripStatus, Prisma } from '@prisma/client';

export class TripRepository {
  async create(data: Prisma.TripUncheckedCreateInput): Promise<Trip> {
    return prisma.trip.create({ data });
  }

  async findById(id: string): Promise<Trip | null> {
    return prisma.trip.findUnique({
      where: { id },
      include: {
        driver: { include: { user: true } },
        vehicle: true,
      },
    });
  }

  async updateStatus(id: string, status: TripStatus, data?: Prisma.TripUpdateInput): Promise<Trip> {
    return prisma.trip.update({
      where: { id },
      data: {
        status,
        ...data,
      },
    });
  }

  async findByDriver(driverId: string): Promise<Trip[]> {
    return prisma.trip.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
      include: { vehicle: true },
    });
  }

  async findAll(params: {
    status?: TripStatus;
    driverId?: string;
    vehicleId?: string;
    skip?: number;
    take?: number;
  }): Promise<[Trip[], number]> {
    const where: Prisma.TripWhereInput = {
      status: params.status,
      driverId: params.driverId,
      vehicleId: params.vehicleId,
    };

    return Promise.all([
      prisma.trip.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        include: {
          driver: { include: { user: true } },
          vehicle: true,
        },
      }),
      prisma.trip.count({ where }),
    ]);
  }

  async delete(id: string): Promise<void> {
    await prisma.trip.delete({ where: { id } });
  }

  async logLocation(tripId: string, data: { latitude: number; longitude: number; speed?: number }): Promise<void> {
    await prisma.locationLog.create({
      data: {
        tripId,
        ...data,
      },
    });
  }
}

export const tripRepository = new TripRepository();
