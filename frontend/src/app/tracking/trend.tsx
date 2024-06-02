import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { HealthParameter, PatientInfoType, PatientRealtimeObj, Patientlog, Timeline } from "@/types/pateintinfo";
import { connectToSocket, unsubscribeFromRoom }from '@/lib/socket';
import { useEffect, useMemo, useRef } from "react";
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
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

const Chart = ({display, old, patientId}:{display:HealthParameter; old: Date; patientId:string}) =>{
    const {messages:data, pushMessage, setMessages} = useStack();
    const mysocket = useRef<(() => void) | null>(null);
    const { data:logs, isLoading:logLoading, refetch:fetchLogs_a, error:err } = useQuery({queryKey:[patientId, old.toISOString()], queryFn:fetchPatientlogs});
    useEffect(()=>{
        if(logs){
            setMessages(logs.logs);
            const connectRealtime = ()=>{
                const socket = connectToSocket(`patient/${patientId}`, pushMessage);
                return () => {
                  unsubscribeFromRoom(`patient/${patientId}`);
                };
              }
              mysocket.current = connectRealtime();
        }
    }, [logs, patientId])

    return (<div className="align-center w-100 overflow-x-auto p-3">
                <Line
                    options={options}
                    data={linechartFormatter(display,data)}
                    className="m-auto min-h-[50vh]"
                />
            </div>)
}

const TrendView = ({patientId}:{patientId:string|null}) => {
    
    const [display, setDisplay] = useDisplay();
    const [timeline, setTimeline] = useTimeline();
    const ChartView = useMemo(()=> patientId?(<Chart old={timeline} display={display} patientId={patientId} />):<></>, [display, timeline, patientId])
    
    if(patientId == null){
        return <div className='text-lg text-center'>Please select the Bed First!</div>
    }
    
    return(
        <div className="trend-container">
            <div className="header max-w-xl m-auto p-2">
                <Select defaultValue={PatientInfoType[1]} onValueChange={setDisplay}>
                    <SelectTrigger>
                        <SelectValue placeholder="ICU" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            PatientInfoType.map(e => (
                                <SelectItem key={e} value={e}>{e}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
                <ToggleGroup className="p-2" defaultValue={Timeline.m30} onValueChange={setTimeline} type="single">
                    {Object.entries(Timeline).map(([key, val]) => (
                        <ToggleGroupItem key={key} value={val}>
                            {val}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>
            {ChartView}
        </div>
    )
}

export default TrendView;