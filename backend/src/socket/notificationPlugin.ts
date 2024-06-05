import { fireNotifier } from "../firebase";
import User from "../models/user";
import { FullLog, NotificationLoad, Patientlog } from "../types";
import PatientModel from "../models/patients";
import { Message, MulticastMessage } from "firebase-admin/messaging";
import { fireTokensFromICU } from "../helpers/formatwRedis";

function getRandomStatus() {
    const randomValue = Math.random();
    return randomValue < 0.7 ? "normal" : "critical";
}
export default async function checknSendNotification(log:FullLog, notificationInfo:NotificationLoad){
    if(!(log.bp[0] > 120 || log.heart_rate > 80)) return; //No need to send notification for
    const firetokens = await fireTokensFromICU(notificationInfo.icuId);
    console.log("Need to send")
    if(firetokens.length == 0)
        return;
    const message:MulticastMessage = {
        notification: {
            title: `BP declining for patient at ${notificationInfo.bedName}`,
            body: `Patient situated at ${notificationInfo.icuName}, ${notificationInfo.bedName}`,
        },
        data: {
            severity:getRandomStatus()
        },
        webpush: {
            fcmOptions: {
              link: `tracking?patient=${log.patientId}&icu=${notificationInfo.icuId}&bed=${log.bedID}&type=Trend`
            }
          },
        tokens:firetokens
        };
    fireNotifier.sendEachForMulticast(message);
}