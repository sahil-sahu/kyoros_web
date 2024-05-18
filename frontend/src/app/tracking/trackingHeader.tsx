import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { Dispatch, SetStateAction } from "react"
import { LiveTrend } from "./page";
export default function TrackingHeader({ICURef, BedRef, TypeRef}:{ICURef: Dispatch<SetStateAction<String>>; BedRef:Dispatch<SetStateAction<String>>, TypeRef:Dispatch<SetStateAction<LiveTrend>>}){

    return(
        <header className="p-2 m-auto max-w-md gap-1 flex justify-evenly items-center">
                    <Select onValueChange={(val) => ICURef(val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="ICU" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CICU-1">CICU-1</SelectItem>
                            <SelectItem value="CICU-2">CICU-2</SelectItem>
                            <SelectItem value="CICU-3">CICU-3</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(val) => BedRef(val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Bed" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2208">2208</SelectItem>
                            <SelectItem value="2209">2209</SelectItem>
                            <SelectItem value="2210">2210</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue={LiveTrend.Live} onValueChange={(e:LiveTrend) => TypeRef(e)}>
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