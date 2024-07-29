import { prisma } from "../prisma";
import { redisClient } from "../redis";
// import { Patientlog } from "../types";
import { User } from '@prisma/client';
export default async function user_from_redis(userId:string):Promise<User> {
    const user_r = await redisClient.get(`user:${userId}`);
    if(!user_r){
        const user = await prisma.user.findUniqueOrThrow({
            where:{
                id:userId,
                // verified:true,
            },
            // select:{
            //     name:true,
            //     id:true,
            //     firebaseUid:true,
            //     email:true,
            //     hospitalId:true,
            //     userType:true
            // },
        })
        await redisClient.set(`user:${userId}`,JSON.stringify(user));
        await redisClient.expire(`user:${userId}`, 60 * 60 * 6);
        return user;
    }
    return JSON.parse(user_r);
}
export async function fireuser_from_redis(userId:string):Promise<User> {
    const user_r = await redisClient.get(`fireuser:${userId}`);
    if(!user_r){
        const user = await prisma.user.findUniqueOrThrow({
            where:{
                firebaseUid:userId,
                verified:true,
            },
            // select:{
            //     name:true,
            //     id:true,
            //     firebaseUid:true,
            //     email:true,
            //     hospitalId:true,
            //     userType:true
            // },
        })
        await redisClient.set(`fireuser:${userId}`,JSON.stringify(user));
        await redisClient.expire(`fireuser:${userId}`, 60 * 60 * 6);
        return user;
    }
    return JSON.parse(user_r);
}