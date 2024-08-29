import { axiosInstance, setheader } from "@/lib/axios";
export interface User {
    id: string;
    userType: "doctor"|"nurse"|"admin"|"lab";
    department?: string;
    email: string;
    name: string;
    watcher: {
        id: number;
        icu: {
            id: number;
            name: string;
        };
    }[];
}[]

export const getUserMap = async ():Promise<User[] >=> {
    const response = await axiosInstance.get(`/hospital/users-mapping`, {
        headers: await setheader(),
      });
    return response.data;
  };
