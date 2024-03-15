import { redisClient } from "../redis";
import { Patientlog } from "../types";

export default async function patient_from_redis(patientId:string):Promise<Patientlog[]> {
    const queueKey = `patient:${patientId}:queue`;
    const queueData = await redisClient.lRange(queueKey, 0, -1);
    const queue:Patientlog[] = queueData.map(item => JSON.parse(item));
    return queue;
}