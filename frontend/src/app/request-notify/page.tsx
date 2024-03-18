// pages/index.tsx
"use client";
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { setFcm } from './mutation';
import { useRouter } from 'next/navigation';
import { app } from '@/lib/firebase';

export default function Messaging() {
    const { mutate, isPending:isLoading, error, data } = useMutation({mutationFn:setFcm});
    const router = useRouter();
    useEffect(() => {

    if(data){
        router.back();
    }

    const requestNotificationPermission = async () => {
      if(!isSupported()){
        alert("notification not supported on this browser");
        router.back();
      } 
      const messaging = getMessaging(app);
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {vapidKey:process.env.NEXT_PUBLIC_FCM});
        mutate({token});
      } else {
        console.log('Notification permission denied');
      }
    };

    requestNotificationPermission();
  }, [data, mutate, router]);

  if(isLoading){
    return <div>subscribing our services</div>
  }

  return (
    <p>
        Looking for permissions
    </p>
  );
}