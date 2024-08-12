import { createContext, Dispatch, SetStateAction, useState } from "react";
export enum metric {
    mortality = "mortality",
    occupancy = "occupancy",
    avgStay = "avgStay",
    avgApache = "avgApache"
}
interface adminHeader {
    icuState: [number,(icu:string)=> void];
    metricState: [metric, (metric:string)=> void];
}
export const getMetric = (metric_s:string) =>{
    switch(metric_s){
        case metric.occupancy.toString():
            return (metric.occupancy)
            break;
        case metric.mortality.toString():
            return (metric.mortality)
            break;
        case metric.avgStay.toString():
            return (metric.avgStay)
            break;
        case metric.avgApache.toString():
            return (metric.avgApache)
            break;
        default:
            return (metric.occupancy)
    }
    return (metric.occupancy)
}
export const useMetric = (metric_s:metric):[metric, (metric:string)=> void]=>{
    const [m, setState] = useState<metric>(metric_s)
    const setMetric = (metric_s:string) =>{
        switch(metric_s){
            case metric.occupancy.toString():
                setState(metric.occupancy)
                break;
            case metric.mortality.toString():
                setState(metric.mortality)
                break;
            case metric.avgStay.toString():
                setState(metric.avgStay)
                break;
            case metric.avgApache.toString():
                setState(metric.avgApache)
                break;
            default:
                console.error("Invalid metric")
                break;
        }
    }
    return [m, setMetric];
}
export const useIcu = ():[number,(icu:string)=> void]=>{
    const [icu, setState] = useState<number>(-1)
    const setIcu = (icuId:string) =>{
        setState(+icuId)
    }
    return [icu, setIcu];
}
export const HeaderContext = createContext<adminHeader|null>(null)