import { prisma } from '../prisma';
import { redisClient } from '../redis';
interface icusInfo{
    name:string;
    id:number;
}
export const watchersfromRedis = async (hospital: string): Promise<icusInfo[]> => {
    const icus = await redisClient.get(`watchers:${hospital}`);
    if (!icus) {
        const icus = await prisma.iCU.findMany({
            where:{
                hospitalId:hospital
            },
            select:{
                id:true,
                name:true
            }
        })
        await redisClient.set(`watchers:${hospital}`, JSON.stringify(icus));
        await redisClient.expire(`watchers:${hospital}`, 60 * 60 * 6);
        return icus;
    }
    return JSON.parse(icus);
}