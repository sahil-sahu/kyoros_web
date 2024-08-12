"use client";
import NavBox from "@/components/custom/header/header";
import Image from "next/image";
import Link from "next/link";
// import glance from "@/assets/glancce.png"
import glance from "@/assets/glance.svg"
import PieChart from "@/components/custom/pieChart";
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
import OccupancyTrend from "@/components/custom/overview/OccupancyTrend";
import MortalRate from "@/components/custom/overview/mortalityRate";
import { ArrowBigUp } from "lucide-react";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import PatientStay from "@/components/custom/overview/patientTrend";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { fetchICU } from "./tracking/querys/icuQuery";
import { getMetric, HeaderContext, useMetric } from "./admin/context";
import { useContext, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { ICU } from "@/types/ICU";

interface InsightObj {
  "bedOccupancy": number|null,
  "avgApache": number|null,
  "avgPatientStay": number|null,
  "mortality": number|null
}

const InsightBox = ({insights}:{insights:InsightObj}) =>{
  const context = useContext(HeaderContext)
  const icu = context?.icuState[0]
  
  return (
    <div style={{
      background:"linear-gradient(to bottom right, #303778, #4C8484)"
    }} className="text-white h-full rounded-xl shadow  bg-darkblue p-5 flex flex-col gap-[15%]">
      <h3 className=" text-lg font-semibold">
        Insights
      </h3>
      <div className="flex gap-4 justify-evenly">
        <div className=" text-center">
            <span className="text-3xl flex items-center justify-center">{insights.bedOccupancy || "--"}% {(insights.bedOccupancy || 0) > 0 ? <ArrowUpIcon className="inline" width={50} height={50} />: <ArrowDownIcon className="inline" width={50} height={50} />}</span>
            <small className="block">vs last month</small>
            <h3 className="mt-12 font-semibold">
              Bed Occupancy
            </h3>
        </div>
        <div className=" text-center">
            <span className="text-3xl flex items-center justify-center">{insights.mortality || "--"}% {(insights.mortality || 0) > 0 ? <ArrowUpIcon className="inline" width={50} height={50} />: <ArrowDownIcon className="inline" width={50} height={50} />}</span>
            <small className="block">vs last month</small>
            <h3 className="mt-12 font-semibold">
              Mortality
            </h3>
        </div>
        <div className=" text-center">
            <span className="text-3xl flex items-center justify-center">{insights.avgApache || "--"}% {(insights.avgApache || 0) > 0 ? <ArrowUpIcon className="inline" width={50} height={50} />: <ArrowDownIcon className="inline" width={50} height={50} />}</span>
            <small className="block">vs last month</small>
            <h3 className="mt-12 font-semibold">
              Avg.<br /> Apache III Score
            </h3>
        </div>
        <div className=" text-center">
            <span className="text-3xl flex items-center justify-center">{insights.avgPatientStay || "--"}% {(insights.avgPatientStay || 0) > 0 ? <ArrowUpIcon className="inline" width={50} height={50} />: <ArrowDownIcon className="inline" width={50} height={50} />}</span>
            <small className="block">vs last month</small>
            <h3 className="mt-12 font-semibold">
              Avg.<br /> Patient Stay
            </h3>
        </div>
      </div>
    </div>
  )
}
interface Insights {
  insight: InsightObj;
  occupancy: ICU;
  avgStay: string;
}
const fetchInsights = async ({queryKey}: QueryFunctionContext): Promise<Insights> => {
  const [_,icuId] = queryKey;
  const response = await axiosInstance.get(`/hospital/admin/insights`, {
      params:{icuId},
    });
  return response.data;
};
const useIcu = ():[number,(icu:string)=> void]=>{
  const [icu, setState] = useState<number>(1)
  const setIcu = (icuId:string) =>{
      setState(+icuId)
  }
  return [icu, setIcu];
}
export default function Home() {
  const filterApi = useQuery({ queryKey: ['icu'], queryFn: fetchICU });
  const metricSt = useMetric(getMetric(""))
  const icuSt = useIcu()
  const {data, error, isLoading} = useQuery({queryKey:["insights", icuSt[0]],queryFn:fetchInsights})
  return (
    <main className="">
        <NavBox title={"Overview"}></NavBox>
        <HeaderContext.Provider value={{metricState:metricSt, icuState:icuSt}}>
          <div className="flex justify-end max-w-7xl mt-2 m-auto">
          <Select value={icuSt[0]+""} onValueChange={icuSt[1]}>
                    <SelectTrigger className='w-32'>
                        <SelectValue className='w-24' placeholder="ICU" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* <SelectItem key={"all"} value={"-1"}>All</SelectItem> */}
                        {
                            (filterApi.data || []).map(e => (
                                <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                            ))
                        }
                    </SelectContent>
            </Select>
          </div>
          <section className={"px-2  py-3 m-auto grid grid-cols-2 w-fit lg:grid-cols-5 gap-4 "+(isLoading?"blur-sm":"")}>
            <Link className="col-span-2" href={'/admin'}>
              {data? <InsightBox insights={data.insight} />:(<div style={{
                background:"linear-gradient(to bottom right, #303778, #4C8484)"
              }} className="text-white h-full rounded-xl shadow  bg-darkblue p-5 flex flex-col gap-[15%]">
                <h3 className=" text-lg font-semibold">
                  Insights
                </h3>
                <div className="flex gap-4 justify-evenly">
                  <div className=" text-center">
                      <span className="text-4xl flex items-center justify-center">20% <ArrowUpIcon className="inline" width={50} height={50} /></span>
                      <small className="block">vs last month</small>
                      <h3 className="mt-12 font-semibold">
                        Bed Occupancy
                      </h3>
                  </div>
                  <div className=" text-center">
                      <span className="text-4xl flex items-center justify-center">5% <ArrowDownIcon className="inline" width={50} height={50} /></span>
                      <small className="block">vs last month</small>
                      <h3 className="mt-12 font-semibold">
                        Mortality
                      </h3>
                  </div>
                  <div className=" text-center">
                      <span className="text-4xl flex items-center justify-center">10% <ArrowDownIcon className="inline" width={50} height={50} /></span>
                      <small className="block">vs last month</small>
                      <h3 className="mt-12 font-semibold">
                        Avg.<br /> Apache III Score
                      </h3>
                  </div>
                  <div className=" text-center">
                      <span className="text-4xl flex items-center justify-center">15% <ArrowDownIcon className="inline" width={50} height={50} /></span>
                      <small className="block">vs last month</small>
                      <h3 className="mt-12 font-semibold">
                        Avg.<br /> Patient Stay
                      </h3>
                  </div>
                </div>
              </div>)}
            </Link>
            <Link className="2xl:aspect-square" href={'/occupancy'}>
            <div className="shadow border border-gray-400 h-full rounded-xl p-4 col-span-1">
              <div className="heading lg:flex flex lg:flex-row flex-col justify-between items-center">
                <h3 className="text-lg font-semibold inline">
                  Bed Occupancy
                </h3>
              </div>
              <div style={{
              background:`linear-gradient(to bottom right, #303778 ${(data?.occupancy.filled || 0)*100/(data?.occupancy.total || 0)}%, #7CA7EB)`
            }} className="flex m-auto lg:mt-4 justify-center items-center rounded-full w-[6rem] h-[6rem] lg:w-[10rem] lg:h-[10rem]">
              <h4 className="bg-white flex justify-center items-center text-3xl rounded-full text-center w-[4rem] h-[4rem] lg:w-[7.5rem] lg:h-[7.5rem]">
                {(data?.occupancy.filled || 0)*100/(data?.occupancy.total || 0)}%
              </h4>
            </div>
              <ul className="flex align-top justify-evenly mt-3">
                <li className="flex items-center flex-col">
                  <h3 className="text-3xl">{(data?.occupancy.filled || 0)}</h3>
                  <p>Occupied</p>
                </li>
                <li className="flex items-center flex-col">
                  <h3 className="text-3xl">{(data?.occupancy.total || 0)-(data?.occupancy.filled || 0)}</h3>
                  <p>Free</p>
                </li>
              </ul>
            </div>
            </Link>
            <OccupancyTrend></OccupancyTrend>
            <MortalRate />
            <div className="shadow border 2xl:aspect-square border-gray-400 col-span-1 rounded-xl p-5 relative flex flex-col gap-8">
            <div className="heading flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Avg. Patient Stay
                </h3>
                {/* <Select defaultValue="today">
                  <SelectTrigger className="border-none w-1/2">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="today">This week</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>
                <p className="text-sm md:text-lg absolute self-center justify-self-center top-1/2 origin-bottom">
                    <span className="lg:text-6xl text-4xl lg:px-5">{data?.avgStay}</span> days
                </p>
            </div>
            <PatientStay></PatientStay>
          </section>
        </HeaderContext.Provider>
    </main>
  );
}
