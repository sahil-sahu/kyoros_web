import { prisma } from '../prisma';
import { redisClient } from '../redis';
interface icusInfo{
    name:string;
    id:number;
}
export const watchersfromRedis = async (firebaseUid: string): Promise<icusInfo[]> => {
    const icus = await redisClient.get(`watchers:${firebaseUid}`);
    if (!icus) {
        const user = await prisma.user.findUnique({
            where:{
                firebaseUid
            },
            select:{
                watcher:{
                    include:{
                        icu:{
                            select:{
                                id:true,
                                name:true,
                            }
                        }
                    }
                }
            }
        });
        const icus = user.watcher.map(e => {
            return {
                id: e.icu.id,
                name: e.icu.name
            }
        })

        await redisClient.set(`watchers:${firebaseUid}`, JSON.stringify(icus));
        await redisClient.expire(`watchers:${firebaseUid}`, 60 * 60 * 6);
        return icus;
    }
    return JSON.parse(icus);
}