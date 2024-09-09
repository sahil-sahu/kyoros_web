import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest, Patientlog } from '../types';
import checknSendNotification from '../socket/notificationPlugin';
import { reformat } from '../helpers/formatwRedis';
import { io } from './app';




export const addLog = async(req:AuthRequest,res:Response) => {
    try {
        const body:Patientlog = req.body;
        body.sensorid = req.user;
        const [log,notificationInfo] = await reformat(body);
        const dblog = prisma.logs.create({
            data: {
                ...log,
                bp: log.bp || [0,0]
            }
        })
        const notified = checknSendNotification(log, notificationInfo);
        const latest = prisma.bed.update({
            where:{
                id:log.bedID
            },
            data:{
                latest:{...log}
            }
        })
        
        const [log_res, _] = await Promise.all([dblog, notified, latest]);
        io.to(`patient/${log.patientId}`).emit('patient-event', {data:log_res, room: `patient/${log.patientId}`});
        io.to(`icu/${notificationInfo.icuId}`).emit('patient-event', {data:log_res, room:`icu/${notificationInfo.icuId}`});
        res.json(log_res);

        // return res.json({log_res:true});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}