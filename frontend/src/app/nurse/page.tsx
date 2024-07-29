import NavBox from "@/components/custom/header/header";
import Image from "next/image";
import Link from "next/link";
// import glance from "@/assets/glancce.png"
import glance from "@/assets/glance.svg"

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
import AlertBox from "@/components/custom/overview/alertBox";
import upload_i from "./image 112.png"
import OverViewTable from "@/components/custom/overview/table";
import UploadBox from "./upload";
export default function Home() {
  return (
    <main className="">
        <NavBox title={"Overview"}></NavBox>
        <section className="px-2 py-3  m-auto w-fit grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link className="" href={'/request-notify'}>
            <AlertBox />
          </Link>
          <Link href={'/occupancy'}>
          <div className="shadow border border-gray-400 h-full rounded-xl p-4 col-span-1">
            <div className="heading lg:flex flex lg:flex-row flex-col justify-between items-center">
              <h3 className="text-lg font-semibold inline">
                Bed Occupancy
              </h3>
            </div>
            <div style={{
              background:"linear-gradient(to bottom right, #7CA7EB .5%, #303778 50%)"
            }} className="flex m-auto lg:mt-4 justify-center items-center rounded-full w-[7rem] h-[7rem] lg:w-[10rem] lg:h-[10rem]">
              <h4 className="bg-white flex justify-center items-center text-3xl rounded-full text-center w-[5rem] h-[5rem] lg:w-[7rem] lg:h-[7rem]">
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
          <UploadBox patientId={undefined}>
                  <div className="shadow border cursor-pointer border-gray-400 col-span-1 min-h-[12rem] rounded-xl p-5 flex flex-col gap-5 relative">
                    <h3 className="lg:text-xl text-lg font-semibold">
                        Upload Docs
                    </h3>
                    <Image className="justify-self-center object-contain top-[10%] self-center origin-center max-h-[10rem] p-5 m-auto h-full w-3/4" src={upload_i} alt="Upload"/>
                  </div>
          </UploadBox>
          <OverViewTable />
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
          {/* <Link className="shadow border border-gray-400 col-span-1 min-h-[12rem] rounded-xl p-5 flex flex-col gap-5 relative" href={`/glance`}>
              <h3 className="lg:text-xl text-lg font-semibold">
                At a Glance
              </h3>
              <Image className="justify-self-center top-[10%] self-center origin-center max-h-[10rem] p-2 m-auto h-full w-3/4" src={glance} alt="glance"/>
          </Link> */}
        </section>
    </main>
  );
}
