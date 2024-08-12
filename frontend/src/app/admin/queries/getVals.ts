import { axiosInstance } from "@/lib/axios";
import { QueryFunctionContext } from "@tanstack/query-core";

export const fetchMetric = async ({queryKey}: QueryFunctionContext): Promise<{y:number[]; x: string[]}> => {
    const [_,icuId, metric, old, freq] = queryKey;

    const response = await axiosInstance.get(`/hospital/admin/trends`, {
        params:{old,freq,icuId,metric},
      });
    return response.data;
  };