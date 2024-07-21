import { axiosInstance, setheader } from "@/lib/axios";
import { ICU } from "@/types/ICU";

export const fetchOccupancy = async (): Promise<ICU[]> => {
    const response = await axiosInstance.get(`/hospital/occupancy`, {
        headers: await setheader(),
      });
    return response.data;
  };
