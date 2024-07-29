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
import { useQuery } from "@tanstack/react-query";
import { fetchICU } from "./tracking/querys/icuQuery";

export default function Home() {
  const filterApi = useQuery({ queryKey: ['icu'], queryFn: fetchICU });
  return (
    <main className="">
        <NavBox title={"Overview"}></NavBox>
        <div className="flex justify-end max-w-7xl mt-2 m-auto">
        <Select>
                  <SelectTrigger className='w-32'>
                      <SelectValue className='w-24' placeholder="ICU" />
                  </SelectTrigger>
                  <SelectContent>
                      {/* <SelectItem key={"none"} value={"none"}>All</SelectItem> */}
                      {
                          (filterApi.data || []).map(e => (
                              <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                          ))
                      }
                  </SelectContent>
          </Select>
        </div>
        <section className="px-2 py-3 m-auto grid grid-cols-2 w-fit lg:grid-cols-5 gap-4">
          <Link className="col-span-2" href={'/request-notify'}>
            <div style={{
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
            </div>
          </Link>
          <Link className="aspect-square" href={'/occupancy'}>
          <div className="shadow border border-gray-400 h-full rounded-xl p-4 col-span-1">
            <div className="heading lg:flex flex lg:flex-row flex-col justify-between items-center">
              <h3 className="text-lg font-semibold inline">
                Bed Occupancy
              </h3>
            </div>
            <div style={{
              background:"linear-gradient(to bottom right, #7CA7EB .5%, #303778 50%)"
            }} className="flex m-auto lg:mt-4 justify-center items-center rounded-full w-[6rem] h-[6rem] lg:w-[8rem] lg:h-[8rem]">
              <h4 className="bg-white flex justify-center items-center text-3xl rounded-full text-center w-[4rem] h-[4rem] lg:w-[6rem] lg:h-[6rem]">
                66%
              </h4>
            </div>
            <ul className="flex align-top justify-evenly mt-3">
              <li className="flex items-center flex-col">
                <h3 className="text-3xl">15</h3>
                <p>Occupied</p>
              </li>
              <li className="flex items-center flex-col">
                <h3 className="text-3xl">5</h3>
                <p>Free</p>
              </li>
            </ul>
          </div>
          </Link>
          <OccupancyTrend></OccupancyTrend>
          <MortalRate />
          <div className="shadow border aspect-square border-gray-400 col-span-1 rounded-xl p-5 relative flex flex-col gap-8">
          <div className="heading flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Avg. Patient Stay
              </h3>
              <Select defaultValue="today">
                <SelectTrigger className="border-none w-1/2">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="today">This week</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                </SelectContent>
              </Select>
            </div>
              <p className="text-sm md:text-lg absolute self-center justify-self-center top-1/2 origin-bottom">
                  <span className="lg:text-6xl text-4xl lg:px-5">2.7</span> days
              </p>
          </div>
          <PatientStay></PatientStay>
        </section>
    </main>
  );
}
