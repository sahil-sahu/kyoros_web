import { axiosInstance, setheader } from "@/lib/axios";
import { sensor } from "@/types/sensor";

export const getSensors = async (): Promise<sensor[]> => {
    const response = await axiosInstance.get(`/sensor`, {
        headers: await setheader(),
      });
    const sensors: sensor[] = response.data;  
    if(response.status == 200 && sensors.length < 1 ) throw new Error("No Sensors found");  
    return sensors;
  };
