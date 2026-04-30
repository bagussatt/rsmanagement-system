import api from "@/lib/axios";

export const patientService = {
  getAllPatients: async () => {
    const response = await api.get('/api/patients');
    return response.data;
  },

  getPatient: async (id: string) => {
    const response = await api.get(`/api/patients/${id}`);
    return response.data;
  },

  createPatient: async (data: any) => {
    const response = await api.post('/api/patients', data);
    return response.data;
  },
};