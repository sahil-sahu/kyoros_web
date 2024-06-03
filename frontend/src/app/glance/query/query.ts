import { axiosInstance, setheader } from "@/lib/axios";
import { GlanceInfo } from "@/types/glance";
interface glanceOp {
  beds : GlanceInfo[];
  icus : string[];
}
export const fetchGlance = async (): Promise<glanceOp> => {
    const response = await axiosInstance.get(`/hospital/glance`, {
        headers: await setheader(),
      });
    return response.data;
  };
