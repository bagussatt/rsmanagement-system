import api from "@/lib/axios";

export const cpptService = {
  createCppt: async (cpptData: any) => {
    const response = await api.post('/api/cppt', cpptData);
    return response.data;
  },

  getPatientCppts: async (patientId: string) => {
    const response = await api.get(`/api/cppt/patient/${patientId}`);
    return response.data;
  },

  getCppt: async (id: string) => {
    const response = await api.get(`/api/cppt/${id}`);
    return response.data;
  },
};