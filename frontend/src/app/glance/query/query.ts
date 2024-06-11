import { axiosInstance, setheader } from "@/lib/axios";
import { GlanceInfo } from "@/types/glance";
interface glanceOp {
  icu: {
    id: number;
    name: string;
    beds: GlanceInfo[]
  }
}
export const fetchGlance = async (): Promise<glanceOp[]> => {
    const response = await axiosInstance.get(`/hospital/glance`, {
        headers: await setheader(),
      });
    return response.data;
  };
