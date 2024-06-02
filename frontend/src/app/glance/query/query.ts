import { axiosInstance, setheader } from "@/lib/axios";
import { GlanceInfo } from "@/types/glance";

export const fetchGlance = async (): Promise<GlanceInfo[]> => {
    const response = await axiosInstance.get(`/hospital/glance`, {
        headers: await setheader(),
      });
    return response.data;
  };
