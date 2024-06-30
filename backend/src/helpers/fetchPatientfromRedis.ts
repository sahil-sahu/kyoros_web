import { prisma } from "../prisma";
import { redisClient } from "../redis";
// import { Patientlog } from "../types";
import { Patient } from '@prisma/client';
interface _Patient extends Patient {
    apache?:number;
}
export default async function patient_from_redis(patientId:string):Promise<_Patient> {
    const patient = await redisClient.get(`patient:${patientId}`);
    if(!patient){
        const patient = await prisma.patient.findUniqueOrThrow({
            where:{
                id:patientId
            },
            include:{
                bed:{
                    select:{
                        apache:true,
                        id:true
                    }
                }
            }
        })
        await redisClient.set(`patient:${patientId}`,JSON.stringify({...patient, apache: patient.bed.apache, bedId: patient.bed.id}));
        await redisClient.expire(`patient:${patientId}`, 60 * 60 * 6);
        return {...patient, apache: patient.bed.apache};
    }
    return JSON.parse(patient);
}