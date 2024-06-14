import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../types';

export const getPatientLogs = async (req:AuthRequest,res:Response) =>{
    try {
        const patientId = req.params.patientid;
        const now = new Date();
        const dt = req.query?.old ?? new Date(now.getTime() - 30 * 60 * 1000);
        const old = new Date(dt.toString())
        const patientLogs = await prisma.patient.findUnique({
            where:{
                id:patientId
            },
            include:{
                logs:{
                    where:{
                        timeStamp: {
                            gte: old
                        }
                    },
                    orderBy:{
                        timeStamp: 'asc'
                    }
                }
            }
        })
        res.status(200).json(patientLogs);

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