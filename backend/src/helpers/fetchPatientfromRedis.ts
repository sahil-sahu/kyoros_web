import { prisma } from "../prisma";
import { redisClient } from "../redis";
// import { Patientlog } from "../types";
import { Patient } from '@prisma/client';
interface _Patient extends Patient {
    apache?:number;
    bedStamp?: string|Date;
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
                        id:true,
                        bedStamp:true
                    }
                }
            }
        })
        await redisClient.set(`patient:${patientId}`,JSON.stringify({...patient, apache: patient.bed?.apache ?? 0, bedId: patient.bed?.id, bedStamp: patient.bed.bedStamp}));
        await redisClient.expire(`patient:${patientId}`, 60 * 60 * 6);
        return {...patient, bedId: patient.bed?.id, apache: patient.bed?.apache ?? 0, bedStamp: patient.bed.bedStamp};
    }
    return JSON.parse(patient);
}