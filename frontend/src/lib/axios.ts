import axios, { AxiosInstance } from 'axios';
import { auth } from './firebase';
// Create an instance of Axios with a base URL
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", // Replace this with your base URL
  // You can also add other configuration options here, such as headers, timeout, etc.
});
export async function fetchAuth(){
  await auth.authStateReady();
  const user = auth.currentUser;
  // console.log(user)
  if (user != null) {
    const {claims , token} = await user.getIdTokenResult();
    const formData = new FormData();
    formData.append('token', token);
    formData.append('hospital', String(claims.hospitalId || ""));
    formData.append('userType', String(claims.userType || ""));
    axios.post("/setCookie", formData)
    sessionStorage.setItem('token', token);
    localStorage.setItem('userType', String(claims.userType || ""));
    localStorage.setItem('hospital', String(claims.hospitalId || ""));
    return token;
  }
  return "";
}
export const setheader = async ()=>{
  const token = await fetchAuth();
  // const token = sessionStorage.getItem('token') ?? await fetchAuth();
  // console.log(token)
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}
