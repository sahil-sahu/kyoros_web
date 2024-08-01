import { fireNotifier } from "../firebase";
import { NotificationLoad } from "../types";
import { MulticastMessage } from "firebase-admin/messaging";
import user_from_redis from "./userfromRedis";
import { prisma } from "../prisma";

export const getpatientLocation = async (patientId:string):Promise<NotificationLoad>=>{
    const data = await prisma.bed.findUnique({
        where:{
            patientId
        },
        include:{
            ICU:true
        }
    })
    return {
        patientId,
        bedID: data.id,
        icuId: data.icuId,
        bedName: data.name,
        icuName: data.ICU.name
      };
}
export default async function sendTaggedNotification(userIds: string[], patientId:string){
    const firetokens_nested = await Promise.all(userIds.map(async e => {
        const user = await user_from_redis(e)
        return user.fireTokens
    }));
    const firetokens = firetokens_nested.flatMap( e => e)

    if(firetokens.length == 0)
        return;
    const notificationInfo = await getpatientLocation(patientId)
    // console.log(firetokens, notificationInfo)
    const message:MulticastMessage = {
        notification: {
            title: "Someone tagged you on notes",
            body: `${notificationInfo.icuName}, ${notificationInfo.bedName}`,
        },
        data: {
            severity: "general",
            patientId: notificationInfo.patientId
        },
        webpush: {
            fcmOptions: {
              link: `tracking?patient=${notificationInfo.patientId}&icu=${notificationInfo.icuId}&bed=${notificationInfo.bedID}&type=Live`
            }
          },
        tokens:firetokens
        };
    fireNotifier.sendEachForMulticast(message);
}