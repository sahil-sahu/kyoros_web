import { axiosInstance, setheader } from "@/lib/axios";
import { ICUInfo } from "@/types/ICU";

export const fetchICU = async (): Promise<ICUInfo[]> => {
    const response = await axiosInstance.get(`/hospital/icu`, {
        headers: await setheader(),
      });
    return response.data;
  };
