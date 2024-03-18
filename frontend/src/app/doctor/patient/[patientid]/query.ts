import { axiosInstance } from "@/lib/axios";
import { PatientRealtimeObj } from "@/types/pateintinfo";
import { QueryFunctionContext } from "@tanstack/react-query";

export const fetchPatientlog = async ({queryKey}: QueryFunctionContext): Promise<PatientRealtimeObj[]> => {
    const response = await axiosInstance.get<PatientRealtimeObj[]>(`/patient/${queryKey}/realtimelog`);
    return response.data;
  };
