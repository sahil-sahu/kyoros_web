import { axiosInstance, setheader } from "@/lib/axios";
import { PatientInfoProps } from "@/types/pateintinfo";
import { PatientDoc } from "@/types/patientDoc";
import { QueryFunctionContext } from "@tanstack/query-core";
interface docsOp {
  patient: PatientInfoProps;
  docs: PatientDoc[];
}
export const getDocs = async ({queryKey}: QueryFunctionContext): Promise<docsOp> => {
    const [_,patientid] = queryKey;
    const response = await axiosInstance.get(`/patient/${patientid}/docs`, {
        headers: await setheader(),
      });
    return response.data;
  };
