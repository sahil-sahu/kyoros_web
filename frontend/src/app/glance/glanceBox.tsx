import { Toggle } from "@/components/ui/toggle"
import { GlanceInfo } from "@/types/glance";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { pintheGlance, unpinGlance } from "@/lib/pintoGlance";
import { getDateDifferenceFromNow } from "@/lib/daysCalc";
import { PatientInfoProps } from "@/types/pateintinfo";
import Criticality from "@/components/custom/criticality";
import { alertCheck } from "./alertChecker";
import { useRouter } from "next/navigation";

const InfoBox = ({patient}:{patient:PatientInfoProps;}) =>{
    return (
        <div className="grid grid-cols-2 justify-between text-center capitalize">
            <h1 className="font-semibold col-span-2">{patient.name}</h1>
            <h2 className="text-sm">{patient.age}</h2>
            <h3 className="text-sm">{patient.gender}</h3>
        </div>
    )
}
const GlanceBox = ({data, pinned, refresh}:{data:GlanceInfo; pinned:boolean; refresh:Dispatch<SetStateAction<number>>}) =>{
    const level = alertCheck(data.latest);
    const log = data.latest;
    const router = useRouter()
    const [criticality, setCriticality] = useState(data.apache);
    if(!log || (log && log.patientId != data.patientId)){
        return(
            <div onClick={(e)=>{
                let ele:any = e.target;
                if(ele?.id == "noeffect") return;
                router.push(`/tracking?patient=${data.patientId}&icu=${data.icuId}&bed=${data.id}`)}
                } className={`${level[1]} cursor-pointer flex flex-col gap-2 p-2 border-2 w-[100%] h-[100%]`}>
                <div className="flex justify-evenly items-center">
                    <Toggle id="noeffect" pressed={pinned} className={pinned? "!bg-bluecustom": "bg-transparent"} onPressedChange={(e)=>{e?pintheGlance(data.patientId):unpinGlance(data.patientId);refresh(new Date().getMilliseconds());}} variant="outline">{pinned?(
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="#e8eaed"
                            viewBox="0 -960 960 960"
                            id="noeffect"
                            >
                            <path id="noeffect" d="M680-840v80h-40v327l-80-80v-247H400v87l-87-87-33-33v-47h400zM480-40l-40-40v-240H240v-80l80-80v-46L56-792l56-56 736 736-58 56-264-264h-6v240l-40 40zM354-400h92l-44-44-2-2-46 46zm126-193zm-78 149z"></path>
                            </svg>
                        ):(
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="20"
                        fill="none"
                        viewBox="0 0 12 20"
                        id="noeffect"
                      >
                        <path
                          fill="#2F377A"
                          id="noeffect"
                          d="M10 9l2 2v2H7v6l-1 1-1-1v-6H0v-2l2-2V2H1V0h10v2h-1v7zm-7.15 2h6.3L8 9.85V2H4v7.85L2.85 11z"
                        ></path>
                      </svg>
                    )}</Toggle>
                <div className="py-6 px-3 text-center flex items-center rounded bg-bluecustom h-1">
                    <Link href={`/tracking?patient=${data.patientId}&icu=${data.icuId}&bed=${data.id}`} >
                    <h3 className="text-white">
                    {data.name}
                    </h3>
                    </Link>
                </div>
                <div className="sm:flex hidden flex-col gap-0 items-center justify-between">
                    <InfoBox patient={data.patient} />
                    <Criticality g_criticality={criticality} setCriticality={setCriticality} data={data} />
                </div>
            </div>
            <div className="grid-cols-3 grid justify-evenly items-center">
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-c_lg_blue text-lg">
                        {data.bedStamp ? getDateDifferenceFromNow(data.bedStamp): "--"}
                    </p>
                    <h3 className="text-sm leading-none">
                        Days
                    </h3>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <h3 className="text-sm">
                        BP
                    </h3>
                    <p className="text-c_lg_blue text-lg">
                        {`-- / --`}
                    </p>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-c_lg_blue text-lg">
                        --
                    </p>
                    <h3 className="text-sm leading-none">
                        Heart Rate
                    </h3>
                </div>
            </div>
            <div className="grid-cols-3 grid justify-evenly items-center">
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-c_lg_blue text-lg">
                        --
                    </p>
                    <h3 className="text-sm leading-none">
                        SPO2
                    </h3>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-c_lg_blue text-lg">
                        --
                    </p>
                    <h3 className="text-sm leading-none">
                        Resp Rate
                    </h3>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-c_lg_blue text-lg">
                        --
                    </p>
                    <h3 className="text-sm leading-none">
                        Temp
                    </h3>
                </div>
            </div>
        </div>
        )
    }
    return (
        <div onClick={(e)=>{
            let ele:any = e.target;
            if(ele?.id == "noeffect") return;
            router.push(`/tracking?patient=${data.patientId}&icu=${data.icuId}&bed=${data.id}`)}
            } className={`${level[1]} cursor-pointer flex flex-col gap-2 p-2 border-2 w-[100%] h-[100%]`}>
            <div className="flex justify-evenly items-center">
                <Toggle id="noeffect" pressed={pinned} className={pinned? "!bg-bluecustom": "bg-transparent"} onPressedChange={(e)=>{e?pintheGlance(data.patientId):unpinGlance(data.patientId);refresh(new Date().getMilliseconds());}} variant="outline">{pinned?(
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="#e8eaed"
                        viewBox="0 -960 960 960"
                        id="noeffect"
                        >
                        <path id="noeffect" d="M680-840v80h-40v327l-80-80v-247H400v87l-87-87-33-33v-47h400zM480-40l-40-40v-240H240v-80l80-80v-46L56-792l56-56 736 736-58 56-264-264h-6v240l-40 40zM354-400h92l-44-44-2-2-46 46zm126-193zm-78 149z"></path>
                        </svg>
                    ):(
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="20"
                    fill="none"
                    viewBox="0 0 12 20"
                    id="noeffect"
                  >
                    <path
                      fill="#2F377A"
                      id="noeffect"
                      d="M10 9l2 2v2H7v6l-1 1-1-1v-6H0v-2l2-2V2H1V0h10v2h-1v7zm-7.15 2h6.3L8 9.85V2H4v7.85L2.85 11z"
                    ></path>
                  </svg>
                )}</Toggle>
                <div className="py-6 px-3 text-center flex items-center rounded bg-bluecustom h-1">
                    <Link href={`/tracking?patient=${data.patientId}&icu=${data.icuId}&bed=${data.id}`} >
                    <h3 className="text-white">
                    {data.name}
                    </h3>
                    </Link>
                </div>
                <div className="sm:flex flex-col gap-0 items-center hidden justify-between">
                    <InfoBox patient={data.patient} />
                    <Criticality g_criticality={criticality} setCriticality={setCriticality} data={data} />
                </div>
            </div>
            <div className="grid-cols-3 grid justify-evenly items-center">
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-c_lg_blue text-sm sm:text-lg">
                    {data.bedStamp ? getDateDifferenceFromNow(data.bedStamp): "--"}
                    </p>
                    <h3 className="sm:text-sm text-xs leading-none">
                        Days
                    </h3>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <h3 className="sm:text-sm text-xs">
                        BP
                    </h3>
                    <p className="text-c_lg_blue text-sm sm:text-lg">
                        {`${log.bp[0]} / ${log.bp[1]}`}
                    </p>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-c_lg_blue text-sm sm:text-lg">
                        {log.heart_rate}
                    </p>
                    <h3 className="sm:text-sm text-xs leading-none">
                        Heart Rate
                    </h3>
                </div>
            </div>
            <div className="grid-cols-3 grid justify-evenly items-center">
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-c_lg_blue text-sm sm:text-lg">
                        {log.spo2}
                    </p>
                    <h3 className="sm:text-sm text-xs leading-none">
                        SPO2
                    </h3>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-c_lg_blue text-sm sm:text-lg">
                        {log.resp_rate}
                    </p>
                    <h3 className="sm:text-sm text-xs leading-none">
                        Resp Rate
                    </h3>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-c_lg_blue text-sm sm:text-lg">
                        {log.temp}
                    </p>
                    <h3 className="sm:text-sm text-xs leading-none">
                        Temp
                    </h3>
                </div>
            </div>
        </div>
    );
}



export default GlanceBox;