import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface Patient {
    name: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    _id: string;
    __v: number;
  }

export const fetchPatients = async (): Promise<Patient[]> => {
    const response = await axiosInstance.get<Patient[]>('/patient');
    return response.data;
  };

export const usePatientQuery = (patientId: string) => {
    return useQuery<Patient>({queryKey:['patient', patientId], queryFn: async ({ queryKey }) => {
      const [, actualPatientId] = queryKey; // Destructure query key arguments
      const response = await axiosInstance.get<Patient[]>(`/patient/${actualPatientId}`);
      return response.data[0];
    }});
  };