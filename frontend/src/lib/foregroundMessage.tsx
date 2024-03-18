'use client';

import { getMessaging, onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { app } from "./firebase";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
export default function ForegroundMessage(){
    const router = useRouter();
    const {toast} = useToast();
    useEffect(()=>{
        onMessage(getMessaging(app),(payload)=>{
            console.log(payload);
            toast({
                title: payload.notification?.title,
                description: payload.notification?.body,
                variant: "destructive",
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