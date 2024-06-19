import { prisma } from "./prisma"

const getall = async () =>{
    const now = new Date();
    const old = new Date(now.getTime() - 4*24*60* 60 * 1000);
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
getall();