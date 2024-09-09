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
import { fetchMetric } from "@/app/admin/queries/getVals";
import { useContext, useState } from "react";
import { HeaderContext } from "@/app/admin/context";
import { useQuery } from "@tanstack/react-query";
import { linechartFormatter } from "@/app/admin/lineChartFormatter";
import Link from "next/link";
const dt = new Date();
    dt.setHours(0,0,0,0)
    dt.setMonth(dt.getMonth()-1)
    const lt = new Date();
    lt.setHours(0,0,0,0)
    lt.setMonth(dt.getMonth()-6)
const OccupancyTrend = () =>{
    const context = useContext(HeaderContext);
    const [old, setold] = useState(dt.toISOString())
    const { data, isLoading, refetch, error } = useQuery({queryKey:["admin",context?.icuState[0],"occupancy", old, "7D"], queryFn:fetchMetric});
    return (
    <Link href={"/admin/?metric=occupancy"} className="shadow border border-gray-400 rounded-xl lg:order-3 order-4 p-4 py-5 lg:pt-3 col-span-2">
        <div className="heading flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Occupancy Trend
          </h3>
          <Select value={old} onValueChange={setold}>
            <SelectTrigger className="border-none w-1/3">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={dt.toISOString()}>This Month</SelectItem>
                <SelectItem value={lt.toISOString()}>Last 6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="lg:h-[13rem] ">
            <Line className="lg:h-[13rem] lg:w-auto md:w-2/3 m-auto" options={{...options, responsive:true}} data={linechartFormatter(data || {y:[], x:[]}, "Occupancy")}></Line>
        </div>
      </Link>)
}

export default OccupancyTrend;