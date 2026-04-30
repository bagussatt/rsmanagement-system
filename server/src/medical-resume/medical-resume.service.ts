import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class MedicalResumeService {
  constructor(private prisma: PrismaService) {}

  async createMedicalResume(createResumeDto: any, authorId: string) {
    const { patientId, diagnosis, mainComplaint, treatmentPlan, recommendations, notes } = createResumeDto;

    // Validate patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new BadRequestException('Patient not found');
    }

    // Create Medical Resume
    const resume = await this.prisma.medicalResume.create({
      data: {
        patientId,
        authorId,
        diagnosis,
        mainComplaint: mainComplaint || null,
        treatmentPlan: treatmentPlan || null,
        recommendations: recommendations || null,
        notes: notes || null,
      },
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
      },
    });

    return resume;
  }

  async getPatientResumes(patientId: string) {
    return this.prisma.medicalResume.findMany({
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getLatestPatientResume(patientId: string) {
    return this.prisma.medicalResume.findFirst({
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getMedicalResume(id: string) {
    return this.prisma.medicalResume.findUnique({
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
        patient: {
          select: {
            id: true,
            name: true,
            medicalRecordNumber: true,
          },
        },
      },
    });
  }

  async updateMedicalResume(id: string, updateResumeDto: any) {
    const { diagnosis, mainComplaint, treatmentPlan, recommendations, notes } = updateResumeDto;

    return this.prisma.medicalResume.update({
      where: { id },
      data: {
        ...(diagnosis && { diagnosis }),
        ...(mainComplaint !== undefined && { mainComplaint }),
        ...(treatmentPlan !== undefined && { treatmentPlan }),
        ...(recommendations !== undefined && { recommendations }),
        ...(notes !== undefined && { notes }),
      },
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
      },
    });
  }
}
