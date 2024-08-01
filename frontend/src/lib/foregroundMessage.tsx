'use client';

import { getMessaging, onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { app } from "./firebase";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import { addNote } from "./indexedDB";
export default function ForegroundMessage(){
    const router = useRouter();
    const {toast} = useToast();
    useEffect(()=>{
        onMessage(getMessaging(app),(payload)=>{
            if(payload.notification?.title && payload.notification?.body && payload.data?.severity && payload.data?.severity != "general"){
                addNote({
                    title: payload.notification?.title,
                    description: payload.notification?.body,
                    severity: payload.data?.severity == "critical"? "critical": "normal",
                    timeStamp: new Date(),
                    link: payload.fcmOptions?.link ?? "#"
                })
            }
            toast({
                title: payload.notification?.title,
                description: payload.notification?.body,
                variant: payload.data?.severity != "general"?"destructive":"default",
                action: <ToastAction  onClick={()=>{
                                router.push(payload.fcmOptions?.link ?? "#");
                            }}
                            altText="Go Patient">Go Patient</ToastAction>,
                duration: 5000,
            })
        })
    })
    return <div style={{display:"none"}}></div>;
}