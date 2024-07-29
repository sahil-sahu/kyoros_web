import { axiosInstance, setheader } from "@/lib/axios";
export interface Occupiedinfos {
    name:string;
    id:number;
    patientId?:string;
    occupied:boolean;
    sessionId : string;
    icuName: string;
    icuId: number;
}
export const getAllBeds = async ():Promise<Occupiedinfos[] >=> {
    const response = await axiosInstance.post(`/hospital/getbedsall`, {
        headers: await setheader(),
      });
    return response.data;
  };
