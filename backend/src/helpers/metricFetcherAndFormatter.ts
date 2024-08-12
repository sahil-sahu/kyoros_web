import { prisma } from "../prisma";

interface graph {
    x: string;
    y: number;
}
function getTimeFromISOString(isoString: string): string {
    const date = new Date(isoString);
  
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${month} ${day} ${hours}:${minutes}`;
  }
export const serializer = (data:graph[]) =>{
    const xArr:string[] = []
    const yArr:number[] = []
    data.forEach(d=>{
        xArr.push(getTimeFromISOString(d.x))
        yArr.push(d.y)
    })
    return {x: xArr, y: yArr}
}

export const occuPancyTrend = async (icuId:number, old:Date, freq:string):Promise<graph[]> => {
    if(icuId == -1){
        switch(freq){
            case "1D":
                return await prisma.$queryRaw`select CAST(count(*) as int) as "y",  (date_trunc('month', "admittedAt") + interval '1 day' * floor(extract(day from "admittedAt")::numeric / 1)) as x  from "Session"
                where "admittedAt" > ${old}
                group by "x"
                order by "x";`
            case "7D":
                return await prisma.$queryRaw`select CAST(count(*) as int) as "y", (date_trunc('month', "admittedAt") + interval '7 day' * floor(extract(day from "admittedAt")::numeric / 7)) as x  from "Session"
                where "admittedAt" > ${old}
                group by "x"
                order by "x";`
            case "1M":
                return await prisma.$queryRaw`select CAST(count(*) as int) as "y",  (date_trunc('month', "admittedAt")) as "x"  from "Session"
                where "admittedAt" > ${old}
                group by "x"
                order by "x";`
            default:
                return await prisma.$queryRaw`select CAST(count(*) as int) as "y",  (date_trunc('day', "admittedAt") + interval '6 hour' * floor(extract(hour from "admittedAt")::numeric / 6)) as "x"  from "Session"
                where "admittedAt" > ${old}
                group by "x"
                order by "x";`
        
        }

    }
    switch(freq){
        case "1D":
            return await prisma.$queryRaw`select CAST(count(*) as int) as "y",  (date_trunc('month', "admittedAt") + interval '1 day' * floor(extract(day from "admittedAt")::numeric / 1)) as x  from "Session"
            where "admittedAt" > ${old} AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`
        case "7D":
            return await prisma.$queryRaw`select CAST(count(*) as int) as "y", (date_trunc('month', "admittedAt") + interval '7 day' * floor(extract(day from "admittedAt")::numeric / 7)) as x  from "Session"
            where "admittedAt" > ${old} AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`
        case "1M":
            return await prisma.$queryRaw`select CAST(count(*) as int) as "y",  (date_trunc('month', "admittedAt")) as "x"  from "Session"
            where "admittedAt" > ${old} AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`
        default:
            return await prisma.$queryRaw`select CAST(count(*) as int) as "y",  (date_trunc('day', "admittedAt") + interval '6 hour' * floor(extract(hour from "admittedAt")::numeric / 6)) as "x"  from "Session"
            where "admittedAt" > ${old} AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`

    }
}
export const mortalityTrend = async (icuId:number, old:Date, freq:string):Promise<graph[]> => {
    if(icuId == -1){
        switch(freq){
            case "1D":
                return await prisma.$queryRaw`select CAST(count(*) as int) as "y",  (date_trunc('month', "admittedAt") + interval '1 day' * floor(extract(day from "admittedAt")::numeric / 1)) as x  from "Session"
                where "admittedAt" > ${old} and "reason" = 'Patient Deceased'
                group by "x"
                order by "x";`
            case "7D":
                return await prisma.$queryRaw`select CAST(count(*) as int) as "y", (date_trunc('month', "admittedAt") + interval '7 day' * floor(extract(day from "admittedAt")::numeric / 7)) as x  from "Session"
                where "admittedAt" > ${old} and "reason" = 'Patient Deceased'
                group by "x"
                order by "x";`
            case "1M":
                return await prisma.$queryRaw`select CAST(count(*) as int) as "y",  (date_trunc('month', "admittedAt")) as "x"  from "Session"
                where "admittedAt" > ${old} and "reason" = 'Patient Deceased'
                group by "x"
                order by "x";`
            default:
                return await prisma.$queryRaw`select CAST(count(*) as int) as "y",  (date_trunc('day', "admittedAt") + interval '6 hour' * floor(extract(hour from "admittedAt")::numeric / 6)) as "x"  from "Session"
                where "admittedAt" > ${old} and "reason" = 'Patient Deceased'
                group by "x"
                order by "x";`
    
        }
    }
    switch(freq){
        case "1D":
            return await prisma.$queryRaw`select CAST(count(*) as int) as "y",  (date_trunc('month', "admittedAt") + interval '1 day' * floor(extract(day from "admittedAt")::numeric / 1)) as x  from "Session"
            where "admittedAt" > ${old} and "reason" = 'Patient Deceased' AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`
        case "7D":
            return await prisma.$queryRaw`select CAST(count(*) as int) as "y", (date_trunc('month', "admittedAt") + interval '7 day' * floor(extract(day from "admittedAt")::numeric / 7)) as x  from "Session"
            where "admittedAt" > ${old} and "reason" = 'Patient Deceased' AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`
        case "1M":
            return await prisma.$queryRaw`select CAST(count(*) as int) as "y",  (date_trunc('month', "admittedAt")) as "x"  from "Session"
            where "admittedAt" > ${old} and "reason" = 'Patient Deceased' AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`
        default:
            return await prisma.$queryRaw`select CAST(count(*) as int) as "y",  (date_trunc('day', "admittedAt") + interval '6 hour' * floor(extract(hour from "admittedAt")::numeric / 6)) as "x"  from "Session"
            where "admittedAt" > ${old} and "reason" = 'Patient Deceased' AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`

    }
}
export const stayTrend = async (icuId:number, old:Date, freq:string):Promise<graph[]> => {
    if(icuId == -1){
        switch(freq){
            case "1D":
                return await prisma.$queryRaw`select round(avg(TRUNC(EXTRACT(EPOCH FROM (COALESCE("dischargedAt", NOW()) - "admittedAt")), 2) / 86400)) as "y",  (date_trunc('month', "admittedAt") + interval '1 day' * floor(extract(day from "admittedAt")::numeric / 1)) as x  from "Session"
                where "admittedAt" > ${old}
                group by "x"
                order by "x";`
            case "7D":
                return await prisma.$queryRaw`select round(avg(TRUNC(EXTRACT(EPOCH FROM (COALESCE("dischargedAt", NOW()) - "admittedAt")), 2) / 86400)) as "y", (date_trunc('month', "admittedAt") + interval '7 day' * floor(extract(day from "admittedAt")::numeric / 7)) as x  from "Session"
                where "admittedAt" > ${old}
                group by "x"
                order by "x";`
            case "1M":
                return await prisma.$queryRaw`select round(avg(TRUNC(EXTRACT(EPOCH FROM (COALESCE("dischargedAt", NOW()) - "admittedAt")), 2) / 86400)) as "y",  (date_trunc('month', "admittedAt")) as "x"  from "Session"
                where "admittedAt" > ${old}
                group by "x"
                order by "x";`
            default:
                return await prisma.$queryRaw`select round(avg(TRUNC(EXTRACT(EPOCH FROM (COALESCE("dischargedAt", NOW()) - "admittedAt")), 2) / 86400)) as "y",  (date_trunc('day', "admittedAt") + interval '6 hour' * floor(extract(hour from "admittedAt")::numeric / 6)) as "x"  from "Session"
                where "admittedAt" > ${old}
                group by "x"
                order by "x";`
    
        }
    }
    switch(freq){
        case "1D":
            return await prisma.$queryRaw`select round(avg(TRUNC(EXTRACT(EPOCH FROM (COALESCE("dischargedAt", NOW()) - "admittedAt")), 2) / 86400)) as "y",  (date_trunc('month', "admittedAt") + interval '1 day' * floor(extract(day from "admittedAt")::numeric / 1)) as x  from "Session"
            where "admittedAt" > ${old} AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`
        case "7D":
            return await prisma.$queryRaw`select round(avg(TRUNC(EXTRACT(EPOCH FROM (COALESCE("dischargedAt", NOW()) - "admittedAt")), 2) / 86400)) as "y", (date_trunc('month', "admittedAt") + interval '7 day' * floor(extract(day from "admittedAt")::numeric / 7)) as x  from "Session"
            where "admittedAt" > ${old} AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`
        case "1M":
            return await prisma.$queryRaw`select round(avg(TRUNC(EXTRACT(EPOCH FROM (COALESCE("dischargedAt", NOW()) - "admittedAt")), 2) / 86400)) as "y",  (date_trunc('month', "admittedAt")) as "x"  from "Session"
            where "admittedAt" > ${old} AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`
        default:
            return await prisma.$queryRaw`select round(avg(TRUNC(EXTRACT(EPOCH FROM (COALESCE("dischargedAt", NOW()) - "admittedAt")), 2) / 86400)) as "y",  (date_trunc('day', "admittedAt") + interval '6 hour' * floor(extract(hour from "admittedAt")::numeric / 6)) as "x"  from "Session"
            where "admittedAt" > ${old} AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`

    }
}
export const apacheTrend = async (icuId:number, old:Date, freq:string):Promise<graph[]> => {
    if(icuId == -1){
        switch(freq){
            case "1D":
                return await prisma.$queryRaw`select round(avg("apache"),2) as "y",  (date_trunc('month', "admittedAt") + interval '1 day' * floor(extract(day from "admittedAt")::numeric / 1)) as x  from "Session"
                where "admittedAt" > ${old}
                group by "x"
                order by "x";`
            case "7D":
                return await prisma.$queryRaw`select round(avg("apache"),2) as "y", (date_trunc('month', "admittedAt") + interval '7 day' * floor(extract(day from "admittedAt")::numeric / 7)) as x  from "Session"
                where "admittedAt" > ${old}
                group by "x"
                order by "x";`
            case "1M":
                return await prisma.$queryRaw`select round(avg("apache"),2) as "y",  (date_trunc('month', "admittedAt")) as "x"  from "Session"
                where "admittedAt" > ${old}
                group by "x"
                order by "x";`
            default:
                return await prisma.$queryRaw`select round(avg("apache"),2) as "y",  (date_trunc('day', "admittedAt") + interval '6 hour' * floor(extract(hour from "admittedAt")::numeric / 6)) as "x"  from "Session"
                where "admittedAt" > ${old}
                group by "x"
                order by "x";`
    
        }
    }
    switch(freq){
        case "1D":
            return await prisma.$queryRaw`select round(avg("apache"),2) as "y",  (date_trunc('month', "admittedAt") + interval '1 day' * floor(extract(day from "admittedAt")::numeric / 1)) as x  from "Session"
            where "admittedAt" > ${old} AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`
        case "7D":
            return await prisma.$queryRaw`select round(avg("apache"),2) as "y", (date_trunc('month', "admittedAt") + interval '7 day' * floor(extract(day from "admittedAt")::numeric / 7)) as x  from "Session"
            where "admittedAt" > ${old} AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`
        case "1M":
            return await prisma.$queryRaw`select round(avg("apache"),2) as "y",  (date_trunc('month', "admittedAt")) as "x"  from "Session"
            where "admittedAt" > ${old} AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`
        default:
            return await prisma.$queryRaw`select round(avg("apache"),2) as "y",  (date_trunc('day', "admittedAt") + interval '6 hour' * floor(extract(hour from "admittedAt")::numeric / 6)) as "x"  from "Session"
            where "admittedAt" > ${old} AND ${icuId} = ANY("icuId")
            group by "x"
            order by "x";`

    }
}