import { axiosInstance, setheader } from "@/lib/axios";
import { ICUInfo } from "@/types/ICU";

export const fetchICU_Unoccupied = async (): Promise<ICUInfo[]> => {
    const response = await axiosInstance.get(`/hospital/unoccupied`, {
        headers: await setheader(),
      });
    const infos: ICUInfo[] = response.data;  
    return infos;
  };
