import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { Patientlog } from '../types';
import checknSendNotification from '../socket/notificationPlugin';
export const addLog = async(req:Request,res:Response) => {
    try {
        const body:Patientlog = req.body;
        const log = prisma.logs.create({
            data:{
                bpm: body.bpm,
                bp: body.bp,
                spo2: body.spo2,
                temp: body.temp,
                patientId: body.patientId,
                timeStamp: new Date(body.timestamp),
                bedID: body.bedID
            }
        })
        const notified = checknSendNotification(body.patientId, body);
        const [log_res, _] = await Promise.all([log, notified]);
        return res.json(log_res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}