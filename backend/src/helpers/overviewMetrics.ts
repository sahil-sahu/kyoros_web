import { redisClient } from "../redis";
import { prisma } from "../prisma";
interface insight_t{
    bedOccupancy: number,
    avgApache: number,
    avgPatientStay: number,
    mortality: number,
}
export const insightFetcher = async (icuId:number):Promise<insight_t> =>{
    const insight = await redisClient.get(`insight:${icuId}`);
    if(!insight){
        const insight_Q = await Promise.all([
            bedOccupancy(icuId),
            avgApache(icuId),
            avgPatientStay(icuId),
            getMortality(icuId)
        ]);
        const insight = {
            bedOccupancy: insight_Q[0],
            avgApache: insight_Q[1],
            avgPatientStay: insight_Q[2],
            mortality: insight_Q[3],
        }
        // console.log(insight)
        await redisClient.set(`insight:${icuId}`, JSON.stringify(insight));
        await redisClient.expire(`insight:${icuId}`, 60 * 60 * 24 * 7);
        return insight
    }
    return JSON.parse(insight);
}

export const bedOccupancy = async (icuId:number) => {
    icuId = icuId == -1? undefined: icuId
    const dt = new Date();
    dt.setMonth(dt.getMonth()+1)
    dt.setDate(0)
    dt.setHours(0,0,0,0)
    const lastMonth = new Date(dt.getTime()- 1000*60*60*24*30)
    const s2nd_lastMonth = new Date(lastMonth.getTime()- 1000*60*60*24*30)
    const occupancy_current = await prisma.session.count({
        where:{
            icuId:{
                has: icuId
            },
            admittedAt:{
                gte: lastMonth,
                lte: dt
            }
        }
    })
    const occupancy_old = await prisma.session.count({
        where:{
            icuId:{
                has: icuId
            },
            admittedAt:{
                gte: s2nd_lastMonth,
                lte: lastMonth,
            }
        }
    })
    const delta = (occupancy_current - occupancy_old)*100/occupancy_old;
    return Math.trunc(isNaN(delta)? 0 : delta );
}
export const avgApache = async (icuId:number) => {
    const dt = new Date();
    dt.setMonth(dt.getMonth()+1)
    dt.setDate(0)
    dt.setHours(0,0,0,0)
    const lastMonth = new Date(dt.getTime()- 1000*60*60*24*30)
    const s2nd_lastMonth = new Date(lastMonth.getTime()- 1000*60*60*24*30)
    const apache_current = prisma.session.aggregate({
        where:{
            icuId:{
                has: icuId
            },
            admittedAt:{
                gte: lastMonth,
                lte: dt
            }
        },
        _avg:{
            apache:true,
        }
    })
    const apache_old = prisma.session.aggregate({
        where:{
            icuId:{
                has: icuId
            },
            admittedAt:{
                gte: s2nd_lastMonth,
                lte: lastMonth,
            }
        },
        _avg:{
            apache:true,
        }
    })
    const vals = await Promise.all([apache_current, apache_old])
    const delta = ((vals[0]._avg.apache ?? 0)- (vals[1]._avg.apache ?? 0))*100/(vals[1]._avg.apache ?? 0);
    return Math.trunc(isNaN(delta)? 0 : delta );
}
interface period {
    period: string;
    avg_days: number|null;
}
export const avgPatientStay = async (icuId:number) => {
    const dt = new Date();
    dt.setMonth(dt.getMonth()+1)
    dt.setDate(0)
    dt.setHours(0,0,0,0)
    const lastMonth = new Date(dt.getTime() - 1000 * 60 * 60 * 24 * 30);
    const s2nd_lastMonth = new Date((new Date(lastMonth).getTime()) - 1000 * 60 * 60 * 24 * 30);


    const stay_current:[period,period] = await prisma.$queryRaw`
        WITH sessions_current AS (
            SELECT
                "admittedAt",
                "dischargedAt",
                TRUNC(EXTRACT(EPOCH FROM (COALESCE("dischargedAt", NOW()) - "admittedAt")) / 86400) AS days
            FROM
                "Session"
            WHERE
                "admittedAt" > ${lastMonth} AND ${icuId} = ANY("icuId")
        ),
        sessions_old AS (
            SELECT
                "admittedAt",
                "dischargedAt",
                TRUNC(EXTRACT(EPOCH FROM (COALESCE("dischargedAt", NOW()) - "admittedAt")) / 86400) AS days
            FROM
                "Session"
            WHERE
                "admittedAt" > ${s2nd_lastMonth}
                AND "admittedAt" < ${lastMonth}
                AND ${icuId} = ANY("icuId")
        )
        SELECT
            'current' AS period,
            AVG(days) AS avg_days
        FROM
            sessions_current
        UNION ALL
        SELECT
            'old' AS period,
            AVG(days) AS avg_days
        FROM
            sessions_old;
    `;
    // console.log(stay_current[0].avg_days, stay_current[1].avg_days)
    const delta = ((stay_current[0].avg_days ?? 0) - (stay_current[1].avg_days ?? 0))*100/(stay_current[1].avg_days ?? 0)
    // console.log(Math.trunc(isNaN(delta)? 0 : delta ))
    return Math.trunc(isNaN(delta)? 0 : delta );
}

export const getOccupancyById = async (icuId:number) =>{
    const data = await prisma.iCU.findFirstOrThrow({
        where:{
            id:icuId
        },
    })

    const total = await prisma.bed.count({where:{ICU:data}})
    const filled = await prisma.bed.count({where:{ICU:data, occupied:true}})
    return {name:data.name, total, filled, id:data.id}
}
export const avgStaycurrentMonth = async (icuId:number) =>{
    const dt = new Date();
    dt.setMonth(dt.getMonth()+1)
    dt.setDate(0)
    dt.setHours(0,0,0,0)
    const lastMonth = new Date(dt.getTime() - 1000 * 60 * 60 * 24 * 30);

    const stay_current:[period] = await prisma.$queryRaw`
        WITH sessions_current AS (
            SELECT
                "admittedAt",
                "dischargedAt",
                TRUNC(EXTRACT(EPOCH FROM (COALESCE("dischargedAt", NOW()) - "admittedAt")) / 86400) AS days
            FROM
                "Session"
            WHERE
                "admittedAt" > ${lastMonth} AND ${icuId} = ANY("icuId")
        )
        SELECT
            'current' AS period,
            AVG(days) AS avg_days
        FROM
            sessions_current
    `;
    return stay_current[0].avg_days.toFixed(1);
}
export const getMortality = async (icuId:number) =>{
    const dt = new Date();
    dt.setDate(0)
    dt.setHours(0,0,0,0)
    const lastMonth = new Date(dt.getTime() - 1000 * 60 * 60 * 24 * 30);
    const current = await prisma.session.count({
        where:{
            reason: "Patient Deceased",
            dischargedAt:{
                gte: dt,
            },
            icuId:{
                has:icuId
            }
        }
    })
    const prev = await prisma.session.count({
        where:{
            reason: "Patient Deceased",
            dischargedAt:{
                gte: lastMonth,
                lte: dt
            },
            icuId:{
                has:icuId
            }
        }
    })

    const vals = await Promise.all([current, prev])
    const delta = ((vals[0] ?? 0)- (vals[1] ?? 0))*100/(vals[1] ?? 0);
    return Math.trunc(isNaN(delta)? 0 : delta );
}