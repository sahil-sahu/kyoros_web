"use client"
import NavBox from "@/components/custom/header/header"
import { useQuery } from "@tanstack/react-query"
import { fetchOccupancy } from "@/app/occupancy/query/query"
import ICUInstance from "./ICUInstances"
import { AddICU, EditICU } from "./ICuDialog"
import { fetchICUConfig } from "./query/query"
import { ICURefreshContext } from "./context"

const ICUSetup = () => {
    const {data, error, refetch} = useQuery({queryKey:["icuConfig"], queryFn:fetchICUConfig})
    if(error){
        return <main>
            <NavBox title={"ICU Setup"}></NavBox>
            <section className="grid grid-cols-2 gap-4 gap-y-10 md:grid-cols-4">
                Failed Fetch Occupancy try after sometime
            </section>
        </main>
    }
    return (
        <main>
            <NavBox title={"ICU Setup"}></NavBox>
            <ICURefreshContext.Provider value={refetch}>
            <div className="w-full ">
                    <AddICU />
            </div>
            <section className="grid grid-cols-2 gap-4 py-6 w-fit m-auto gap-y-10 md:grid-cols-4">
                {
                    (data || []).map(e => <EditICU key={e.id} icu={e}/>)
                }
            </section>
            </ICURefreshContext.Provider>
        </main>
    )
}

export default ICUSetup;