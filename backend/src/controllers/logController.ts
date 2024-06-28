import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../types';
import { Logs } from '@prisma/client';
import patient_from_redis from '../helpers/fetchPatientfromRedis';
export const getPatientLogs = async (req:AuthRequest,res:Response) =>{
    try {
        const patientId = req.params.patientid;
        const now = new Date();
        const dt = req.query?.old ?? new Date(now.getTime() - 30 * 60 * 1000);
        const freq = (req.query?.freq && parseInt(req.query?.freq+"" ?? "0") >= 1)? parseInt(req.query?.freq+"" ?? "0"): 1;

        const old = new Date(dt.toString())
        const patient = await patient_from_redis(patientId);

        let logs = (freq <= 60)?await prisma.$queryRawUnsafe<Logs[]>(`
            SELECT DISTINCT ON (date_trunc('hour', "timeStamp") + interval '${freq} minutes' * floor(extract(minute from "timeStamp")::numeric / ${freq})) *
            FROM "Logs"
            WHERE "patientId" = '${patient.id}' AND "timeStamp" > '${old.toISOString()}'
            ORDER BY (date_trunc('hour', "timeStamp") + interval '${freq} minutes' * floor(extract(minute from "timeStamp")::numeric / ${freq}))
                    `):(
                await prisma.$queryRawUnsafe<Logs[]>(`
                    SELECT DISTINCT ON (date_trunc('day', "timeStamp") + interval '${freq/60} hour' * floor(extract(hour from "timeStamp")::numeric / ${freq/60})) *
                    FROM "Logs"
                    WHERE "patientId" = '${patient.id}' AND "timeStamp" > '${old.toISOString()}'
                    ORDER BY (date_trunc('day', "timeStamp") + interval '${freq/60} hour' * floor(extract(hour from "timeStamp")::numeric / ${freq/60}))
                        `)
                            )

        // console.log(res2);
        res.status(200).json({ ...patient, logs });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch patient logs from db' });
    }
}
export const getPatientLastLog = async (req:AuthRequest,res:Response) =>{
    try {
        const patientId = req.params.patientid;
        const patient = prisma.patient.findUnique({
            where:{
                id:patientId
            },
        })
        const logs = prisma.logs.findFirst({
                where:{
                    patientId
                },
                orderBy:{
                    timeStamp: 'desc'
                }
        })
        const finalLogs = await Promise.all([patient,logs])
        res.status(200).json({...finalLogs[0],logs:[finalLogs[1]]});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch patient logs from db' });
    }
}