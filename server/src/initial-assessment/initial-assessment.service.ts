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

    // Create or update patient with initial assessment data
    const assessment = await this.prisma.patient.update({
      where: { id: patientId },
      data: {
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
      select: {
        id: true,
        medicalRecordNumber: true,
        name: true,
        // All assessment fields
        chiefComplaint: true,
        painScale: true,
        currentIllnessHistory: true,
        pastMedicalHistory: true,
        allergies: true,
        bloodPressure: true,
        temperature: true,
        pulse: true,
        respiration: true,
        spO2: true,
        headToToeExam: true,
        fallRisk: true,
        nutritionalStatus: true,
        functionalAssessment: true,
        initialDiagnosis: true,
        nursingPlanning: true,
        patientEducation: true,
        communicationNeeds: true,
        socioeconomicHistory: true,
        triageCategory: true,
        createdAt: true,
        updatedAt: true,
        doctor: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            specialization: true,
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
    const assessment = await this.prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        medicalRecordNumber: true,
        name: true,
        birthDate: true,
        gender: true,
        // All assessment fields
        chiefComplaint: true,
        painScale: true,
        currentIllnessHistory: true,
        pastMedicalHistory: true,
        allergies: true,
        bloodPressure: true,
        temperature: true,
        pulse: true,
        respiration: true,
        spO2: true,
        headToToeExam: true,
        fallRisk: true,
        nutritionalStatus: true,
        functionalAssessment: true,
        initialDiagnosis: true,
        nursingPlanning: true,
        patientEducation: true,
        communicationNeeds: true,
        socioeconomicHistory: true,
        triageCategory: true,
        createdAt: true,
        updatedAt: true,
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
    });

    if (!assessment) {
      throw new NotFoundException('Patient not found');
    }

    return assessment;
  }

  async getAssessmentsByNurse(nurseId: string) {
    return this.prisma.patient.findMany({
      where: {
        // Assuming we might want to track who created assessments
        // For now, get all patients with assessments
        chiefComplaint: { not: null },
      },
      select: {
        id: true,
        medicalRecordNumber: true,
        name: true,
        chiefComplaint: true,
        triageCategory: true,
        initialDiagnosis: true,
        createdAt: true,
        updatedAt: true,
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateAssessmentByDoctor(patientId: string, doctorData: any, doctorId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        doctor: true,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Update assessment with doctor's notes/review
    const updated = await this.prisma.patient.update({
      where: { id: patientId },
      data: {
        // Add doctor's review notes
        doctorNotes: doctorData.doctorNotes || null,
        // Update diagnosis if provided
        ...(doctorData.initialDiagnosis && { initialDiagnosis: doctorData.initialDiagnosis }),
        // Or update other fields as needed
        ...(doctorData.nursingPlanning && { nursingPlanning: doctorData.nursingPlanning }),
      },
      select: {
        id: true,
        medicalRecordNumber: true,
        name: true,
        // All assessment fields
        chiefComplaint: true,
        painScale: true,
        currentIllnessHistory: true,
        pastMedicalHistory: true,
        allergies: true,
        bloodPressure: true,
        temperature: true,
        pulse: true,
        respiration: true,
        spO2: true,
        headToToeExam: true,
        fallRisk: true,
        nutritionalStatus: true,
        functionalAssessment: true,
        initialDiagnosis: true,
        nursingPlanning: true,
        patientEducation: true,
        communicationNeeds: true,
        socioeconomicHistory: true,
        triageCategory: true,
        doctorNotes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }
}
