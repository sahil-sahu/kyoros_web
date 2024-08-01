import { axiosInstance, setheader } from "@/lib/axios";
import { PatientInfoProps } from "@/types/pateintinfo";
export interface activeSession {
    patientId:string;
    id: string;
    patient: PatientInfoProps;
    bedId: number[];
}
export const getActiveSessions = async ():Promise<activeSession[] >=> {
    const response = await axiosInstance.get(`/session/activesessions`, {
        headers: await setheader(),
      });
    return response.data;
  };
