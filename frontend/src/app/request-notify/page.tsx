// pages/index.tsx
"use client";
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { setFcm } from './mutation';
import { useRouter } from 'next/navigation';
import { app } from '@/lib/firebase';
import NavBox from '@/components/custom/header/header';
import { NotificationTab, Alert } from './table';


function getData(): Alert[] {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      title: "Resp rate 12",
      status: "critical",
      feed: "CICU 2a, Bed 2302",
      timestamp: "2024-05-13T12:00:00Z",
    },
    {
      id: "2",
      title: "Heart rate 35",
      status: "normal",
      feed: "CICU 2a, Bed 2305",
      timestamp: "2024-05-13T12:30:00Z",
    },
    // Add more dummy data as needed
  ];
}

export default function Messaging() {
    const { mutate, isPending:isLoading, error, data } = useMutation({mutationFn:setFcm});
    const router = useRouter();
    useEffect(() => {

    if(data){
        return;
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

    if(localStorage.getItem("fcmSet")  != "true")
        requestNotificationPermission();

  }, [data, mutate, router]);

  // if(isLoading){
  //   return <div>subscribing our services</div>
  // }
  return (
    <main>
      <NavBox title={"Notifications"}></NavBox>
      <section className='p-2'>
        <h2 className='text-lg'>
          Critical
        </h2>
        <NotificationTab rows={getData()} />
      </section>
    </main>
  );
}