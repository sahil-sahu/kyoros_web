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
import { useSearchParams } from "next/navigation";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
  import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Link from "next/link";
const AtGlance = () =>{
    const {data,isLoading,error, refetch} = useQuery({queryKey:['glance'], queryFn: fetchGlance})
    const {glances, setGlances, pushMessage} = useStack();
    const [_refresh,refresh] = useState(new Date().getMilliseconds());
    const mysocket = useRef<{room:string; unsubscribe: () => void;}[] | null>(null);

    const searchParams = useSearchParams();
    const icu = searchParams.get('icu') ?? "";
    let icuId = !isNaN(parseInt(icu))?parseInt(icu): -1;
    if(data) {icuId = !isNaN(parseInt(icu))?parseInt(icu):data[0].icu.id;}
    useLayoutEffect(()=>{
        var store = localStorage.getItem('glance');
        if(!store){
            localStorage.setItem('glance', JSON.stringify([]));
            store = localStorage.getItem('glance');
        }
            
        if(store && data){
            const glances:string[] = JSON.parse(store);
            const arr:GlanceInfo[] = [];
            const icuId = !isNaN(parseInt(icu))?parseInt(icu):data[0].icu.id;
            const temp = data.find(e => e.icu.id == icuId);
            if(!temp) return;
            const {icu:{beds}} = temp;
            beds.forEach(e => {
                if(glances.includes(e.patientId)){
                    e.pinned = true;
                    arr.push(e);
                }
            })
            beds.forEach(e => {
                if(!glances.includes(e.patientId)){
                    e.pinned = false;
                    arr.push(e);
                }
            })
            setGlances(arr.filter(e => e.icuId == icuId));
        }
    },[_refresh, data, icu])
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

       if(mysocket.current == null)  mysocket.current = data?.map(e => connectRealtime(e.icu.id.toString()));
    },[data, mysocket])
    if(isLoading){
        return(
            <main>
            <NavBox title={"At a Glance"} />
            <section className="grid md:grid-cols-3 gap-3 grid-cols-2 p-3">
                <Skeleton className="border-2 w-[100%] h-[6rem] p-1"></Skeleton>
                <Skeleton className="border-2 w-[100%] h-[6rem] p-1"></Skeleton>
                <Skeleton className="border-2 w-[100%] h-[6rem] p-1"></Skeleton>
                <Skeleton className="border-2 w-[100%] h-[6rem] p-1"></Skeleton>
            </section>
        </main>
        )
    }
    // if(data) console.log(icu, data[0].icu.id.toString() , icu == data[0].icu.id.toString());
    return(
        <main>
            <NavBox title={"At a Glance"} />
            <NavigationMenu className="m-auto p-4">
                <NavigationMenuList>
                    {
                        data?.map(({icu:{name, id}}) => (
                            <NavigationMenuItem className={icuId == id? "border-2 border-gray-300 rounded":""} key={id}>
                                <Link href={`/glance?icu=${id}`} legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        {name}
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        ))
                    }
                </NavigationMenuList>
            </NavigationMenu>
            <section className="grid md:grid-cols-3 grid-cols-2">
                {
                    glances && glances.map(cell => <GlanceBox refresh={refresh} key={cell.id} pinned={cell.pinned?true:false} data={cell}/>)
                }
            </section>
        </main>
    )
}

export default AtGlance;