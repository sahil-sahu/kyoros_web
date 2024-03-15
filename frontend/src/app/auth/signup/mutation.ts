import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { axiosInstance, setheader } from '@/lib/axios';
import { CreateUserBody } from "@/types/auth";

export const createUser = async ({ email, userType, password }: CreateUserBody):Promise<string> => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = await userCred.user.getIdToken();
      sessionStorage.setItem('token', user);
      sessionStorage.setItem('userType', userType);
      await axiosInstance.post('/api/auth/signup', {
        email,
        userType,
      }, {
        headers: setheader(),
      });
      return userType;
    } catch (error) {
      throw error;
    }
  };
  