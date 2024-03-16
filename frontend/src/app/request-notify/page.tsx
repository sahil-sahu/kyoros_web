// pages/index.tsx
"use client";
import { messaging } from '@/lib/firebase';
import { getToken, isSupported } from 'firebase/messaging';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { setFcm } from './mutation';
import { useRouter } from 'next/navigation';

export default function Home() {
    const { mutate, isLoading, error, data } = useMutation(setFcm);
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
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log(process.env.NEXT_PUBLIC_FCM);
        const token = await getToken(messaging, {vapidKey:process.env.NEXT_PUBLIC_FCM});
        console.log('FCM Token:', token);
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