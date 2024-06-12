import { fireNotifier } from "../firebase";
import User from "../models/user";
import { FullLog, NotificationLoad, Patientlog } from "../types";
import PatientModel from "../models/patients";
import { Message, MulticastMessage } from "firebase-admin/messaging";
import { fireTokensFromICU } from "../helpers/formatwRedis";
import { alertCheck } from "../helpers/alertChecker";

function getRandomStatus() {
    const randomValue = Math.random();
    return randomValue < 0.7 ? "normal" : "critical";
}
export default async function checknSendNotification(log:FullLog, notificationInfo:NotificationLoad){
    const [type, messageLoad, vital] = alertCheck(log);
    if(type == null) return; //No need to send notification for
    const firetokens = await fireTokensFromICU(notificationInfo.icuId);

    console.log("Need to send")
    console.log(messageLoad + "::" + type)

    if(firetokens.length == 0)
        return;
    const message:MulticastMessage = {
        notification: {
            title: messageLoad,
            body: `${notificationInfo.icuName}, ${notificationInfo.bedName}`,
        },
        data: {
            severity:type,
            patientId: log.patientId
        },
        webpush: {
            fcmOptions: {
              link: `tracking?patient=${log.patientId}&icu=${notificationInfo.icuId}&bed=${log.bedID}&type=Trend&vital=${vital}`
            }
          },
        tokens:firetokens
        };
    fireNotifier.sendEachForMulticast(message);
}