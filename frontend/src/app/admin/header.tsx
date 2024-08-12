import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast";
import { useRouter as _useRouter } from "next/router";
import { useContext } from "react";
import { HeaderContext, metric } from "./context";
import { useQuery } from "@tanstack/react-query";
import { fetchICU } from "../tracking/querys/icuQuery";
export default function AdminHeader(){
    const {toast} = useToast();
    const context = useContext(HeaderContext)
    const icuInfos = useQuery({ queryKey: ['icu'], queryFn: fetchICU });
    return(
        <header className={`p-2 m-auto max-w-5xl gap-2 grid grid-cols-2 justify-stretch w-full items-center md:grid-cols-2`}>
                    <Select onValueChange={context?.metricState[1]} value={context?.metricState[0].toString()}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key={metric.occupancy} value={metric.occupancy.toString()}>Occupancy Rate</SelectItem>
                            <SelectItem key={metric.mortality} value={metric.mortality.toString()}>Mortality Rate</SelectItem>
                            <SelectItem key={metric.avgStay} value={metric.avgStay.toString()}>Avg. Patient Stay</SelectItem>
                            <SelectItem key={metric.avgApache} value={metric.avgApache.toString()}>Avg. Apache III Score</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="-1" onValueChange={context?.icuState[1]}>
                    <SelectTrigger className="w-full m-auto max-w-2xl my-3">
                        <SelectValue placeholder="Select ICU" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem key={"all"} value={"-1"}>All</SelectItem>
                        {(icuInfos.data || []).map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                </header>
    )

}