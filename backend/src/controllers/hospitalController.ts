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
import { deleteFireUser, newUser } from '../helpers/handleFireUser';
import { watcherMatching, watcherMatchingviaICU } from '../helpers/watcherMatching';
import { fireAuth } from '../firebase';

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
                icuId:parseInt(icu),
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
                    hospitalId:req.hospital,
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
                    hospitalId:req.hospital
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
                    hospitalId:req.hospital,
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
                hospitalId:req.hospital,
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
                // const summary = await generate_summary(s.patientId)
                const summary = "No summary Available"
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

export const getUserMapping  = async (req:AuthRequest, res: Response) =>{
    try{
        const users = await prisma.user.findMany({
            where:{
                hospitalId:req.hospital
            },
            select:{
                id:true,
                name:true,
                email:true,
                userType:true,
                department:true,
                watcher:{
                    select:{
                        id:true,
                        icu:{
                            select:{
                                name:true,
                                id:true
                            }
                        }
                    }
                }
            },
            orderBy:{
                name: "asc"
            }
        })
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch User for Mapping' });
    }
}
interface UserPayload{
    name: string,
    email: string,
    userType: any,
    department: string,
    tagged: number[],
}
export const addUser  = async (req:AuthRequest, res: Response) =>{
    try{   
        const {name, email, userType, department, tagged} = req.body as UserPayload;
        if(!name || !email || !userType) throw new Error("Invalid payload for user object");
        const fireUserId = await newUser(email, name)
        const user = await prisma.user.create({
            data:{
                name,
                email,
                userType: userType,
                department,
                verified:true,
                hospitalId:req.hospital,
                firebaseUid: fireUserId
            }
        })
        await fireAuth.setCustomUserClaims(fireUserId, {userType,hospitalId: req.hospital});
        await watcherMatching(user.id, tagged);
        return res.status(200).json({message: `User ${user.id} added successfully`});

    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Failed to Add user Error:${error}` });
    }
}
interface EditUser extends UserPayload {
    id: string;
}
export const editUser  = async (req:AuthRequest, res: Response) =>{
    try{   
        const {name, userType, department, tagged, id} = req.body as EditUser;
        if(!id) throw new Error("Invalid payload for user object");
        const user = await prisma.user.update({
            where:{
                id
            },
            data:{
                name,
                userType: userType,
                department,
            }
        })
        await fireAuth.setCustomUserClaims(user.firebaseUid, {userType,hospitalId: req.hospital});
        await watcherMatching(user.id, tagged);
        return res.status(200).json({message: `User ${user.id} updated successfully`});

    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Failed to Add user Error:${error}` });
    }
}
export const deleteUser  = async (req:AuthRequest, res: Response) =>{
    try{   
        const {id} = req.body as EditUser;
        if(!id) throw new Error("Invalid payload for user object");
        const user = await prisma.user.delete({
            where:{
                id
            }
        })
        await deleteFireUser(user.firebaseUid)
        return res.status(200).json({message: `User ${user.id} deleted successfully`});

    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Failed to Add user Error:${error}` });
    }
}

interface ICUPayload{
    name: string,
    bedArray: string[],
    tagged: string[],
}
export const addICU  = async (req:AuthRequest, res: Response) =>{
    try{   
        const {name, bedArray, tagged} = req.body as ICUPayload;
        if(!name) throw new Error("Invalid payload for ICU object");
        const icu = await prisma.iCU.create({
            data:{
                name,
                hospitalId:req.hospital,
            }
        })
        const beds = await prisma.bed.createMany({
            data:bedArray.map((bedId:string) => ({icuId: icu.id, name:bedId, hospitalId:req.hospital, }))
        })
        await watcherMatchingviaICU(icu.id, tagged)
        return res.status(200).json({message: `ICU ${icu.id} added successfully`});

    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Failed to Add user Error:${error}` });
    }
}

interface EditICU extends ICUPayload {
    id: number;
}

export const editICU  = async (req:AuthRequest, res: Response) =>{
    try{   
        const {name, tagged, id} = req.body as EditICU;
        if(!id) throw new Error("Invalid payload for user object");
        const icu = await prisma.iCU.update({
            where:{
                id
            },
            data:{
                name,
            },
        })
        await watcherMatchingviaICU(icu.id, tagged)
        return res.status(200).json({message: `ICU ${icu.id} updated successfully`});

    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Failed to Add user Error:${error}` });
    }
}

export const deleteICU  = async (req:AuthRequest, res: Response) =>{
    try{   
        const {id} = req.body as EditICU;
        if(!id) throw new Error("Invalid payload for icu object");
        const icu = await prisma.iCU.delete({
            where:{
                id
            }
        })
        return res.status(200).json({message: `ICU ${icu.id} deleted successfully`});

    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Failed to Add user Error:${error}` });
    }
}

export const getICUsDetailed = async (req:AuthRequest,res:Response) =>{
    try {
        const hospitalId = req.hospital;

        const data = await prisma.iCU.findMany({
            where:{
                hospitalId
            },
            include:{
                watcher:{
                    select:{
                        id: true,
                        userid:true
                    }
                }
            }
        })

        let icus = await Promise.all(
            data.map(async icu => {
                const total = await prisma.bed.count({where:{icuId:icu.id}})
                const filled = 0
                return {name:icu.name, total, filled, id:icu.id, users:icu.watcher.map(e => e.userid)}
            })
        )

        res.status(200).json(icus);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch glance of icus from db' });
    }
}

