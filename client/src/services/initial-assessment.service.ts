import api from '@/lib/axios'

export const initialAssessmentService = {
  async createInitialAssessment(patientId: string, data: any) {
    const response = await api.post(`/api/initial-assessment/patient/${patientId}`, data)
    return response.data
  },

  async getPatientAssessment(patientId: string) {
    const response = await api.get(`/api/initial-assessment/patient/${patientId}`)
    return response.data
  },

  async getAssessmentsByNurse(nurseId: string) {
    const response = await api.get(`/api/initial-assessment/nurse/${nurseId}`)
    return response.data
  },

  async updateAssessmentByDoctor(patientId: string, data: any) {
    const response = await api.patch(`/api/initial-assessment/patient/${patientId}/doctor-review`, data)
    return response.data
  },
}
