import { QueryFunctionContext } from "@tanstack/query-core";
import { axiosInstance, setheader } from "./axios";
export interface User {
    id:string;
    name:string;
    email:string;
}
export const getAllotedUserforPatient = async ({queryKey}: QueryFunctionContext): Promise<User[]> => {
    const [_, patientId] = queryKey;
    const response = await axiosInstance.get(`/patient/${patientId}/getAllotedUserforPatient`, {
        // headers: await setheader(),
      });
    return response.data;
  }