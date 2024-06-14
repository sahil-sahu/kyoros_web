'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
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
  
  
  import AlertBox from "@/components/custom/overview/alertBox";
  import { options } from "@/lib/linechartformatter";
import { Percent } from "lucide-react";

const OccupancyTrend = () =>{
    return (<div className="shadow border border-gray-400 rounded-xl p-4 py-5 lg:pt-3 col-span-2">
        <div className="heading flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Occupancy Trend
          </h3>
          <Select defaultValue="today">
            <SelectTrigger className="border-none w-1/3">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="today">This week</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="lg:h-[13rem] ">
            <Line className="lg:h-[13rem] lg:w-auto md:w-2/3 m-auto" options={{...options, responsive:true}} data={{
                                        labels:["Mon","Tue","Wed", "Thu", "Fri", "Sat", "Sun"],
                                        datasets: [
                                        {
                                            label:"Percent",
                                            data:[35,85,65,48,84,75,55],
                                            fill: false,
                                            pointRadius: 3,
                                            pointHitRadius: 10,
                                            borderColor: '#2F377A',
                                            backgroundColor: '#2F377A',
                                            tension:.3
                                        },
                                        ],
                                    }}></Line>
        </div>
      </div>)
}

export default OccupancyTrend;