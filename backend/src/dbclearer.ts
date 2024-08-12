import { prisma } from "./prisma"

const getall = async () =>{
    const now = new Date();
    const old = new Date(now.getTime() - 5*24*60* 60 * 1000);
    // console.log("yo")
    const res = await prisma.logs.deleteMany({
        where:{
            timeStamp:{
                lte: old
            }
        }
    })
    // const res = await prisma.logs.findMany({
    //     where:{
    //         timeStamp:{
    //             lte: old
    //         }
    //     }
    // })
    console.log(res);
}
// getall();
interface period {
    period: string;
    avg_days: number|null;
}
export const avgPatientStay = async (icuId:number) => {
    const dt = new Date();
    dt.setMonth(dt.getMonth()+1)
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
    const delta = ((stay_current[0].avg_days ?? 0) - (stay_current[1].avg_days ?? 0))
    return Math.trunc(isNaN(delta)? 0 : delta );
}

avgPatientStay(2).then(e => console.log(e))