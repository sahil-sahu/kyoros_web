import axios, { AxiosInstance } from 'axios';

// Create an instance of Axios with a base URL
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", // Replace this with your base URL
  // You can also add other configuration options here, such as headers, timeout, etc.
});

export const setheader = ()=>{
  const token = sessionStorage.getItem('token') ?? "";
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}
