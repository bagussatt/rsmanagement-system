import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CpptService {
  constructor(private prisma: PrismaService) {}

  async createCppt(createCpptDto: any, authorId: string) {
    const { patientId, visitId, subjective, objective, assessment, plan, instruction } = createCpptDto;

    // Validate patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new BadRequestException('Patient not found');
    }

    // Prepare create data
    const createData: any = {
      patientId,
      authorId,
      subjective,
      objective,
      assessment,
      plan,
      instruction: instruction || null,
      isVerified: false,
    };

    // Only include visitId if provided
    if (visitId) {
      createData.visitId = visitId;
    }

    // Create CPPT entry
    const cppt = await this.prisma.cppt.create({
      data: createData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            specialization: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            medicalRecordNumber: true,
          },
        },
        ...(visitId && {
          visit: {
            select: {
              id: true,
              checkInAt: true,
              status: true,
            },
          },
        }),
      },
    });

    return cppt;
  }

  async getPatientCppts(patientId: string) {
    return this.prisma.cppt.findMany({
      where: { patientId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            specialization: true,
          },
        },
        verifiedBy: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
          },
        },
        visit: {
          select: {
            id: true,
            checkInAt: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getCppt(id: string) {
    return this.prisma.cppt.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            specialization: true,
          },
        },
        verifiedBy: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            medicalRecordNumber: true,
          },
        },
        visit: {
          select: {
            id: true,
            checkInAt: true,
            status: true,
          },
        },
      },
    });
  }
}
