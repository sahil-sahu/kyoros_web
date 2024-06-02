import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { axiosInstance, setheader } from '@/lib/axios';
import { CreateUserBody } from "@/types/auth";
import axios from "axios";

export const createUser = async ({ email, userType, password, hospital }: CreateUserBody):Promise<string> => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = await userCred.user.getIdToken();
      sessionStorage.setItem('token', user);
      localStorage.setItem('userType', userType);
      localStorage.setItem('hospital', hospital.id);
      await axiosInstance.post('/api/auth/signup', {
        email,
        userType,
        hospitalId: hospital.id
      }, {
        headers: await setheader(),
      });
      const formData = new FormData();
      formData.append('token', user);
      formData.append('hospital', hospital.id);
      await axios.post("/setCookie", formData)
      return userType;
    } catch (error) {
      throw error;
    }
  };
  