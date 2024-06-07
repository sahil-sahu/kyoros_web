"use client"
import NavBox from "@/components/custom/header/header"
import { dummyData } from "./dummy";
import GlanceBox from "./glanceBox";
import { useQuery } from "@tanstack/react-query";
import { fetchGlance } from "./query/query";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { GlanceInfo } from "@/types/glance";
import useStack from "./hooks/useStack";
import { connectToSocket, unsubscribeFromRoom } from "@/lib/socket";

const AtGlance = () =>{
    const {data,isLoading,error, refetch} = useQuery({queryKey:['glance'], queryFn: fetchGlance})
    const {glances, setGlances, pushMessage} = useStack();
    const [_refresh,refresh] = useState(false);
    const mysocket = useRef<{room:string; unsubscribe: () => void;}[] | null>(null);
    useLayoutEffect(()=>{
        var store = localStorage.getItem('glance');
        if(!store){
            localStorage.setItem('glance', JSON.stringify([]));
            store = localStorage.getItem('glance');
        }
            
        if(store && data){
            const glances:string[] = JSON.parse(store);
            const arr:GlanceInfo[] = [];
            data.beds.forEach(e => {
                if(glances.includes(e.patientId)){
                    e.pinned = true;
                    arr.push(e);
                }
            })
            data.beds.forEach(e => {
                if(!glances.includes(e.patientId)){
                    e.pinned = false;
                    arr.push(e);
                }
            })
            setGlances(arr);
        }
    },[_refresh, data])
    useEffect(()=>{
        if(!data) return;
        const connectRealtime = (icuId:string)=>{
            const socket = connectToSocket(`icu/${icuId}`, pushMessage);
            return {
                room: `icu/${icuId}`,
                unsubscribe : () => {
                    unsubscribeFromRoom(`icu/${icuId}`);
                  }
            };
        }

       if(mysocket.current == null)  mysocket.current = data?.icus.map(e => connectRealtime(e));
    },[data, mysocket])
    if(isLoading){
        return(
            <main>
            <NavBox title={"At a Glance"} />
            <section className="grid md:grid-cols-3 gap-3 grid-cols-2">
                <Skeleton className="border-2 w-[100%] h-[6rem] p-1"></Skeleton>
                <Skeleton className="border-2 w-[100%] h-[6rem] p-1"></Skeleton>
                <Skeleton className="border-2 w-[100%] h-[6rem] p-1"></Skeleton>
                <Skeleton className="border-2 w-[100%] h-[6rem] p-1"></Skeleton>
            </section>
        </main>
        )
    }
    return(
        <main>
            <NavBox title={"At a Glance"} />
            <section className="grid md:grid-cols-3 grid-cols-2">
                {
                    glances && glances.map(cell => <GlanceBox refresh={refresh} key={cell.id} pinned={cell.pinned?true:false} data={cell}/>)
                }
            </section>
        </main>
    )
}

export default AtGlance;