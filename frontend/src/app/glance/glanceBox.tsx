import Image from "next/image";
import { PatientRealtimeObj } from "@/types/pateintinfo"
import pin_img from "./pin.png"
import { Toggle } from "@/components/ui/toggle"
import { GlanceInfo } from "@/types/glance";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { pintheGlance, unpinGlance } from "@/lib/pintoGlance";
import { set } from "react-hook-form";
const GlanceBox = ({data, pinned, refresh}:{data:GlanceInfo; pinned:boolean; refresh:Dispatch<SetStateAction<boolean>>}) =>{
    const critical = false;
    const log = data.bedLogs[0];
    if(!log){
        return(
            <div className={`${critical? "border-dashed border-red-500":"border-solid" } border-2 w-[100%] h-[100%] p-1`}>
            <div className="flex justify-evenly items-center mb-2">
                <Toggle pressed={pinned} onPressedChange={(e)=>{e?pintheGlance(data.patientId):unpinGlance(data.patientId);refresh(e);}} variant="outline"><Image src={pin_img} alt="📌" className={"border-dotted border-bluecustom"}/></Toggle>
                <div className="py-6 px-3 text-center flex items-center rounded bg-bluecustom h-1">
                    <Link href={`/tracking?patient=${data.patientId}&icu=${data.icuId}&bed=${data.id}`} >
                    <h3 className="text-white">
                        {data.name}
                    </h3>
                    </Link>
                </div>
            </div>
        </div>
        )
    }
    return (
        <div className={`${critical? "border-dashed border-red-500":"border-solid" } border-2 w-[100%] h-[100%] p-1`}>
            <div className="flex justify-evenly items-center mb-2">
                <Toggle pressed={pinned} onPressedChange={(e)=>{e?pintheGlance(data.patientId):unpinGlance(data.patientId);refresh(e);}} variant="outline"><Image src={pin_img} alt="📌" className={"border-dotted border-bluecustom"}/></Toggle>
                <div className="py-6 px-3 text-center flex items-center rounded bg-bluecustom h-1">
                    <Link href={`/tracking?patient=${data.patientId}&icu=${data.icuId}&bed=${data.id}`} >
                    <h3 className="text-white">
                    {data.name}
                    </h3>
                    </Link>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <h3 className="text-sm">
                        BP
                    </h3>
                    <p className="text-bluecustom text-lg">
                        {`${log.bp[0]} / ${log.bp[1]}`}
                    </p>
                </div>
            </div>
            <div className="flex justify-evenly items-center">
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-bluecustom text-lg">
                        {log.spo2}
                    </p>
                    <h3 className="text-sm leading-none">
                        SPO2
                    </h3>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-bluecustom text-lg">
                        {log.heart_rate}
                    </p>
                    <h3 className="text-sm leading-none">
                        Pulse
                    </h3>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-bluecustom text-lg">
                        {log.temp}
                    </p>
                    <h3 className="text-sm leading-none">
                        Temp
                    </h3>
                </div>
            </div>
        </div>
    );
}

export default GlanceBox;