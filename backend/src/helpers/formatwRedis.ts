import { prisma } from '../prisma';
import { redisClient } from '../redis';
import { AuthRequest, Patientlog, FullLog, NotificationLoad } from '../types';

export const fireTokensFromICU = async (icuId: number): Promise<string[]> => {
    const icus = await redisClient.get(`ICU:${icuId}`);
    if (!icus) {
        const watchers = await prisma.watcher.findMany({
            where: { icuId },
            include: {
                user: {
                    select: {
                        fireTokens: true
                    }
                }
            }
        });

        const fireTokens = watchers.flatMap((watcher: { user: { fireTokens: string[] } }) => watcher.user.fireTokens);
        await redisClient.set(`ICU:${icuId}`, JSON.stringify(fireTokens));
        await redisClient.expire(`ICU:${icuId}`, 60 * 60 * 6);
        return fireTokens;
    }
    return JSON.parse(icus);
}

const callFromDB = async (log: Patientlog): Promise<[FullLog, NotificationLoad]> => {
    const res = await prisma.sensor.findUniqueOrThrow({
        where: {
            id: log.sensorid
        },
        include: {
            bed: {
                include: {
                    patient: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    ICU: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        }
    });
    if (res.bedID == null)
        throw "Sensor not connected to bed";
    const { bedID, bed: { icuId, patientId, name: bedName, ICU: { name: icuName } } } = res;

    await redisClient.set(`sensor:${log.sensorid}`, JSON.stringify({ patientId, bedID, icuId, bedName, icuName }));
    await redisClient.expire(`sensor:${log.sensorid}`, 60 * 60 * 6);
    return [{
        ...log, patientId, bedID
    }, { patientId, bedID, icuId, bedName, icuName }];
}

export const reformat = async (log: Patientlog): Promise<[FullLog, NotificationLoad]> => {
    const info = await redisClient.get(`sensor:${log.sensorid}`);
    if (info) {
        const infoDict = JSON.parse(info.toString());
        const patientId = infoDict.patientId;
        const bedID = infoDict.bedID;
        const icuId = infoDict.icuId;
        if (patientId == null || bedID == null || icuId == null)
            return await callFromDB(log);
        return [{
            ...log, patientId, bedID
        }, infoDict];
    }
    return await callFromDB(log);
}
