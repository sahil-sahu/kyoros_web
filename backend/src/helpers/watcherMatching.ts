import { prisma } from "../prisma"


export const watcherMatching = async (userId:string, icuIds:number[]) => {
    try {
        const watcher = await prisma.watcher.findMany({
            where: {
                userid:userId,
            }
        })
        const dbArr = watcher.map((watcher) => watcher.icuId)
        await Promise.all(icuIds.map(async icuId =>{
            if(dbArr.includes(icuId)) return icuId;
            const watcher = await prisma.watcher.create({
                data:{
                    icuId,
                    userid:userId
                }
            })
            return watcher.icuId;
        }))
        let watchertoDelete:number[] = [];
        for(const icuId of dbArr){
            if(icuIds.includes(icuId)) continue;
            watchertoDelete.push(icuId);
        }
        await prisma.watcher.deleteMany({
            where:{
                userid: userId,
                icuId:{
                    in: watchertoDelete
                }
            }
        })

    } catch (error) {
        console.error("Error occurred while matching watcher", error)
        throw new Error("Failed match with watcher")
    }
}