import { fireNotifier } from "../firebase";
import User from "../models/user";
import { Patientlog } from "../types";
import PatientModel from "../models/patients";
import { Message, MulticastMessage } from "firebase-admin/messaging";

export default async function checknSendNotification(patientId:string, data:Patientlog){
    if(!(data.bp[0] > 120 || data.bpm > 80))
    return; //No need to send notification for

    const patient = await PatientModel.findById(patientId);
    const users = await User.find({"userType": { $in: ['doctor', 'nurse'] }, "fireToken": {"$ne": null}});
    const message:MulticastMessage = {
        notification: {
            title: 'Abnormal Behaviour Detected',
            body: `Patient: ${patient.name} having bp :${data.bp} & bpm :${data.bpm}`
        },
        webpush: {
            fcmOptions: {
              link: `doctor/patient/${patientId}`
            }
          },
        tokens:users.map(user => user.fireToken)
        };
    fireNotifier.sendEachForMulticast(message);
}