import { CSSProperties, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import styles from "./liveView.module.css"
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPatientlog, fetchPatientlogs } from './querys/logQuery';
import { Patientlog } from '@/types/pateintinfo';
const liveBox:CSSProperties = {
    backgroundColor: "#fff",
    backgroundImage:"linear-gradient(to top right, #A2CCFD 5%, white 60%)"
}

const LiveView =({patientId}:{patientId:string|null}) =>{

    const [latestInfo, setLatestInfo] = useState<Patientlog|undefined>();
    const { data:logs, isLoading:logLoading, refetch:fetchLogs_a, error:err } = useQuery({queryKey:[patientId], queryFn:fetchPatientlog});
    useEffect(()=>{
        if(logs){
            setLatestInfo(logs.logs[logs.logs.length-1]);
        }
    }, [logs])
    if(patientId == null){
        return <div className='text-lg text-center'>Please select the Bed First!</div>
    }


    if(logLoading){
        return <div className="container shadow-inner max-w-lg my-4 p-3 flex flex-col justify-evenly rounded-lg" style={liveBox}>
                    <div className="w-full flex justify-evenly items-center p-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className='flex flex-col gap-3 justify-evenly items-center'>
                            <Skeleton className="h-4 w-[250px]" />
                            <div className='flex justify-between gap-3'>
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    </div>
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
    }

    if(err){
        return <div className='text-lg text-center'>Failed to fetch patient Info!</div>
    }

    return(
        <div className="container shadow-inner max-w-lg my-4 p-3 flex flex-col justify-evenly rounded-lg" style={liveBox}>
            <div className="w-full flex justify-evenly items-center p-2">
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
            <ul className={`grid grid-cols-3 grid-flow-row gap-2 ${styles.PatientInfo}`}>
                <li>
                    <h4>7</h4>
                    <small>Days in ICU</small>
                </li>
                <li>
                    <h4>{latestInfo?.spo2}</h4>
                    <small>SpO2</small>
                </li>
                <li>
                    <h4>{`${latestInfo?.bp[0]}/${latestInfo?.bp[1]}`}</h4>
                    <small>Blood Pressure</small>
                </li>
                <li>
                    <h4>{latestInfo?.heart_rate}</h4>
                    <small>Heart Rate</small>
                </li>
                <li>
                    <h4>{latestInfo?.temp}</h4>
                    <small>Temperature</small>
                </li>
            </ul>
        </div>
    )
}

export default LiveView;