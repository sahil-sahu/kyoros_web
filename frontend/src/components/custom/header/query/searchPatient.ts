import { axiosInstance, setheader } from "@/lib/axios";
import { PatientInfoProps } from "@/types/pateintinfo";
import { QueryFunctionContext } from "@tanstack/query-core";

export const searchPatient = async ({queryKey}: QueryFunctionContext): Promise<PatientInfoProps[]> => {
    const response = await axiosInstance.get(`/patient`, {
        headers: await setheader(),
      });
    const infos = response.data;  
    return infos;
  };
