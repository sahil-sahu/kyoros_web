import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import styles from "./liveView.module.css"
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPatientlog, fetchPatientlogs } from './querys/logQuery';
import { Patientlog } from '@/types/pateintinfo';
import { connectToSocket, unsubscribeFromRoom } from '@/lib/socket';
import { CaretDownIcon, DropdownMenuIcon, OpenInNewWindowIcon } from '@radix-ui/react-icons';
import folder_i from "./folder.png";
import Link from 'next/link';
import AlertBox from "./components/alertBox";
import Image from 'next/image';
import Criticality from '@/components/custom/criticality';
import { GlanceInfo } from '@/types/glance';

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import GetTable from '@/components/custom/logsFormater';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Notes from '@/components/custom/notes';
import PatientHistory from '@/components/custom/patientHistory';

type Checked = DropdownMenuCheckboxItemProps["checked"]

const liveBox:CSSProperties = {
    backgroundColor: "#fff",
    backgroundImage:"linear-gradient(to top right, #A2CCFD 5%, white 60%)"
}

const LiveView =({patientId}:{patientId:string|null}) =>{

    const [latestInfo, setLatestInfo] = useState<Patientlog|undefined>();
    const { data:logs, isLoading:logLoading, refetch:fetchLogs_a, error:err } = useQuery({queryKey:[patientId], queryFn:fetchPatientlog});
    const [criticality, setCriticality] = useState<number|undefined>();
    const mysocket = useRef<{room:string|null; unsubscribe: () => void;} | null>(null);
    

    const [params, setparams] = useState<("all"|"moniter"|"ventilator"|"infusion")[]>(["all"])

    useEffect(()=>{
        if(logs){
            setLatestInfo(logs.logs[logs.logs.length-1]);
            setCriticality(logs.apache);
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
        try {
            if(mysocket.current && mysocket.current?.room != patientId){
                mysocket.current.unsubscribe();
                mysocket.current = null;
            }
    
           if(mysocket.current == null)  mysocket.current = connectRealtime();
        } catch (error) {
            console.error(error)
        }
    }, [patientId])
    if(patientId == null){
        return <div className='text-lg text-center'>Please select the Bed First!</div>
    }

    if(logLoading && logs == undefined){
        return (
            <div className='grid lg:grid-cols-2 grid-cols-1 max-w-5xl m-auto gap-4'>
            <div style={{
                background:"linear-gradient(to bottom right, #303778, #4C8484)"
            }} className='text-white flex justify-evenly rounded-xl p-4 py-8'>
                <div className="flex flex-col justify-evenly items-center p-2 w-[40%] ">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className='flex flex-col justify-evenly items-center gap-5'>
                        <Skeleton className="h-4 w-[70%]" />
                        <div className='hidden md:flex justify-between gap-3'>
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
                    <Skeleton className="h-[100px] w-full" />
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
        <section className='grid md:grid-cols-4 lg:grid-cols-7 grid-rows-2 grid-flow-row auto-rows-min items-start gap-2'>
        <div style={{
                background:"linear-gradient(to bottom right, #303778, #4C8484)"
            }} className='text-white flex justify-evenly rounded-xl p-4 col-span-3 lg:h-auto h-[90%]'>
                <div className="flex flex-col justify-evenly items-center p-2 w-[50%]">
                    <div className='flex w-full gap-4 mb-2 items-center'>
                        <Criticality setCriticality={setCriticality} g_criticality={criticality} data={{patientId, id:logs?.bedId || -1 , apache:logs?.apache} as GlanceInfo} />
                        <h3 className="text-lg w-max">
                            {logs?.uhid ?? "UHID: --"}
                        </h3>
                    </div>
                    <Avatar style={{height:"100px", width:"100px"}}>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col justify-evenly items-center'>
                        <h3 className='text-lg capitalize'>
                            {logs?.name}
                        </h3>
                        <div className='flex justify-between gap-3'>
                            <span>{`Age: ${logs?.age}`}</span>
                            <span>{logs?.gender}</span>
                        </div>
                    </div>
                    <PatientHistory patientId={patientId} />
                    <div className='divider border-white w-full my-2 border h-0'></div>
                    <div className='flex justify-between gap-3'>
                        <div>
                            <h3 className='text-lg'>
                                Comordities
                            </h3>
                            <ol>
                                {(logs?.comorbidities && logs?.comorbidities.length) ? logs.comorbidities.map((e,i) => (
                                    <li key={`comordities${i}`}>{e}</li>
                                )):("--")}
                            </ol>
                        </div>
                        <div>
                            <h3 className='text-lg'>
                                Surgeries
                            </h3>
                            <ol>
                                {(logs?.Surgeries && logs?.Surgeries.length) ? logs.Surgeries.map((e,i) => (
                                    <li key={`Surgery_${i}`}>{e}</li>
                                )):("--")}
                            </ol>
                        </div>
                        <div></div>
                    </div>
                </div>
                <div className='divider border-white border h-full'></div>
                <div className='p-3 py-5 w-[40%] text-center'>
                    <h3 className='my-3 text-lg font-semibold'>
                        Diagnosis
                    </h3>
                    <p>
                        {logs?.diagnosis ||`Poorly controlled DM-type 2 (HbA1c- 12.8)
Presents to ED with a 2 day H/O high fever, headache, & Rt sided Facial swelling.`}
                    </p>
                </div>
            </div>
        <div className='grid grid-rows-2 col-span-1 gap-3'>
            <Link className="" href={`/request-notify`}>
                <AlertBox patientId={patientId}></AlertBox>
            </Link>
            <Link className="border-2 border-darkblue p-5 rounded-xl" href={"/docs/"+patientId}>
                <h3 className="text-lg mb-5 text-left font-semibold">Docs</h3>
                <Image className="m-auto w-24 object-contain" src={folder_i} alt={"📂"} />
            </Link>
        </div>
        <Tabs defaultValue="notes" className="col-span-full lg:col-span-3 p-2 rounded border row-span-2 h-auto">
            <TabsList className='bg-white patient rounded-none border-b gap-1 flex justify-evenly w-max'>
                <TabsTrigger className='data-[state=active]:bg-darkblue data-[state=active]:text-white' value="notes">Notes</TabsTrigger>
                <TabsTrigger className='data-[state=active]:bg-darkblue data-[state=active]:text-white' value="medication">Medication</TabsTrigger>
                <TabsTrigger className='data-[state=active]:bg-darkblue data-[state=active]:text-white' value="i_o">I/O</TabsTrigger>
            </TabsList>
            <TabsContent value="notes"><Notes patientId={patientId}/></TabsContent>
            <TabsContent value="medication">Medication section</TabsContent>
            <TabsContent value="i_o">I/O</TabsContent>
        </Tabs>
        <div className='p-5 border-2 col-span-full lg:col-span-4 h-full w-full max-w-6xl m-auto rounded-xl'>
            <div className='flex justify-between'>
                <h3 className='text-center text-2xl font-bold'>
                    Patient Parameter
                </h3>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className='capitalize relative w-[10rem] text-left text-ellipsis'> <span className='absolute top-0 text-xs -translate-y-2.5 left-2 bg-white'>Devices</span> <span className='w-[8rem] text-left text-ellipsis overflow-hidden'>{params.join(", ")}</span> <CaretDownIcon className='ml-2 float-end absolute right-2' /> </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Devices</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                        checked={params.includes("all")}
                        onCheckedChange={()=>setparams(["all"])}
                        >
                        All
                        </DropdownMenuCheckboxItem>

                        <DropdownMenuCheckboxItem
                        checked={params.includes("moniter")}
                        onCheckedChange={()=>setparams((params)=>{
                            let arr = [...params];
                            arr = arr.filter((e) => e != "all");
                            arr.push("moniter");
                            return arr;
                        })}
                        >
                            Vitals Moniter
                        </DropdownMenuCheckboxItem>

                        <DropdownMenuCheckboxItem
                            checked={params.includes("ventilator")}
                            onCheckedChange={() => setparams((params) => {
                                let arr = [...params];
                                arr = arr.filter((e) => e != "all");
                                arr.push("ventilator");
                                return arr;
                            })}
                        >
                            Ventilator
                        </DropdownMenuCheckboxItem>

                        <DropdownMenuCheckboxItem
                            checked={params.includes("infusion")}
                            onCheckedChange={() => setparams((params) => {
                                let arr = [...params];
                                arr = arr.filter((e) => e != "all");
                                arr.push("infusion");
                                return arr;
                            })}
                        >
                            Infusion
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
            </div>
            <div className='rounded-t-lg overflow-auto mt-3 w-full'>
                {(latestInfo && logs) ? <GetTable logs={logs.logs} latestInfo={latestInfo} />: "No Logs for current Patient"}
            </div>
            </div>
        </section>
    )
}

export default LiveView;