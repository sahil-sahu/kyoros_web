import { axiosInstance, setheader } from '@/lib/axios';
import { sensor } from '@/types/sensor';
interface fcmRes {
    fcmSet:boolean;
}
export const setSensor = async ({ id, bedID}: sensor):Promise<sensor> => {
    try {
      const response = await axiosInstance.post('/sensor/setsensor', { sensorId:id, bedId: bedID}, {
        headers: await setheader(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };