// pages/index.tsx
"use client";
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { setFcm } from './query/mutation';
import { useRouter } from 'next/navigation';
import { app } from '@/lib/firebase';
import NavBox from '@/components/custom/header/header';
import { NotificationTab, Alert } from './table';
import { deleteByid, getAll } from '@/lib/indexedDB';
import { fetchNotifications } from './query/query';
import { Checkbox } from '@/components/ui/checkbox';
import { notification } from '@/types/notification';
import { Button } from '@/components/ui/button';


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
    const normalNotification = useQuery({queryKey:['notification', "normal"], queryFn:fetchNotifications});
    const criticalNotification = useQuery({queryKey:['notification', "critical"], queryFn:fetchNotifications});
    const [feeds, setFeeds] = useState<notification[]>([]);
    const allfeeds = useRef<notification[]>([]);

    const pushFeed = (feed:notification) => setFeeds((prev)=> [...prev, feed]);
    const popFeed = (feed:notification) => setFeeds((prev)=> prev.filter(f=> f.id!= feed.id));

    // const data1 = normalNotification.data;
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
  useEffect(()=>{
    if(!criticalNotification.data || !normalNotification.data) return;

    const critical = criticalNotification.data;
    const normal = normalNotification.data;
    allfeeds.current = [...critical, ...normal];

  },[criticalNotification.data, normalNotification.data])


  // if(isLoading){
  //   return <div>subscribing our services</div>
  // }
  return (
    <main>
      <NavBox title={"Notifications"}></NavBox>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <Checkbox onCheckedChange={(val:boolean)=> val?setFeeds(allfeeds.current):setFeeds([])} className='my-2 mx-3' />
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Feed
            </th>
            <th className="px-6 py-3 text-right bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <Button onClick={() =>{feeds.forEach(e => e.id && deleteByid(e.id)); criticalNotification.refetch(); normalNotification.refetch();}} className='bg-bluecustom'>
                Clear
                <svg style={{padding: 1}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>

              </Button>
            </th>
          </tr>
      </thead>
      </table>
      {(!criticalNotification.isLoading && criticalNotification.data && criticalNotification.data.length != 0) && (<section className='p-2'>
        <h2 className='text-lg font-bold text-gray-600'>
          Critical
        </h2>
        <NotificationTab pushFeed={pushFeed} popFeed={popFeed} feeds={feeds} rows={criticalNotification.data} />
      </section>)}
      {(!normalNotification.isLoading && normalNotification.data  && normalNotification.data.length != 0) && (<section className='p-2'>
        <h2 className='text-lg font-bold text-gray-600'>
          Normal
        </h2>
        <NotificationTab pushFeed={pushFeed} popFeed={popFeed} feeds={feeds} rows={normalNotification.data} />
      </section>)}
    </main>
  );
}