import { fireNotifier } from "../firebase";
import User from "../models/user";
import { FullLog, Patientlog } from "../types";
import PatientModel from "../models/patients";
import { Message, MulticastMessage } from "firebase-admin/messaging";
import { fireTokensFromICU } from "../helpers/formatwRedis";

export default async function checknSendNotification(log:FullLog, icuId: number){
    if(!(log.bp[0] > 120 || log.heart_rate > 80))
    return; //No need to send notification for
    const firetokens = await fireTokensFromICU(icuId);
    if(firetokens.length == 0)
        return;
    const message:MulticastMessage = {
        notification: {
            title: 'Abnormal Behaviour Detected',
            body: `Patient having bp :${log.bp} & bpm :${log.heart_rate}`
        },
        webpush: {
            fcmOptions: {
              link: `doctor/patient/${log.patientId}`
            }
          },
        tokens:firetokens
        };
    fireNotifier.sendEachForMulticast(message);
}