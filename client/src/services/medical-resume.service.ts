import api from '@/lib/axios'

export const medicalResumeService = {
  async createMedicalResume(data: any) {
    const response = await api.post('/api/medical-resume', data)
    return response.data
  },

  async getPatientResumes(patientId: string) {
    const response = await api.get(`/api/medical-resume/patient/${patientId}`)
    return response.data
  },

  async getLatestPatientResume(patientId: string) {
    const response = await api.get(`/api/medical-resume/latest/patient/${patientId}`)
    return response.data
  },

  async getMedicalResume(id: string) {
    const response = await api.get(`/api/medical-resume/${id}`)
    return response.data
  },

  async updateMedicalResume(id: string, data: any) {
    const response = await api.patch(`/api/medical-resume/${id}`, data)
    return response.data
  },
}
