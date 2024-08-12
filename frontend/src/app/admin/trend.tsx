import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useEffect, useMemo, useRef, useLayoutEffect, useState, useContext } from "react";


import { Line } from 'react-chartjs-2';
import { options } from "@/lib/linechartformatter";
import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"
import { useQuery } from "@tanstack/react-query";
import { useTimeline } from "./hook/timeline";
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
import { HeaderContext } from "./context";
import { linechartFormatter } from "./lineChartFormatter";
import { fetchMetric } from "./queries/getVals";
const Chart = ({old, freq}:{old: Date; freq:string}) =>{
    const context = useContext(HeaderContext)
    const { data, isLoading, refetch, error } = useQuery({queryKey:["admin",context?.icuState[0],context?.metricState[0], old.toISOString(), freq], queryFn:fetchMetric});
    const router = useRouter();
    const chartRef = useRef<ChartJS<'line', any, any>>();
    useLayoutEffect(()=>{
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
    return (<div className="align-center m-auto max-w-[95vw] w-min overflow-x-auto p-3 relative">
                {window.innerWidth > 550 && <Button variant="secondary" onClick={resetZoom} className="absolute right-5">Reset</Button>}
                <Line
                    options={options}
                    data={linechartFormatter(data || {y:[], x:[]}, context?.metricState[0].toString())}
                    className="m-auto w-[100vh] sm:w-auto min-h-[50vh] object-contain lg:min-h-[60vh]"
                    ref={chartRef}
                />
            </div>)
}

const TrendView = () => {
    
    // const [display, setDisplay] = useDisplay();
    const [timeline, setTimeline] = useTimeline();
    const [freq, setFreq] = useState("7D");
    // const router = useRouter();
    return(
        <div className="trend-container">
            <div className="header max-w-4xl w-full m-auto p-2 flex justify-center items-center">
                <ToggleGroup className="p-2" defaultValue={"6M"} onValueChange={setTimeline} type="single">
                        <ToggleGroupItem key={"1D"} value={"1D"}>
                            {"1D"}
                        </ToggleGroupItem>
                        <ToggleGroupItem key={"7D"} value={"7D"}>
                            {"7D"}
                        </ToggleGroupItem>
                        <ToggleGroupItem key={"1M"} value={"1M"}>
                            {"1M"}
                        </ToggleGroupItem>
                        <ToggleGroupItem key={"3M"} value={"3M"}>
                            {"3M"}
                        </ToggleGroupItem>
                        <ToggleGroupItem key={"6M"} value={"6M"}>
                            {"6M"}
                        </ToggleGroupItem>
                        <ToggleGroupItem key={"1Y"} value={"1Y"}>
                            {"1Y"}
                        </ToggleGroupItem>
                        <ToggleGroupItem key={"3Y"} value={"3Y"}>
                            {"3Y"}
                        </ToggleGroupItem>
                </ToggleGroup>
                <Select defaultValue={freq} onValueChange={setFreq}>
                            <SelectTrigger className="max-w-20">
                                <SelectValue placeholder="Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key={5} value={"6h"}>6h</SelectItem>
                                <SelectItem key={15} value={"1D"}>1D</SelectItem>
                                <SelectItem key={30} value={"7D"}>7D</SelectItem>
                                <SelectItem key={60} value={"1M"}>1M</SelectItem>
                            </SelectContent>
                </Select>
            </div>
            <Chart old={timeline} freq={freq} />
        </div>
    )
}

export default TrendView;