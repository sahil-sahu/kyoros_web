import { axiosInstance } from '@/lib/axios';
import { Hospital } from '@/types/hospital';



export const getHospitals = async ():Promise<Hospital[]> => {
    try {
      const res =  await axiosInstance.get('/hospital');
      return res.data;
    } catch (error) {
      throw error;
    }
  };
