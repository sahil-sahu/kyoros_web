import { z } from "zod";
import { User } from "./getusers";
import { axiosInstance, setheader } from "@/lib/axios";
export const UserType =[
    "admin",
    "nurse",
    "doctor",
    "lab",
] as const;

export const medicalDepartments = [
    "Cardiac Sciences",
    "Gastro Sciences",
    "Nephrology",
    "Neurosciences",
    "Orthopaedics",
    "Paediatrics",
    "Pulmonology",
    "Transplants",
    "Urology",
    "Anaesthesiology",
    "Cardiac Surgery",
    "Cardiology",
    "Critical Care Medicine",
    "Dermatology",
    "Emergency Medicine",
    "Endocrinology",
    "ENT",
    "Gastroenterology - Surgical",
    "Gastroenterology Medical",
    "General Medicine/Internal Medicine",
    "General Surgery",
    "Lab Medicine",
    "Laparoscopic and Bariatric Surgery",
    "Liver Transplantation and Hepatobiliary Surgery",
    "Nephrology",
    "Neurology",
    "Neurosurgery",
    "Ophthalmology",
    "Orthopaedics",
    "Paediatric Cardiac Surgery",
    "Paediatric Cardiology",
    "Paediatrics",
    "Pulmonology",
    "Radiology",
    "Renal Transplant"
  ] as const;  
export const formSchema = z.object({
    name: z.string(),
    email: z.string(),
    userType: z.enum(UserType),
    department: z.enum(medicalDepartments),
    tagged: z.array(z.number()),
})
interface EditUser extends z.infer<typeof formSchema> {
    id:string;
}  
export const createUser = async (payload: z.infer<typeof formSchema>): Promise<string> => {
    try {
      const response = await axiosInstance.post(`/hospital/user`, payload, {
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
  
  export const editUser = async (payload: EditUser): Promise<string> => {
    try {
      const response = await axiosInstance.put(`/hospital/user`, payload, {
        headers: await setheader(),
      });
  
      if (response.status !== 200) {
        throw new Error(`Failed to edit user: ${response.statusText}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error editing user:', error);
      throw error;
    }
  };
  
  export const deleteUser = async (payload: EditUser): Promise<string> => {
    try {
      const response = await axiosInstance.delete(`/hospital/user`, {
        headers: await setheader(),
        data: payload,
      });
  
      if (response.status !== 200) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };
  

