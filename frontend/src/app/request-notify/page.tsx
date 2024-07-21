// pages/index.tsx
"use client";
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { setFcm } from './query/mutation';
import { useRouter, useSearchParams } from 'next/navigation';
import { app } from '@/lib/firebase';
import NavBox from '@/components/custom/header/header';
import { NotificationTab, Alert } from './table';
import { deleteByid, getAll } from '@/lib/indexedDB';
import { fetchNotifications } from './query/query';
import { Checkbox } from '@/components/ui/checkbox';
import { notification } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { fetchICU } from '../tracking/querys/icuQuery';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { bedInfo, ICUInfo } from '@/types/ICU';


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
function _Messaging() {
    const { mutate, isPending:isLoading, error, data } = useMutation({mutationFn:setFcm});
    const router = useRouter();
    const filterApi = useQuery({ queryKey: ['icu'], queryFn: fetchICU });
    const [feeds, setFeeds] = useState<notification[]>([]);
    const allfeeds = useRef<notification[]>([]);
    const searchParams = useSearchParams();
    const icu = +(searchParams.get('icu') || "kyoros");
    const bed = +(searchParams.get('bed') || "kyoros");
    const [ICU, ICUSet]  = useState<ICUInfo|undefined>(!Number.isNaN(icu)?(filterApi.data || []).find(e=>e.id == icu):(filterApi.data || [])[0]);
    const [Bed, BedSet]  = useState<bedInfo|undefined>();
    useEffect(()=>{
      if(!ICU) return;
      BedSet(ICU.beds.find(e => e.id == bed))
  },[ICU, bed])
    const normalNotification = useQuery({queryKey:['notification', "normal", [ICU?.name, Bed?.name].join(", ")], queryFn:fetchNotifications});
    const criticalNotification = useQuery({queryKey:['notification', "critical", [ICU?.name, Bed?.name].join(", ")], queryFn:fetchNotifications});

    const pushFeed = (feed:notification) => setFeeds((prev)=> [...prev, feed]);
    const popFeed = (feed:notification) => setFeeds((prev)=> prev.filter(f=> f.id!= feed.id));

    const setICU = (val:string) =>{
      if(val == "none"){
        BedSet(undefined)
        return ICUSet(undefined);}
      const icu = (filterApi.data || []).find(e => (parseInt(val) ?? 0) == e.id);
      if(icu){
        BedSet(undefined)
        ICUSet(icu)
      };
    }

    const setBed = (val:string) => {
        if(val == "none") return BedSet(undefined);
        const bed = ICU?.beds.find(e => (parseInt(val) ?? 0) == e.id);
        BedSet(bed);
    }
    // useEffect(()=>{
    //     console.log(ICU, Bed)
    //     if(!ICU) return;
    //     setFeeds((feeds) => {
    //       const arr = [...feeds];
    //       const icuFilter = arr.filter(e => {
    //         console.log(e.description);
    //         return e.description.includes(ICU?.name ?? "")
    //       })
    //       console.log(icuFilter)
    //       const bedFilter = icuFilter.filter(e => e.description.includes( Bed?.name ?? ""))
    //       console.log(bedFilter)
    //       return [];
    //     })
    // },[ICU, Bed])

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
    <main className='max-h-dvh overflow-hidden'>
      <NavBox title={"Notifications"}></NavBox>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className=''>
          <tr className=''>
            <th className="py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <Checkbox onCheckedChange={(val:boolean)=> val?setFeeds(allfeeds.current):setFeeds([])} className='my-2 mx-3' />
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 w-full font-medium text-gray-500 uppercase tracking-wider">
              Feed
            </th>
            <th className="px-6 py-3 text-right bg-gray-50 text-xs float-end leading-4 flex gap-2 font-medium text-gray-500 uppercase tracking-wider">
              <div className='w-min gap-2 flex items-center'>
              <h3 className='text-lg font-bold w-32'>Filter By : </h3>  
              <Select value={ICU?.id.toString() || "none"} onValueChange={setICU} defaultValue={ICU?.id.toString()}>
                  <SelectTrigger className='w-32'>
                      <SelectValue className='w-24' placeholder="Select ICU" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem key={"none"} value={"none"}>All</SelectItem>
                      {
                          (filterApi.data || []).map(e => (
                              <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                          ))
                      }
                  </SelectContent>
              </Select>
              <Select value={Bed?.id.toString() || "none"} defaultValue='none' onValueChange={setBed}>


                  <SelectTrigger className='w-32'>
                      <SelectValue placeholder="Select Bed" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem key={"none"} value={"none"}>All</SelectItem>
                      {
                          (ICU || {beds:[]}).beds.map(e => (
                              <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                          ))
                      }
                  </SelectContent>
              </Select>
              </div>
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
      <div className='grid grid-cols-1 lg:grid-cols-2'>
      {(!criticalNotification.isLoading && criticalNotification.data && criticalNotification.data.length != 0) && (<section className='p-2 pt-0 max-h-[45vh] lg:max-h-[80vh] overflow-y-auto'>
        <h2 className='text-lg font-bold text-gray-600 sticky top-0 bg-white lg:py-3 pt-5'>
          Critical
        </h2>
        <NotificationTab pushFeed={pushFeed} popFeed={popFeed} feeds={feeds} rows={criticalNotification.data} />
      </section>)}
      {(!normalNotification.isLoading && normalNotification.data  && normalNotification.data.length != 0) && (<section className='p-2 pt-0 max-h-[45vh] lg:max-h-[80vh] overflow-y-auto'>
        <h2 className='text-lg font-bold text-gray-600 lg:py-3  bg-white  pt-5 sticky top-0'>
          Normal
        </h2>
        <NotificationTab pushFeed={pushFeed} popFeed={popFeed} feeds={feeds} rows={normalNotification.data} />
      </section>)}
      </div>
    </main>
  );
}

export default function Messaging(){
  return (
    <Suspense>
      <_Messaging />
    </Suspense>
  );
}