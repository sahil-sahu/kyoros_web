import { axiosInstance, setheader } from "@/lib/axios";
import { ICUInfo } from "@/types/ICU";

export const fetchICU = async (): Promise<ICUInfo[]> => {
    const response = await axiosInstance.get(`/hospital/icu`, {
        headers: await setheader(),
      });
    const infos: ICUInfo[] = response.data;  
    if(response.status == 200 && infos.length < 1 ) throw new Error("No ICUs configured currently");  
    return infos;
  };
