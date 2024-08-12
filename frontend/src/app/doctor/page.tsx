import NavBox from "@/components/custom/header/header";
import Image from "next/image";
import Link from "next/link";
// import glance from "@/assets/glancce.png"
import glance from "@/assets/glance.svg"
import settings from "@/assets/settings.svg"
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
import upload_i from "../nurse/image 112.png"
import OverViewTable from "@/components/custom/overview/table";
export default function Home() {
  return (
    <main className="p-5 pt-0">
        <NavBox title={"Overview"}></NavBox>
        <section className="m-auto p-2 grid grid-cols-2 lg:w-full w-fit lg:max-w-7xl items-stretch lg:grid-cols-4 gap-4">
          <div>
          <Link className="h-auto" href={'/request-notify'}>
            <AlertBox />
          </Link>
          </div>
          <Link className="h-full" href={'/occupancy'}>
          <div className="shadow border h-full sm:aspect-square border-gray-400 rounded-xl p-4 col-span-1">
            <div className="heading lg:flex flex lg:flex-row flex-col justify-between items-center">
              <h3 className="sm:text-lg font-semibold inline">
                Bed Occupancy
              </h3>
            </div>
            <div style={{
              background:"linear-gradient(to bottom right, #7CA7EB .5%, #303778 50%)"
            }} className="flex m-auto lg:mt-4 justify-center items-center rounded-full w-[5.3rem] h-[5.3rem] sm:w-[6rem] sm:h-[6rem] lg:w-[10rem] lg:h-[10rem]">
              <h4 className="bg-white flex justify-center items-center lg:text-3xl text-2xl rounded-full text-center w-[3.7rem] h-[3.7rem] sm:w-[4.5rem] sm:h-[4.5rem] lg:w-[7rem] lg:h-[7rem]">
                66%
              </h4>
            </div>
            <ul className="align-top hidden sm:flex justify-evenly mt-3">
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
          {/* <OccupancyTrend></OccupancyTrend>
          <MortalRate />
          <div className="shadow border border-gray-400 col-span-1 rounded-xl p-5 relative flex flex-col gap-8">
              <h3 className="lg:text-xl text-lg font-semibold">
                Avg. Patient Stay
              </h3>
              <p className="text-sm md:text-lg absolute self-center justify-self-center top-1/2 origin-bottom">
                  <span className="lg:text-6xl text-4xl lg:px-5">2.7</span> days
              </p>
          </div> */}
          <Link className="shadow border border-gray-400 col-span-1 min-h-[12rem] rounded-xl p-5 flex flex-col gap-5 relative" href={`/glance`}>
              <h3 className="lg:text-xl text-lg font-semibold">
                At a Glance
              </h3>
              <Image className="justify-self-center top-[10%] self-center origin-center max-h-[10rem] p-2 m-auto h-full w-3/4" src={glance} alt="glance"/>
          </Link>
          <Link className="shadow border border-gray-400 col-span-1 min-h-[12rem] rounded-xl p-5 flex flex-col gap-5 relative" href={`/registrations`}>
              <h3 className="lg:text-xl text-lg font-semibold">
                Admin Panel
              </h3>
              <Image className="justify-self-center top-[10%] self-center origin-center max-h-[10rem] p-2 m-auto h-full w-3/4" src={settings} alt="Settings"/>
          </Link>
        </section>
        <OverViewTable />
    </main>
  );
}
