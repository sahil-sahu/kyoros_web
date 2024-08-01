import { redisClient } from "../redis"
import { prisma } from "../prisma"

export const clearMapping = async (bedId:number) =>{
    const bed = await prisma.bed.findUniqueOrThrow({
        where:{id:bedId},
        select:{
            hospitalId:true,
            patientId:true,
            sensor:{
                select:{
                    id:true
                }
            }
        }
    })
    const res = await Promise.all([
        redisClient.del("hospitals:"+bed.hospitalId),
        redisClient.del("sensor:"+bed.sensor?.id),
        redisClient.del("patient:"+bed?.patientId),
    ])
}