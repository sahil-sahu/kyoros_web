import { prisma } from '../prisma';
import { redisClient } from '../redis';
import { AuthRequest, Patientlog, FullLog } from '../types';

export const fireTokensFromICU = async(icuId:number):Promise<string[]>=>{
    const icus = await redisClient.get(`ICU:${icuId}`);
    if(!icus){
        const watchers = await prisma.watcher.findMany({
            where:{icuId},
            include:{
                user:{
                    select:{
                        fireTokens:true
                    }
                }
            }
        });
        // const users = await prisma.user.findMany({where:{id: {in:watchers.map(watcher => watcher.userid)}}})
        const fireTokens = watchers.flatMap(watcher => watcher.user.fireTokens);
        const savetoRedis = await redisClient.set(`ICU:${icuId}`, JSON.stringify(fireTokens));
        await redisClient.expire(`ICU:${icuId}`, 60*60*6);
        return fireTokens;

    }
    return JSON.parse(icus);
}

const callFromDB = async(log:Patientlog):Promise<[FullLog, number]> => {
    const res = await prisma.sensor.findUniqueOrThrow({
        where:{
            id:log.sensorid
        },
        include:{
            bed:{
                include:{
                    patient:{
                        select:{
                            id:true,
                            name:true
                        }
                    }
                }
            }
        }
    });
    if(res.bedID == null)
        throw "Sensor not connected to bed";
    const {bedID,bed:{icuId,patientId}} = res;
    // res.bed.ICU.
    await redisClient.set(`sensor:${log.sensorid}`, JSON.stringify({patientId,bedID,icuId}))
    await redisClient.expire(`sensor:${log.sensorid}`, 60*60*6);
    return [{
        ...log, patientId,bedID
    },icuId]

}



export const reformat = async (log:Patientlog):Promise<[FullLog, number]> => {
    const info = await redisClient.get(`sensor:${log.sensorid}`);
    if(info){
        const infoDict = JSON.parse(info.toString());
        const patientId = infoDict.patientId;
        const bedID = infoDict.bedID;
        const icuId = infoDict.icuId;
        if(patientId == null || bedID == null || icuId == null)
            return await callFromDB(log);
        return [{
            ...log, patientId,bedID
        },icuId]
    }
    return await callFromDB(log);
}