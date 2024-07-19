import { axiosInstance, setheader } from "@/lib/axios";

export const transferPatient = async (payload:{bedId:number, bedName:string, icuName:string ,oldId:number, icuId:number, sessionId:string}) => {
    const response = await axiosInstance.post(`/session/transfer`, payload,{
        headers: await setheader(),
      });
    return response.data;
  };
