import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { ICUInfo, bedInfo } from "@/types/ICU";
import { LiveTrend } from "@/types/types";
import { useSearchParams, useRouter } from "next/navigation";

import { Dispatch, SetStateAction, useState } from "react"
export default function TrackingHeader({icusInfo}:{icusInfo:ICUInfo[]}){
    const router = useRouter()
    const searchParams = useSearchParams();
    const icu = searchParams.get('icu') ?? "0";
    const type = searchParams.get('type') == LiveTrend.Trend ? LiveTrend.Trend : LiveTrend.Live;
    const bed = parseInt((searchParams.get('bed') ?? "0"));
    const [ICU, ICUSet]  = useState<ICUInfo>(icusInfo.find(e => parseInt(icu) == e.id) ?? icusInfo[0]);
    const [Bed, BedSet]  = useState<bedInfo|undefined>(ICU.beds.find(e => e.id == bed));
    const setICU = (val:string) =>{
        const icu = icusInfo.find(e => (parseInt(val) ?? 0) == e.id);
        if(icu) ICUSet(icu);
    }

    const setBed = (val:string) =>{
        const bed = ICU?.beds.find(e => (parseInt(val) ?? 0) == e.id);
        router.push(`/tracking?icu=${ICU?.id}&bed=${bed?.id}&patient=${bed?.patient.id}&type=${type}`)
    }
    return(
        <header className="p-2 m-auto max-w-md gap-1 flex justify-evenly items-center">
                    <Select onValueChange={setICU} defaultValue={ICU?.id.toString()}>
                        <SelectTrigger>
                            <SelectValue placeholder="ICU" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                icusInfo.map(e => (
                                    <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Select defaultValue={Bed?.id.toString()} onValueChange={setBed}>
                        <SelectTrigger>
                            <SelectValue placeholder="Bed" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                ICU.beds.map(e => (
                                    <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Select defaultValue={type} onValueChange={(e:LiveTrend) => router.push(`/tracking?icu=${ICU?.id}&bed=${Bed?.id}&patient=${Bed?.patient.id}&type=${e}`)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Display Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={LiveTrend.Live}>Live</SelectItem>
                            <SelectItem value={LiveTrend.Trend}>Trend</SelectItem>
                        </SelectContent>
                    </Select>
                </header>
    )

}