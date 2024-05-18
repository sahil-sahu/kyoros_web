"use client"
import NavBox from "@/components/custom/header/header";
import {  useState } from "react";
import TrackingHeader from "./trackingHeader";
import LiveView from "./liveView";
import Link from "next/link";
import folder_i from "./folder.png"
import phone_i from "./phone.png"
import Image from "next/image";
import TrendView from "./trend";
import { LiveTrend } from "@/types/types";




const Tracking = () =>{
    const [ICU, ICUSet]  = useState<String>("");
    const [Bed, BedSet]  = useState<String>("");
    const [displayType, displayTypeSet]  = useState<LiveTrend>(LiveTrend.Live);
    return (
        <main >
            <NavBox title={"Tracking"}></NavBox>
            <section className='p-2'>
                <TrackingHeader ICURef={ICUSet} BedRef={BedSet} TypeRef={displayTypeSet}/>
                {
                    displayType === LiveTrend.Live?
                        <LiveView />
                    :<TrendView />
                }
            </section>
            <section style={{transform:"translateX(-50%)", zIndex:100}} className="fixed left-1/2 bottom-0 flex justify-evenly max-w-lg m-auto items-end text-center w-full">
                <Link className="border-solid border-bluecustom text-bluecustom" href={"#"}>
                    <h3 className="text-4xl">3</h3>
                    <p>Alerts</p>
                </Link>
                <Link className="border-solid border-bluecustom text-bluecustom" href={"#"}>
                    <Image src={folder_i} alt={"📂"} />
                    <p>Alerts</p>
                </Link>
                <Link className="border-solid border-bluecustom text-bluecustom" href={"#"}>
                    <Image src={phone_i} alt={"📞"} />
                    <p>Alerts</p>
                </Link>
            </section>
        </main>
    );
}

export default Tracking;