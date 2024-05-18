import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { PatientInfoType, PatientRealtimeObj, Timeline } from "@/types/pateintinfo";
import { useRef, useState } from "react";
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
const TrendView = () => {

    const [display, changeDisplay] = useState<PatientInfoType>(PatientInfoType.bpm);
    const [data, setData] = useState<PatientRealtimeObj[]>(dummyData);
    const timeline = useRef<Timeline>(Timeline.m30);

    return(
        <div className="trend-container">
            <div className="header max-w-xl m-auto p-2">
                <Select defaultValue={PatientInfoType.bpm} onValueChange={(val:PatientInfoType) => changeDisplay(val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="ICU" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={PatientInfoType.bp}>BP</SelectItem>
                        <SelectItem value={PatientInfoType.bpm}>Pulse</SelectItem>
                        <SelectItem value={PatientInfoType.spo2}>SpO2</SelectItem>
                        <SelectItem value={PatientInfoType.temp}>Temperature</SelectItem>
                    </SelectContent>
                </Select>
                <ToggleGroup className="p-2" defaultValue={Timeline.m30} onValueChange={(e:Timeline) => {timeline.current = e}} type="single">
                    {Object.entries(Timeline).map(([key, val]) => (
                        <ToggleGroupItem key={key} value={val}>
                            {val}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>
            <div className="align-center w-100 overflow-x-auto p-3">
                <Line
                    options={options}
                    data={linechartFormatter(display,data)}
                    className="m-auto min-h-[50vh]"
                />
            </div>
        </div>
    )
}

export default TrendView;