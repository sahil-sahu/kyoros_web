import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest, Patientlog } from '../types';
import checknSendNotification from '../socket/notificationPlugin';
import { reformat } from '../helpers/formatwRedis';
import { io } from './app';




export const addLog = async(req:AuthRequest,res:Response) => {
    try {
        const body:Patientlog = req.body;
        const [log,icuId] = await reformat(body);
        const dblog = prisma.logs.create({
            data: log
        })
        const notified = checknSendNotification(log, icuId);
        const [log_res, _] = await Promise.all([dblog, notified]);
        io.to(`patient/${log.patientId}`).emit('patient-event', log);
        // return res.json({log_res:true});
        return res.json(log_res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}