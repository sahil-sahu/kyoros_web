import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../types';
import { watchersfromRedis } from '../helpers/watchersFromRedis';
import patient_from_redis from '../helpers/fetchPatientfromRedis';
import { redisClient } from '../redis';

export const getHospitals = async(req:Request,res:Response) =>{
    try {
        const hospitals = await prisma.hospital.findMany({select:{
            id:true,
            name:true
        }});
        res.status(200).json(hospitals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch hospitals from db' });
    }
}

export const getUsers = async(req:AuthRequest,res:Response) =>{
    try {
        const users = await prisma.user.findMany({
            where:{
                hospitalId: req.hospital,
                verified:true
            },
            select:{
                id:true,
                name:true,
                userType:true,
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users from db' });
    }
}

export const getbeds = async (req:AuthRequest,res:Response) =>{
    try {
        const icu = req.query?.icu ?? "-1";
        if(typeof(icu) != 'string') throw Error("Invalid type");
        const beds = await prisma.bed.findMany({
            where:{
                icuId:parseInt(icu)
            },
            orderBy:{
                name:"asc"
            },
            select:{
                name:true,
                id:true,
                occupied:true,
                patientId:true,
            }
        })
        const beds_session = await Promise.all(beds.map(async e =>{
            const sessions = await prisma.session.findMany({
                where:{
                    bedId:{
                        has: e.id
                    },
                    reason: null
                }
            })
            const session = sessions.find(s => s.bedId[s.bedId.length -1] == e.id)
            return {...e,sessionId : session?.id ?? null}
        }))
        return res.status(200).json(beds_session)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch beds from db' });
    }
}

export const getICUs = async (req:AuthRequest,res:Response) =>{
    try {
        const hospital = req.hospital;
        const hosp = await redisClient.get(`hospitals:${hospital}`);
        if(!hosp){
            const icus = await prisma.iCU.findMany({
                where:{hospitalId:hospital},
                include:{
                    beds:{
                        where:{
                            occupied:true
                        },
                        orderBy:{
                            name:'asc',
                        },
                        select:{
                            name:true,
                            id:true,
                            patientId:true,
                        },
                    }
                }
            });
            await redisClient.set(`hospitals:${hospital}`, JSON.stringify(icus));
            await redisClient.expire(`hospitals:${hospital}`, 60 * 60 * 6);
            return res.status(200).json(icus);
        }
        res.status(200).json(JSON.parse(hosp));

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch icus from db' });
    }
}
export const getICUs_w_unoccupied = async (req:AuthRequest,res:Response) =>{
    try {
        const hospital = req.hospital;
        const icus = await prisma.iCU.findMany({
            where:{hospitalId:hospital},
            include:{
                beds:{
                    where:{
                        occupied:false
                    },
                    orderBy:{
                        name:'asc',
                    },
                    select:{
                        name:true,
                        id:true,
                    },
                }
            }
        })
        return res.status(200).json(icus);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch icus from db' });
    }
}

export const getGlance = async (req:AuthRequest,res:Response) =>{
    try {
        // const user = req.user;
        const hospital = req.hospital;
        let icus = await watchersfromRedis(hospital);
        const beds = await prisma.bed.findMany(
            {
                where:{
                    occupied:true,
                    icuId: {
                        in:icus.map(icu => icu.id)
                    }
                },
                orderBy:{
                    name:'asc'
                },
                select:{
                    name:true,
                    id:true,
                    patientId:true,
                    bedStamp:true,
                    apache:true,
                    icuId:true,
                    latest:true,
                }
            }
        )
        let icusres = await Promise.all(icus.map(async e =>{
            return {
                icu:{
                    ...e,
                    beds: await Promise.all(beds.map(async bed => { return {...bed, patient: await patient_from_redis(bed.patientId)} }))
                }
            }
        }))

        // const bedArr = icus.watcher.flatMap(watcher => watcher.icu.beds)

        // res.status(200).json({beds:bedArr, icus: icus.watcher.map(e => e.icuId)});
        // const bedArr = icus.watcher.flatMap((watcher: { icu: { beds: any; }; }) => watcher.icu.beds);

        res.status(200).json(icusres);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch glance of icus from db' });
    }
}