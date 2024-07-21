"use client"
import NavBox from "@/components/custom/header/header"
import { icuData } from "@/types/ICU"
import ICUInstance from "./ICUInstance"
import { useQuery } from "@tanstack/react-query"
import { fetchOccupancy } from "./query/query"

const Occupancy = () => {
    const {data, error} = useQuery({queryKey:["occupancy"], queryFn:fetchOccupancy})
    if(error){
        return <main>
            <NavBox title={"Occupancy"}></NavBox>
            <section className="grid grid-cols-2 gap-4 gap-y-10 md:grid-cols-4">
                Failed Fetch Occupancy try after sometime
            </section>
        </main>
    }
    return (
        <main>
            <NavBox title={"Occupancy"}></NavBox>
            <section className="grid grid-cols-2 gap-4 gap-y-10 md:grid-cols-4">
                {
                    (data || []).map(e => <ICUInstance key={e.name} icu={e}/>)
                }
            </section>
        </main>
    )
}

export default Occupancy;