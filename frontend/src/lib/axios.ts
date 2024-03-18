import axios, { AxiosInstance } from 'axios';
import { auth } from './firebase';

// Create an instance of Axios with a base URL
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", // Replace this with your base URL
  // You can also add other configuration options here, such as headers, timeout, etc.
});
async function fetchAuth(){
  await auth.authStateReady();
  const user = auth.currentUser;
  if (user != null) {
    const token = await user.getIdToken();
    sessionStorage.setItem('token', token);
    return token;
  }
  return "";
}
export const setheader = async ()=>{
  const token = sessionStorage.getItem('token') ?? await fetchAuth();
  console.log(token)
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}
