import { axiosInstance, setheader } from "@/lib/axios";
import { ICU } from "@/types/ICU";
export interface ICUConfig extends ICU{
  users:string[];
}
export const fetchICUConfig = async (): Promise<ICUConfig[]> => {
    const response = await axiosInstance.get(`/hospital/icu/detailed`, {
        headers: await setheader(),
      });
    return response.data;
  };
