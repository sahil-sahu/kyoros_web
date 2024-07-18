import { axiosInstance, setheader } from "@/lib/axios";
import { PatientInfoProps } from "@/types/pateintinfo";

export const getByUhid = async ({uhid}:{uhid:string}): Promise<PatientInfoProps> => {
    const response = await axiosInstance.get(`/patient/byuhid`, {
        headers: await setheader(),
        params: {
            uhid
        }
      });
    const patient:PatientInfoProps = response.data;  
    if(response.status != 200 || !patient ) throw new Error("patient not found");  
    return patient;
  };
