import { axiosInstance, setheader } from "@/lib/axios";

export const dischargePatient = async (payload:{sessionId:string, reason:string}) => {
    const response = await axiosInstance.post(`/session/discharge`, payload,{
        headers: await setheader(),
      });
    return response.data;
  };
