import { Socket } from "socket.io";
import { Patientlog } from "../types";
import { redisClient } from "../redis";
import PatientRealtimeModel from "../models/patientRealtime";
import patient_from_redis from "../helpers/fetchPatientfromRedis";

export const handlePatientEvent = async (patientId:string, socket:Socket, data:Patientlog) => {
    const queueKey = `patient:${patientId}:queue`;

    await redisClient.lPush(queueKey, JSON.stringify(data));
    await redisClient.lTrim(queueKey, 0, 49);
    checknUpdatetoDB(patientId);
}

function isOlderThan(isoString: string, minutes: number): boolean {
    const threshold = new Date(Date.now() - minutes * 60 * 1000); // Convert minutes to milliseconds
    const date = new Date(isoString);
    return date < threshold;
  }


const checknUpdatetoDB = async (patientId:string) => {
    const key = `patientUpdate:${patientId}`;

    try {
        const timestamp = await redisClient.hGet(key, 'timestamp');
        if(isOlderThan(timestamp, 2)){
            console.log("gone to db");
            const queue = await patient_from_redis(patientId);
            const record = new PatientRealtimeModel({
                patientId,
                log: queue.map(item => ({
                  bpm: item.bpm,
                  bloodPressure: item.bp,
                  timestamp: new Date(item.timestamp)
                }))
              });
            await record.save();
            await redisClient.hSet(key, {'timestamp': new Date().toISOString()});
        }
    } catch (err) {
        console.error(err);
    }
}