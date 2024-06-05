import NavBox from "@/components/custom/header/header";
import Image from "next/image";
import Link from "next/link";
import glance from "@/assets/glancce.png"
import PieChart from "@/components/custom/pieChart";
export default function Home() {
  return (
    <main className="">
        <NavBox title={"Overview"}></NavBox>
        <section className="container">
          <div style={{
            height:160,
            width:160,
            alignItems: "center",
            boxShadow:"inset 0 5px 2px rgba(0, 0, 0, 0.2)"
          }} className="flex m-auto flex-col justify-center rounded-full my-3 bg-gray-300">
            <h1 className="text-7xl font-semibold text-bluecustom">
              4
            </h1>
            <h3 className="text-lg text-gray-500">
              Alerts
            </h3>
          </div>

          <div className="m-auto p-3 text-center grid grid-cols-2 gap-3 items-center">
            <div>
              <h1 className="text-5xl font-semibold text-bluecustom">
                2
              </h1>
              <h3 className="text text-gray-700">
                Critical Patients
              </h3>
            </div>
            <div>
              <PieChart perct={75} rad={45}></PieChart>
              <h3 className="text leading-[0] text-gray-700">
                Occupancy
              </h3>
            </div>
            <div>
              <h1 className="text-5xl font-semibold text-bluecustom">
                2.7
                <span className="text-lg block">
                  days
                </span>
              </h1>
              <h3 className="text text-gray-700">
                Average Patient Stay
              </h3>
            </div>
            <div>
              <Link href={'/glance'} className="flex items-center flex-col justify-center">
                <Image src={glance} width={80} alt=""/>
                <h3 className="text text-gray-700">
                  At a glance
                </h3>
              </Link>
            </div>
          </div>
        </section>
    </main>
  );
}
