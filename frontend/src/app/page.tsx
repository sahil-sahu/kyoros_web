import NavBox from "@/components/custom/header/header";
import Image from "next/image";
import Link from "next/link";
import glance from "@/assets/glancce.png"
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
              <h3 className="text-lg text-gray-700">
                Critical Patients
              </h3>
            </div>
            <div>
              <div className="relative flex items-center justify-center">
              <svg className="transform rotate-45">
                <circle cx="50%" cy="50%" r="45px" fill="none" stroke="#E2E8F0" stroke-width="8"></circle>
                <circle cx="50%" cy="50%" r="45px" fill="none" stroke="var(--background)" stroke-width="8" 
                        stroke-dasharray="calc(2 * 3.14 * 45 * 0.01 * 73) calc(2 * 3.14 * 45)"></circle>
              </svg>
              <h1 className="text-2xl absolute font-semibold text-gray-700">
                73%
              </h1>
              </div>
              <h3 className="text-lg leading-[0] text-gray-700">
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
              <h3 className="text-lg text-gray-700">
                Average Patient Stay
              </h3>
            </div>
            <div>
              <Link href={'/glance'} className="flex items-center flex-col justify-center">
                <Image src={glance} width={80} alt=""/>
                <h3 className="text-lg text-gray-700">
                  At a glance
                </h3>
              </Link>
            </div>
          </div>
        </section>
        <section className="container">
          <p>
            Go to <Link className="text-tahiti underline" href={'/doctor'}>Doctor&apos;s Page</Link>
          </p>
          <p>
            Go to <Link className="text-tahiti underline" href={'/nurse'}>Nurse&apos;s Page</Link>
          </p>
          <p>
            Go to <Link className="text-tahiti underline" href={'/request-notify'}>Subscribe to notification service</Link>
          </p>
        </section>
    </main>
  );
}
