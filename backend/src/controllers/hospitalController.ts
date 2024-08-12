import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../types';
import { watchersfromRedis } from '../helpers/watchersFromRedis';
import patient_from_redis from '../helpers/fetchPatientfromRedis';
import { redisClient } from '../redis';
import user_from_redis, { fireuser_from_redis } from '../helpers/userfromRedis';
import { generate_summary } from '../helpers/gemini';
import { usersNames } from '../helpers/usersNames';
import { avgApache, avgPatientStay, avgStaycurrentMonth, bedOccupancy, getOccupancyById, insightFetcher } from '../helpers/overviewMetrics';
import { apacheTrend, mortalityTrend, occuPancyTrend, serializer, stayTrend } from '../helpers/metricFetcherAndFormatter';

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
export const getbedsAll = async (req:AuthRequest,res:Response) =>{
    try {
        const beds = await prisma.bed.findMany({
            where:{
                hospitalId:req.hospital
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
                    reason: null,
                },
                include:{
                    patient:{
                        select:{
                            id:true,
                            uhid:true,
                            name:true
                        }
                    }
                }

            })
            const session = sessions.find(s => s.bedId[s.bedId.length -1] == e.id)
            return {...e, patient: session.patient, sessionId : session?.id ?? null, icuId: session?.icuId[session.icuId.length -1] ?? null, icuName: session?.icuName ?? null}
        }))

        return res.status(200).json(beds_session.filter(e => e.sessionId != null))
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
                        // where:{
                        //     occupied:true
                        // },
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

export const getOverviewforUser = async (req:AuthRequest,res:Response) =>{
    try {
        const user = await fireuser_from_redis(req.user);
        const hospital = req.hospital;

        const sessions = await prisma.session.findMany({
            where:{
                reason:null,
                OR:[
                    {
                        doctorIds:{
                            has: user.id
                        }
                    },
                    {
                        nurseIds:{
                            has: user.id
                        }
                    }
                ]
            }
        })

        let completeSessions = await Promise.all(
            sessions.map(async s => {
                const patient = await patient_from_redis(s.patientId);
                const summary = await generate_summary(s.patientId)
                const doctors = await usersNames(s.doctorIds)
                return {...s, patient, doctors, summary}
            })
        )

        res.status(200).json(completeSessions);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch glance of icus from db' });
    }
}
export const getOccupancy = async (req:AuthRequest,res:Response) =>{
    try {
        const hospitalId = req.hospital;

        const data = await prisma.iCU.findMany({
            where:{
                hospitalId
            },
        })

        let icus = await Promise.all(
            data.map(async icu => {
                const total = await prisma.bed.count({where:{ICU:icu}})
                const filled = await prisma.bed.count({where:{ICU:icu, occupied:true}})
                return {name:icu.name, total, filled, id:icu.id}
            })
        )

        res.status(200).json(icus);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch glance of icus from db' });
    }
}
export const adminInsights = async (req:AuthRequest|Request,res:Response) =>{
    try {
        // const hospitalId = req.hospital;
        const {icuId} = req.query;
        let icu = +icuId;
        if(typeof(icu) != 'number' || (typeof(icu) == 'number' && isNaN(icu))) throw Error("Invalid ICU Id");
        if(icu == -1) throw("Error allicu not supported yet")

        const [insight, occupancy, avgStay] = await Promise.all([insightFetcher(icu), getOccupancyById(icu), avgStaycurrentMonth(icu)])
        return res.status(200).json({insight, occupancy, avgStay})

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch admin metrics' });
    }
}
const freqArr = ["6h", "1D", "7D", "1M"]
export const adminTrends = async (req:Request,res:Response) =>{
    try {
        // ?old=2024-08-11T18:30:00.000Z&freq=6h&icuId=-1&metric=occupancy
        const { old, freq, icuId, metric } = req.query;
        let icu = +icuId;
        if(!icu || typeof(icu) != 'number') throw Error("Invalid ICU Id");
        if(!old || typeof(old) != 'string') throw Error("Invalid Date string");
        if(!metric || (typeof(metric) != 'string')) throw Error("Invalid Metric");
        if(!freq || (typeof(freq) != 'string')  || (typeof(freq) == 'string')  && !freqArr.includes(freq)) throw Error("Invalid freq");

        const start = new Date(old);
        switch(metric){
            case "mortality":
                const mortality = await mortalityTrend(icu,start,freq)
                const serialized_M = serializer(mortality)
                return res.status(200).json(serialized_M);
            case "occupancy":
                const occupancy = await occuPancyTrend(icu,start,freq)
                const serialized_O = serializer(occupancy)
                return res.status(200).json(serialized_O);
            case "avgStay":
                const avgStay = await stayTrend(icu,start,freq)
                const serialized_Stay = serializer(avgStay)
                return res.status(200).json(serialized_Stay);
            case "avgApache":
                const avgApache = await apacheTrend(icu,start,freq)
                const serialized_Apache = serializer(avgApache)
                return res.status(200).json(serialized_Apache);
            default: throw Error("Invalid Metric")
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch admin Trends' });
    }
}

