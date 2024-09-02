import { createUserWithEmailAndPassword } from "firebase/auth";
import { axiosInstance, setheader } from '@/lib/axios';
export const sendTestNotification = async ():Promise<boolean> => {
    try {
      const response = await axiosInstance.post('/user/test-notify', {}, {
        headers: await setheader(),
      });
      if(response.status != 200) throw new Error(response.data);
      return true;
    } catch (error) {
      throw error;
    }
  };