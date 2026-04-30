import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async getAllPatients(user: any) {
    // If user is a doctor, only show their patients
    if (user.role === 'DOKTER') {
      return this.prisma.patient.findMany({
        where: {
          doctorId: user.sub || user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              username: true,
              specialization: true,
            },
          },
          visits: {
            take: 1,
            orderBy: {
              checkInAt: 'desc',
            },
          },
        },
      });
    }

    // For other roles (admin, nurse, etc.), show all patients
    return this.prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            username: true,
            specialization: true,
          },
        },
        visits: {
          take: 1,
          orderBy: {
            checkInAt: 'desc',
          },
        },
      },
    });
  }

  async getPatient(id: string, user: any) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            username: true,
            specialization: true,
          },
        },
        visits: {
          orderBy: {
            checkInAt: 'desc',
          },
          include: {
            cpptEntries: true,
          },
        },
      },
    });

    if (!patient) {
      throw new BadRequestException('Patient not found');
    }

    // If user is a doctor, check if this is their patient
    if (user.role === 'DOKTER' && patient.doctorId !== (user.sub || user.id)) {
      throw new ForbiddenException('You can only view your own patients');
    }

    return patient;
  }

  async createPatient(createPatientDto: any, user: any) {
    const {
      medicalRecordNumber,
      name,
      birthDate,
      gender,
      address,
      phone,
      doctorId,
    } = createPatientDto;

    // Check if medical record number already exists
    const existingPatient = await this.prisma.patient.findUnique({
      where: { medicalRecordNumber },
    });

    if (existingPatient) {
      throw new BadRequestException('Medical record number already exists');
    }

    // Validate doctor if provided
    if (doctorId) {
      const doctor = await this.prisma.user.findFirst({
        where: {
          id: doctorId,
          role: 'DOKTER',
        },
      });

      if (!doctor) {
        throw new BadRequestException('Doctor not found or invalid role');
      }
    }

    // Create patient
    const patient = await this.prisma.patient.create({
      data: {
        medicalRecordNumber,
        name,
        birthDate: new Date(birthDate),
        gender,
        address: address || null,
        phone: phone || null,
        doctorId: doctorId || null,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            username: true,
            specialization: true,
          },
        },
      },
    });

    return patient;
  }
}