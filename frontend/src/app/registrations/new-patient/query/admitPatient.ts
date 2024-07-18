import { axiosInstance, setheader } from "@/lib/axios";
import { PatientInfoProps } from "@/types/pateintinfo";

export const makeSession = async (payload:any) => {
    const response = await axiosInstance.post(`/session/make`, payload,{
        headers: await setheader(),
      });
    return response;
  };
