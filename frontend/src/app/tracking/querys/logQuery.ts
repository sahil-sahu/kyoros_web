import { axiosInstance, setheader } from "@/lib/axios";
import { PatientInfoProps, Patientlog } from "@/types/pateintinfo";
import { QueryFunctionContext } from "@tanstack/query-core";
// import { ICUInfo } from "@/types/ICU";
interface LogData extends PatientInfoProps {
    logs : Patientlog[];
}
export const fetchPatientlogs = async ({queryKey}: QueryFunctionContext): Promise<LogData> => {
    const [patientid, old, freq] = queryKey;
    if(!patientid) throw "no patient id available";
    const response = await axiosInstance.get(`/logs/trend/${patientid}`, {
        params:{old,freq},
        headers: await setheader(),
      });
    return response.data;
  };
export const fetchPatientlog = async ({queryKey}: QueryFunctionContext): Promise<LogData> => {
    const [patientid] = queryKey;
    if(!patientid) throw "no patient id available";
    const response = await axiosInstance.get(`/logs/latest/${patientid}`, {
        // params:{old},
        headers: await setheader(),
      });
    return response.data;
  };
