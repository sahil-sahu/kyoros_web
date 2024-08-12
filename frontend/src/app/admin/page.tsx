"use client"
import NavBox from "@/components/custom/header/header"
import { Suspense } from "react"
import { getMetric, HeaderContext, metric, useIcu, useMetric } from "./context"
import { useSearchParams } from "next/navigation"
import AdminHeader from "./header"
import dynamic from "next/dynamic";
const TrendView = dynamic(() => import("./trend"), {
    ssr: false,
  });

const _AdminGraphs = () =>{
    const searchParams = useSearchParams()
    const metricQ = searchParams.get('metric')
    const metricSt = useMetric(getMetric(metricQ ?? ""))
    const icuSt = useIcu()
    return (
        <HeaderContext.Provider value={{
            metricState:metricSt,
            icuState:icuSt
        }}>
            <AdminHeader />
            <Suspense>
                <TrendView />
            </Suspense>
        </HeaderContext.Provider>
    )
}

const AdminGraph = () =>{
    return (
        <main>
            <NavBox title={`Trends`}/>
            <Suspense>
                <_AdminGraphs />
            </Suspense>
        </main>
    )
}

export default AdminGraph;