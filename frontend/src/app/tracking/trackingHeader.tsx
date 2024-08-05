import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast";
import { ICUInfo, bedInfo } from "@/types/ICU";
import { HealthParameter, PatientInfoType } from "@/types/pateintinfo";
import { LiveTrend } from "@/types/types";
import { ToastAction } from "@radix-ui/react-toast";
import { useRouter as _useRouter } from "next/router";
import { useSearchParams, useRouter } from "next/navigation";

import { Dispatch, SetStateAction, useEffect, useState } from "react"
export default function TrackingHeader({icusInfo}:{icusInfo:ICUInfo[]}){
    const {toast} = useToast();
    const router = useRouter()
    const router_2 = _useRouter
    const searchParams = useSearchParams();
    const icu = searchParams.get('icu') ?? "0";
    const bed = parseInt((searchParams.get('bed') ?? "0"));
    const type = searchParams.get('type') == LiveTrend.Trend ? LiveTrend.Trend : LiveTrend.Live;
    const _param = PatientInfoType.find((e) => searchParams.get('vital') == e) ?? PatientInfoType[1];
    const [ICU, ICUSet]  = useState<ICUInfo>(icusInfo.find(e => parseInt(icu) == e.id) ?? icusInfo[0]);
    const [Bed, BedSet]  = useState<bedInfo|undefined>();
    const [trendtype, typeSet]  = useState<LiveTrend>(type);
    const [param, setParam] = useState(_param);
    const setICU = (val:string) =>{
        const icu = icusInfo.find(e => (parseInt(val) ?? 0) == e.id);
        if(icu) ICUSet(icu);
    }
    const setBed = (val:string) => {
        const bed = ICU?.beds.find(e => (parseInt(val) ?? 0) == e.id);
        router.push(`/tracking?icu=${ICU?.id}&bed=${bed?.id}&patient=${bed?.patientId}&type=${trendtype}&vital=${param}`);
    }
    useEffect(()=>{
        typeSet(type)
    },[type])
    useEffect(()=>{
        BedSet(ICU.beds.find(e => e.id == bed))
    },[ICU, bed])
    return(
        <header className={`p-2 m-auto max-w-5xl gap-2 grid grid-cols-2 justify-stretch w-full items-center ${trendtype == LiveTrend.Trend? "md:grid-cols-4": "md:grid-cols-2  !max-w-xl"}`}>
                    <Select onValueChange={setICU} defaultValue={ICU?.id.toString()}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select ICU" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                icusInfo.map(e => (
                                    <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Select value={Bed?.id.toString()} onValueChange={setBed}>

                        <SelectTrigger>
                            <SelectValue placeholder="Select Bed" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                ICU.beds.map(e => (
                                    <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    {type == LiveTrend.Trend && <Select defaultValue={LiveTrend.Trend} onValueChange={(e:LiveTrend) => {
                        typeSet(LiveTrend[e])
                        if(Bed?.id === undefined){
                            return toast({
                                title: "Configuration Error",
                                description: "Please Select the bed Initially",
                                variant: "destructive",
                                duration: 5000,
                            })
                        }
                        router.push(`/tracking?icu=${ICU?.id}&bed=${Bed?.id}&patient=${Bed?.patientId}&type=${e}&vital=${param}`)    
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Display Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={LiveTrend.Live}>Live</SelectItem>
                            <SelectItem value={LiveTrend.Trend}>Trend</SelectItem>
                        </SelectContent>
                    </Select>}
                    {type == LiveTrend.Trend && (
                        <Select defaultValue={param} onValueChange={(val:HealthParameter) => {
                                const currentParams = new URLSearchParams(searchParams);
                                currentParams.set('vital', val);
                                setParam(val)
                                router.push('/tracking?'+currentParams.toString());
                            }}>
                            <SelectTrigger>
                                <SelectValue placeholder="ICU" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    PatientInfoType.map(e => (
                                        <SelectItem key={e} value={e}>{e}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    )}
                </header>
    )

}