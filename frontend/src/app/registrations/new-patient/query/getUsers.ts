import { axiosInstance, setheader } from "@/lib/axios";
import { PatientInfoProps } from "@/types/pateintinfo";

interface User {
    id:string,
    name:string,
    userType:string,
}

export const getUsers = async (): Promise<User[]> => {
    const response = await axiosInstance.get(`/hospital/users`, {
        headers: await setheader(),
      });
    return response.data;
  };
