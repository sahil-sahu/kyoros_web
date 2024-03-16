import { createUserWithEmailAndPassword } from "firebase/auth";
import { axiosInstance, setheader } from '@/lib/axios';
interface fcmRes {
    fcmSet:boolean;
}
export const setFcm = async ({ token}: {token:string}):Promise<fcmRes> => {
    try {
      const response = await axiosInstance.post('/api/auth/set-fcm', {
        token
      }, {
        headers: await setheader(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };