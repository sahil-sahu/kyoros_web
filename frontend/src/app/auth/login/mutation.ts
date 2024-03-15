import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
export const logUser = async ({ email, password }: {email:string, password:string}):Promise<string>  => {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const {claims , token} = await userCred.user.getIdTokenResult();
        const type = String(claims.userType || "");
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userType', type);
        return type;
    } catch (error) {
      throw error;
    }
  };