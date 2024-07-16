import { axiosInstance, setheader } from '@/lib/axios';
import { PatientDoc } from '@/types/patientDoc';
import { sensor } from '@/types/sensor';
import { z } from "zod"
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const formSchema = z.object({
    patientId:z.string(),
    tag: z.string(),
    name: z.string(),
    file: z
            .any().refine(
                (file: File) => file instanceof File,
                'Please select a file'
            )
            .refine((file: File) => {
                if(!(file instanceof File)) return 'No file selected';

                return file.size <= MAX_FILE_SIZE
            }, {
            message: 'File must be less than 10MB',
            }),
})

export const UploadDoc = async (formData: z.infer<typeof formSchema>):Promise<PatientDoc> => {
    try {
      const form = new FormData();
      const response = await axiosInstance.post('/patient/docupload', formData, {
        headers: {...(await setheader()), 'Content-Type': 'multipart/form-data',},
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };