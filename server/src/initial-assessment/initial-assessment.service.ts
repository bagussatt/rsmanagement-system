import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class InitialAssessmentService {
  constructor(private prisma: PrismaService) {}

  async createInitialAssessment(patientId: string, assessmentData: any, nurseId: string) {
    // Validate patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Check if assessment already exists
    const existingAssessment = await this.prisma.initialAssessment.findUnique({
      where: { patientId },
    });

    if (existingAssessment) {
      throw new BadRequestException('Initial assessment already exists for this patient');
    }

    // Create initial assessment
    const assessment = await this.prisma.initialAssessment.create({
      data: {
        patientId,
        nurseId,
        // Anamnesis (Data Subjektif)
        chiefComplaint: assessmentData.chiefComplaint || null,
        painScale: assessmentData.painScale || null,
        currentIllnessHistory: assessmentData.currentIllnessHistory || null,
        pastMedicalHistory: assessmentData.pastMedicalHistory || null,
        allergies: assessmentData.allergies || null,

        // Pemeriksaan Fisik (Data Objektif)
        bloodPressure: assessmentData.bloodPressure || null,
        temperature: assessmentData.temperature || null,
        pulse: assessmentData.pulse || null,
        respiration: assessmentData.respiration || null,
        spO2: assessmentData.spO2 || null,
        headToToeExam: assessmentData.headToToeExam || null,

        // Skrining Fungsional & Risiko
        fallRisk: assessmentData.fallRisk || null,
        nutritionalStatus: assessmentData.nutritionalStatus || null,
        functionalAssessment: assessmentData.functionalAssessment || null,

        // Asesmen Medis & Keperawatan
        initialDiagnosis: assessmentData.initialDiagnosis || null,
        nursingPlanning: assessmentData.nursingPlanning || null,

        // Tambahan Spesifik
        patientEducation: assessmentData.patientEducation || null,
        communicationNeeds: assessmentData.communicationNeeds || null,
        socioeconomicHistory: assessmentData.socioeconomicHistory || null,

        // Triage
        triageCategory: assessmentData.triageCategory || null,
      },
      include: {
        patient: {
          select: {
            id: true,
            medicalRecordNumber: true,
            name: true,
            birthDate: true,
            gender: true,
            doctor: {
              select: {
                id: true,
                name: true,
                username: true,
                role: true,
                specialization: true,
              },
            },
          },
        },
        nurse: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            specialization: true,
          },
        },
      },
    });

    return assessment;
  }

  async getPatientAssessment(patientId: string) {
    const assessment = await this.prisma.initialAssessment.findUnique({
      where: { patientId },
      include: {
        patient: {
          select: {
            id: true,
            medicalRecordNumber: true,
            name: true,
            birthDate: true,
            gender: true,
            doctor: {
              select: {
                id: true,
                name: true,
                username: true,
                role: true,
                specialization: true,
              },
            },
          },
        },
        nurse: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            specialization: true,
          },
        },
      },
    });

    if (!assessment) {
      throw new NotFoundException('Initial assessment not found');
    }

    return assessment;
  }

  async getAssessmentsByNurse(nurseId: string) {
    return this.prisma.initialAssessment.findMany({
      where: {
        nurseId,
      },
      include: {
        patient: {
          select: {
            id: true,
            medicalRecordNumber: true,
            name: true,
            doctor: {
              select: {
                id: true,
                name: true,
                specialization: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateAssessmentByDoctor(patientId: string, doctorData: any, doctorId: string) {
    const assessment = await this.prisma.initialAssessment.findUnique({
      where: { patientId },
      include: {
        patient: {
          include: {
            doctor: true,
          },
        },
      },
    });

    if (!assessment) {
      throw new NotFoundException('Initial assessment not found');
    }

    // Update assessment with doctor's notes/review
    const updated = await this.prisma.initialAssessment.update({
      where: { patientId },
      data: {
        // Add doctor's review notes
        doctorNotes: doctorData.doctorNotes || null,
        // Update diagnosis if provided
        ...(doctorData.initialDiagnosis && { initialDiagnosis: doctorData.initialDiagnosis }),
        // Or update other fields as needed
        ...(doctorData.nursingPlanning && { nursingPlanning: doctorData.nursingPlanning }),
      },
      include: {
        patient: {
          select: {
            id: true,
            medicalRecordNumber: true,
            name: true,
            doctor: {
              select: {
                id: true,
                name: true,
                specialization: true,
              },
            },
          },
        },
        nurse: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return updated;
  }
}
