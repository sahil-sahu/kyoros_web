import { prisma } from "../prisma";
import { redisClient } from "../redis";
// import { Patientlog } from "../types";
import { Patient } from '@prisma/client';
export default async function patient_from_redis(patientId:string):Promise<Patient> {
    const patient = await redisClient.get(`patient:${patientId}`);
    if(!patient){
        const patient = await prisma.patient.findUniqueOrThrow({
            where:{
                id:patientId
            },
        })
        await redisClient.set(`patient:${patientId}`,JSON.stringify(patient));
        await redisClient.expire(`patient:${patientId}`, 60 * 60 * 6);
        return patient;
    }
    return JSON.parse(patient);
}