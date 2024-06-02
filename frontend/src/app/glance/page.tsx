"use client"
import NavBox from "@/components/custom/header/header"
import { dummyData } from "./dummy";
import GlanceBox from "./glanceBox";
import { useQuery } from "@tanstack/react-query";
import { fetchGlance } from "./query/query";
import { Skeleton } from "@/components/ui/skeleton";

const AtGlance = () =>{
    const {data,isLoading,error, refetch} = useQuery({queryKey:['glance'], queryFn: fetchGlance})
    if(isLoading){
        return(
            <main>
            <NavBox title={"At a Glance"} />
            <section className="grid md:grid-cols-3 grid-cols-2">
                <Skeleton className="border-2 w-[90%] h-[6rem] p-1"></Skeleton>
                <Skeleton className="border-2 w-[90%] h-[6rem] p-1"></Skeleton>
                <Skeleton className="border-2 w-[90%] h-[6rem] p-1"></Skeleton>
                <Skeleton className="border-2 w-[90%] h-[6rem] p-1"></Skeleton>
            </section>
        </main>
        )
    }
    return(
        <main>
            <NavBox title={"At a Glance"} />
            <section className="grid md:grid-cols-3 grid-cols-2">
                {
                    data && data.map(cell => <GlanceBox key={cell.id} data={cell}/>)
                }
            </section>
        </main>
    )
}

export default AtGlance;