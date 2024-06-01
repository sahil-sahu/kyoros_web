import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import axios from "axios";
export const logUser = async ({ email, password }: {email:string, password:string}):Promise<string>  => {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const {claims , token} = await userCred.user.getIdTokenResult();
        const type = String(claims.userType || "");
        localStorage.setItem('token', token);
        localStorage.setItem('userType', type);
        localStorage.setItem('hospital', String(claims.hospitalId|| ""));
        const formData = new FormData();
        formData.append('token', token);
        formData.append('hospital', String(claims.hospitalId || ""));
        await axios.post("/setCookie", formData)
        return type;
    } catch (error) {
      throw error;
    }
  };