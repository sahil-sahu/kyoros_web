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
export default function Home() {
  return (
    <main className="">
        <NavBox title={"Overview"}></NavBox>
        <section className="px-2 py-3 max-w-6xl m-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AlertBox />
          <div className="shadow border border-gray-400 rounded-xl p-4 col-span-1">
            <div className="heading lg:flex flex-col justify-between ">
              <h3 className="text-lg font-semibold">
                Occupancy
              </h3>
              <Select defaultValue="today">
                <SelectTrigger className="border-none">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div style={{
              background:"linear-gradient(to bottom right, #7CA7EB .5%, #303778 50%)"
            }} className="flex m-auto justify-center items-center rounded-full w-[7rem] h-[7rem] lg:w-[10rem] lg:h-[10rem]">
              <h4 className="bg-white flex justify-center items-center text-3xl rounded-full text-center w-[5rem] h-[5rem] lg:w-[7rem] lg:h-[7rem]">
                66%
              </h4>
            </div>
          </div>
          <OccupancyTrend></OccupancyTrend>
          <MortalRate />
          <div className="shadow border border-gray-400 col-span-1 rounded-xl p-4 flex flex-col justify-center gap-8">
              <h3 className="lg:text-xl text-lg font-semibold">
                Avg. Patient Stay
              </h3>
              <p className="text-sm md:text-lg">
                  <span className="lg:text-6xl text-4xl lg:px-5">2.7</span> days
              </p>
          </div>
          <div className="shadow border border-gray-400 col-span-1 rounded-xl p-4 flex flex-col justify-center gap-5">
              <h3 className="lg:text-xl text-lg font-semibold">
                At a Glance
              </h3>
              <Link href={`/glance`}>
                <Image className="p-2 m-auto" src={glance} alt="glance"/>
              </Link>
          </div>
        </section>
    </main>
  );
}
