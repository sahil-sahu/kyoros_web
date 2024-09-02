import { fireNotifier } from "../firebase";
import { NotificationLoad } from "../types";
import { MulticastMessage } from "firebase-admin/messaging";
import user_from_redis from "./userfromRedis";
import { prisma } from "../prisma";

export default async function sendTestNotification(firetokens: string[]){

    if(firetokens.length == 0)
        throw new Error("No firetoken available for patient");

    const message:MulticastMessage = {
        notification: {
            title: "This is test notification",
            body: `This ensures you will get a notification when ever its needed.`,
        },
        data: {
            severity: "general",
            patientId: "null"
        },
            tokens:firetokens
        };
    return await fireNotifier.sendEachForMulticast(message);
}