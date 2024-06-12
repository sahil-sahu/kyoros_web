import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import styles from "./liveView.module.css"
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPatientlog, fetchPatientlogs } from './querys/logQuery';
import { Patientlog } from '@/types/pateintinfo';
import { connectToSocket, unsubscribeFromRoom } from '@/lib/socket';
const liveBox:CSSProperties = {
    backgroundColor: "#fff",
    backgroundImage:"linear-gradient(to top right, #A2CCFD 5%, white 60%)"
}

const LiveView =({patientId}:{patientId:string|null}) =>{

    const [latestInfo, setLatestInfo] = useState<Patientlog|undefined>();
    const { data:logs, isLoading:logLoading, refetch:fetchLogs_a, error:err } = useQuery({queryKey:[patientId], queryFn:fetchPatientlog});
    const mysocket = useRef<{room:string|null; unsubscribe: () => void;} | null>(null);
    useEffect(()=>{
        if(logs){
            setLatestInfo(logs.logs[logs.logs.length-1]);
        }
    }, [logs])
    useEffect(()=>{
        const connectRealtime = ()=>{
            const socket = connectToSocket(`patient/${patientId}`, setLatestInfo);
            return {
                room: patientId,
                unsubscribe : () => {
                    unsubscribeFromRoom(`patient/${patientId}`);
                  }
            };
        }
        if(mysocket.current && mysocket.current?.room != patientId){
            mysocket.current.unsubscribe();
            mysocket.current = null;
        }

       if(mysocket.current == null)  mysocket.current = connectRealtime();
    }, [patientId])
    if(patientId == null){
        return <div className='text-lg text-center'>Please select the Bed First!</div>
    }

    if(logLoading){
        return (
            <div className='grid lg:grid-cols-2 grid-cols-1 max-w-5xl m-auto gap-4'>
            <div style={{
                background:"linear-gradient(to bottom right, #303778, #4C8484)"
            }} className='text-white flex justify-evenly rounded-xl p-4 py-8'>
                <div className="flex flex-col justify-evenly items-center p-2 w-[40%] ">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className='flex flex-col justify-evenly items-center gap-5'>
                        <h3 className='text-lg'>
                            <Skeleton className="h-4 w-[200px]" />
                        </h3>
                        <div className='flex justify-between gap-3'>
                            <Skeleton className="h-4 w-[80px]" />
                            <Skeleton className="h-4 w-[80px]" />
                        </div>
                    </div>
                </div>
                <div className='divider border-white border h-full'></div>
                <div className='p-3 py-5 w-[40%] text-center'>
                    <h3 className='my-3 text-lg font-semibold'>
                        Diagnosis
                    </h3>
                    <Skeleton className="h-[100px] w-[200px]" />
                </div>
            </div>
            <div className='p-5 border-2 rounded-xl border-darkblue'>
                <h3 className='text-center text-2xl font-bold'>
                    Vitals
                </h3>
                <ul className={`grid grid-cols-3 grid-flow-row gap-2 ${styles.PatientInfo}`}>
                        <li>
                        <Skeleton>
                            <h4>&nbsp;</h4>
                            <small>&nbsp;</small>
                        </Skeleton>
                        </li>
                        <li>
                        <Skeleton>
                            <h4>&nbsp;</h4>
                            <small>&nbsp;</small>
                        </Skeleton>
                        </li>
                        <li>
                        <Skeleton>
                            <h4>&nbsp;</h4>
                            <small>&nbsp;</small>
                        </Skeleton>
                        </li>
                        <li>
                        <Skeleton>
                            <h4>&nbsp;</h4>
                            <small>&nbsp;</small>
                        </Skeleton>
                        </li>
                        <li>
                        <Skeleton>
                            <h4>&nbsp;</h4>
                            <small>&nbsp;</small>
                        </Skeleton>
                        </li>
                    </ul>
            </div>
        </div>
        )
    }

    if(err){
        return <div className='text-lg text-center'>Failed to fetch patient Info!</div>
    }

    return(
        <div className='grid lg:grid-cols-2 grid-cols-1 max-w-5xl m-auto gap-4'>
            <div style={{
                background:"linear-gradient(to bottom right, #303778, #4C8484)"
            }} className='text-white flex justify-evenly rounded-xl p-4 py-8'>
                <div className="flex flex-col justify-evenly items-center p-2 w-[40%] ">
                    <Avatar style={{height:"100px", width:"100px"}}>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col justify-evenly items-center'>
                        <h3 className='text-lg'>
                            {logs?.name}
                        </h3>
                        <div className='flex justify-between gap-3'>
                            <span>{`Age: ${logs?.age}`}</span>
                            <span>{logs?.gender}</span>
                        </div>
                    </div>
                </div>
                <div className='divider border-white border h-full'></div>
                <div className='p-3 py-5 w-[40%] text-center'>
                    <h3 className='my-3 text-lg font-semibold'>
                        Diagnosis
                    </h3>
                    <p>
                        {`Poorly controlled DM-type 2 (HbA1c- 12.8)
Presents to ED with a 2 day H/O high fever, headache, & Rt sided Facial swelling.`}
                    </p>
                </div>
            </div>
            <div className='p-5 border-2 rounded-xl border-darkblue'>
                <h3 className='text-center text-2xl font-bold'>
                    Vitals
                </h3>
                <ul className={`grid grid-cols-3 h-full justify-center items-center grid-flow-row gap-2 ${styles.PatientInfo}`}>
                    <li>
                        <h4>7</h4>
                        <small>Days in ICU</small>
                    </li>
                    <li>
                        <h4>{latestInfo?.spo2 ?? "--"}</h4>
                        <small>SpO2</small>
                    </li>
                    <li>
                        <h4>{`${latestInfo?.bp[0] ?? "--"}/${latestInfo?.bp[1] ?? "--"}`}</h4>
                        <small>Blood Pressure</small>
                    </li>
                    <li>
                        <h4>{latestInfo?.heart_rate ?? "--"}</h4>
                        <small>Heart Rate</small>
                    </li>
                    <li>
                        <h4>{latestInfo?.temp ?? "--"}</h4>
                        <small>Temperature</small>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default LiveView;