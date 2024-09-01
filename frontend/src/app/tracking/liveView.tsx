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
import ageCalc from '@/lib/ageCalc';
import { getDateDifferenceFromNow } from '@/lib/daysCalc';
import { LiveTrend } from '@/types/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import PrintDialog from './print/printDialog';

type Checked = DropdownMenuCheckboxItemProps["checked"]

const liveBox:CSSProperties = {
    backgroundColor: "#fff",
    backgroundImage:"linear-gradient(to top right, #A2CCFD 5%, white 60%)"
}

const LiveView =({patientId}:{patientId:string|null}) =>{
    const router = useRouter()
    const searchParams = useSearchParams();
    const currentParams = new URLSearchParams(searchParams);
    const icu = currentParams.get("icu")
    const bed = currentParams.get("bed")
    const [latestInfo, setLatestInfo] = useState<Patientlog|undefined>();
    const { data:logs, isLoading:logLoading, refetch:fetchLogs_a, error:err } = useQuery({queryKey:[patientId], queryFn:fetchPatientlog, retry:false});
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
        return <div className='text-lg text-center'>{err.message || "Failed to fetch patient Info!"}</div>
    }

    return(
        <section className='grid md:grid-cols-4 lg:grid-cols-7 liveBoxContainer lg:grid-rows-2 auto-rows-min h-full max-h-full items-start gap-2'>
        <div style={{
                background:"linear-gradient(to bottom right, #303778, #4C8484)"
            }} className='text-white order-1 flex md:flex-row flex-col items-stretch justify-evenly rounded-xl p-4 max-w-[98dvw] col-span-3 h-full'>
                <div className="flex flex-col justify-evenly text-center items-center p-2 md:w-[50%]">
                    <div className='flex flex-wrap w-full gap-4 mb-2 items-center'>
                        <Criticality setCriticality={setCriticality} g_criticality={criticality} data={{patientId, id:logs?.bedId || -1 , apache:logs?.apache} as GlanceInfo} />
                        <h3 className="text-lg">
                            {logs?.uhid ?? "UHID: --"}
                        </h3>
                    </div>
                    <div className='grid grid-cols-5 items-stretch gap-3 w-full'>
                        <Avatar className='aspect-square md:col-span-2 col-span-5 m-auto h-full max-w-[100px] w-full' >
                            <AvatarImage className='h-full aspect-square object-cover  w-full' src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col m-auto text-center md:col-span-3 col-span-5 justify-evenly items-center'>
                            <h3 className='text-lg capitalize font-bold'>
                                {logs?.name}
                            </h3>
                            <div className='flex justify-between gap-3 mb-3'>
                                <span>{`${logs?.dob ? ageCalc(logs?.dob): logs?.age}`}yrs</span>
                                <span>{logs?.gender}</span>
                                <span>Days {getDateDifferenceFromNow(logs?.bedStamp ?? "0")}</span>
                            </div>
                            <PatientHistory  patientId={patientId} />
                        </div>
                    </div>
                    <div className='divider border-white w-full my-2 border h-0'></div>
                    <div className='flex justify-between gap-5'>
                        <div>
                            <h3 className='text-lg font-bold'>
                                Comordities
                            </h3>
                            <ol>
                                {(logs?.comorbidities && logs?.comorbidities.length) ? logs.comorbidities.map((e,i) => (
                                    <li key={`comordities${i}`}>{e}</li>
                                )):("--")}
                            </ol>
                        </div>
                        <div>
                            <h3 className='text-lg font-bold'>
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
                <div className='divider border-white border hidden md:block w-0 bg-white md:h-[20rem]'></div>
                <div className='p-3 py-5 md:w-[40%] text-center'>
                    <h3 className='my-3 text-lg font-semibold'>
                        Diagnosis
                    </h3>
                    <p>
                        {logs?.diagnosis ||`Poorly controlled DM-type 2 (HbA1c- 12.8)
Presents to ED with a 2 day H/O high fever, headache, & Rt sided Facial swelling.`}
                    </p>
                </div>
        </div>
        <div className='grid order-2 grid-cols-2 md:grid-cols-1 md:grid-rows-2 justify-center h-full w-full max-w-[95vw] mx-auto md:col-span-1 col-span-2 items-center gap-3'>
            <div className='border-2 border-darkblue rounded-xl h-full shadow'>
                <Link className="h-full" href={`/request-notify?icu=${icu}&bed=${bed}`}>
                    <AlertBox patientId={patientId}></AlertBox>
                </Link>
            </div>
            <div className='w-full h-full border-2 border-darkblue rounded-xl'>
            <Link className="border-2 bg-white flex justify-center items-center h-full rounded-xl m-auto"  href={"/docs/"+patientId}>
                <div className='aspect-square h-fit m-auto'>
                <h3 className="text-lg mb-5 text-left font-semibold">Docs</h3>
                <Image className="m-auto w-5/6 object-contain" src={folder_i} alt={"📂"} />
                </div>
            </Link>
            </div>
        </div>
        <div className='col-span-full lg:col-span-3 p-2 order-3 overflow-visible rounded h-full border row-span-2'>
            <Tabs defaultValue="notes" className="h-full">
                <TabsList className='bg-white patient rounded-none border-b gap-1 flex justify-evenly w-full text-black'>
                    <TabsTrigger className='data-[state=active]:bg-darkblue data-[state=active]:text-white text-xl' value="notes">Notes</TabsTrigger>
                    <TabsTrigger className='data-[state=active]:bg-darkblue data-[state=active]:text-white text-xl' value="medication">Medication</TabsTrigger>
                    <TabsTrigger className='data-[state=active]:bg-darkblue data-[state=active]:text-white text-xl' value="i_o">I/O</TabsTrigger>
                </TabsList>
                <TabsContent className='h-full' value="notes"><Notes patientId={patientId}/></TabsContent>
                <TabsContent value="medication">Medication section</TabsContent>
                <TabsContent value="i_o">I/O</TabsContent>
            </Tabs>
        </div>
        <div className='p-5 border-2 order-3 col-span-full row-start-3 lg:row-start-auto row-span-1 h-full lg:col-span-4 w-screen lg:w-auto max-w-6xl rounded-xl'>
            <div className='w-full flex flex-col items-stretch justify-center h-full'>
                <div className='flex justify-between items-center'>
                    <h3 className='text-center text-2xl font-bold'>
                        Patient Parameter
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-2 '>
                    <Select defaultValue={LiveTrend.Live} onValueChange={(e:LiveTrend)=>{
                        currentParams.set('type', LiveTrend.Trend);
                        if(e == LiveTrend.Trend) router.push('/tracking?'+currentParams.toString())
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Display Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={LiveTrend.Live}>Live</SelectItem>
                            <SelectItem value={LiveTrend.Trend}>Trend</SelectItem>
                        </SelectContent>
                    </Select>
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
                        <PrintDialog patientId={patientId} />
                    </div>
                </div>
                <div className='rounded-t-lg overflow-auto mt-3 h-full w-full'>
                    {(latestInfo && logs) ? <GetTable logs={logs.logs} latestInfo={latestInfo} />: "No Logs for current Patient"}
                </div>
            </div>
        </div>
        </section>
    )
}

export default LiveView;