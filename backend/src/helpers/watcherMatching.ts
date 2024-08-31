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
export const watcherMatchingviaICU = async (icuId:number, users:string[]) => {
    try {
        const watcher = await prisma.watcher.findMany({
            where: {
                userid:{
                    in: users
                },
                icuId
            }
        })
        const ids = new Map<string, boolean>();
        watcher.forEach(watcher => ids.set(watcher.userid, true))
        const unmappedUsers = users.filter(e => !ids.has(e));
        if(unmappedUsers.length < 1) return

        const newwatchers = await prisma.watcher.createMany({
            data: unmappedUsers.map(userid => ({
                icuId,
                userid
            }))
        })

    } catch (error) {
        console.error("Error occurred while matching watcher", error)
        throw new Error("Failed match with watcher")
    }
}