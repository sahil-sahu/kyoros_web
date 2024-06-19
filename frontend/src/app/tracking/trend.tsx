import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { HealthParameter, PatientInfoType, PatientRealtimeObj, Patientlog, Timeline } from "@/types/pateintinfo";
import { connectToSocket, unsubscribeFromRoom }from '@/lib/socket';
import { useEffect, useMemo, useRef, useLayoutEffect, useState } from "react";


import { Line } from 'react-chartjs-2';
import { dummyData } from "../glance/dummy";
import { linechartFormatter, options } from "@/lib/linechartformatter";
import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"
import { fetchPatientlogs } from "./querys/logQuery";
import { useQuery } from "@tanstack/react-query";
import { useTimeline } from "./hook/timeline";
import { useDisplay } from "./hook/display";
import useStack from "./hook/useStack";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import zoomPlugin from 'chartjs-plugin-zoom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
const Chart = ({display, old, patientId, freq}:{display:HealthParameter; old: Date; patientId:string; freq:number}) =>{
    const {messages:data, pushMessage, setMessages} = useStack();
    const mysocket = useRef<{room:string; unsubscribe: () => void;} | null>(null);
    const { data:logs, isLoading:logLoading, refetch:fetchLogs_a, error:err } = useQuery({queryKey:[patientId, old.toISOString(), freq], queryFn:fetchPatientlogs});
    const router = useRouter();
    const chartRef = useRef<ChartJS<'line', any, any>>();
    useLayoutEffect(()=>{
        
        // import('hammerjs').then(() => {
        //     import('chartjs-plugin-zoom');
        // });
        if(window.innerWidth > 1200){
            ChartJS.register(
                CategoryScale,
                LinearScale,
                PointElement,
                LineElement,
                Title,
                Tooltip,
                Legend,
                zoomPlugin
            );
        } else{
            ChartJS.register(
                CategoryScale,
                LinearScale,
                PointElement,
                LineElement,
                Title,
                Tooltip,
                Legend,
                // zoomPlugin
            );
        }
    },[])
    const resetZoom = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
        }
    };
    useEffect(()=>{
        if(logs){
            setMessages(logs.logs);
        }
        const connectRealtime = ()=>{
            const socket = connectToSocket(`patient/${patientId}`, pushMessage);
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
    }, [logs, patientId])
    // const p = ChartJSOrUndefined
    // button
    return (<div className="align-center m-auto max-w-[95vw] w-min overflow-x-auto p-3 relative">
                {window.innerWidth > 1200 && <Button variant="secondary" onClick={resetZoom} className="absolute right-5">Reset</Button>}
                <Line
                    options={options}
                    data={linechartFormatter(display,data)}
                    className="m-auto min-h-[50vh] lg:min-h-[60vh]"
                    ref={chartRef}
                />
            </div>)
}

const TrendView = ({patientId}:{patientId:string|null}) => {
    
    // const [display, setDisplay] = useDisplay();
    const [timeline, setTimeline] = useTimeline();
    const searchParams = useSearchParams();
    const [freq, setFreq] = useState(5);
    const param: HealthParameter = PatientInfoType.find((e): e is HealthParameter => searchParams.get('vital') === e) ?? PatientInfoType[1];
    const ChartView = useMemo(()=> patientId?(<Chart old={timeline} freq={freq} display={param} patientId={patientId} />):<></>, [param, timeline, patientId, freq])
    // const router = useRouter();
    if(patientId == null){
        return <div className='text-lg text-center'>Please select the Bed First!</div>
    }
    return(
        <div className="trend-container">
            <div className="header max-w-4xl w-full m-auto p-2 flex justify-center items-center">
                <ToggleGroup className="p-2" defaultValue={Timeline.m30} onValueChange={setTimeline} type="single">
                    {Object.entries(Timeline).map(([key, val]) => (
                        <ToggleGroupItem key={key} value={val}>
                            {val}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
                <Select defaultValue={freq+""} onValueChange={(val)=>{
                    let freq = parseInt(val);
                    setFreq(freq)
                }}>
                            <SelectTrigger className="max-w-20">
                                <SelectValue placeholder="Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key={5} value={"5"}>5m</SelectItem>
                                <SelectItem key={15} value={"15"}>15m</SelectItem>
                                <SelectItem key={30} value={"30"}>30m</SelectItem>
                                <SelectItem key={60} value={"60"}>1hr</SelectItem>
                                <SelectItem key={30} value={"180"}>3hr</SelectItem>
                            </SelectContent>
                </Select>
            </div>
            {ChartView}
        </div>
    )
}

export default TrendView;