import { z } from "zod";
import { axiosInstance, setheader } from "@/lib/axios";
export const formSchema = z.object({
    name: z.string(),
    bedArray: z.array(z.string()),
    beds: z.number(),
    firstBed: z.number(),
    tagged: z.array(z.string()),
})
interface EditICU extends z.infer<typeof formSchema> {
    id:number;
}  
export const createICU = async (payload: z.infer<typeof formSchema>): Promise<string> => {
    try {
      const response = await axiosInstance.post(`/hospital/icu`, payload, {
        headers: await setheader(),
      });
  
      if (response.status !== 200) {
        throw new Error(`Failed to create user: ${response.statusText}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };
  
  export const editICU = async (payload: EditICU): Promise<string> => {
    try {
      const response = await axiosInstance.put(`/hospital/icu`, payload, {
        headers: await setheader(),
      });
  
      if (response.status !== 200) {
        throw new Error(`Failed to edit icu: ${response.statusText}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error editing icu:', error);
      throw error;
    }
  };
  
  export const deleteICU = async (payload: EditICU): Promise<string> => {
    try {
      const response = await axiosInstance.delete(`/hospital/icu`, {
        headers: await setheader(),
        data: payload,
      });
  
      if (response.status !== 200) {
        throw new Error(`Failed to delete icu: ${response.statusText}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };
  

