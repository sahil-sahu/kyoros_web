"use client";
import NavBox from "@/components/custom/header/header"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CSSProperties, useCallback, useEffect, useRef } from "react"
import React, {useState} from 'react';
import {DndContext, DragEndEvent, UniqueIdentifier} from '@dnd-kit/core';

import {Droppable} from './droppable';
import {Draggable} from './draggable';
import { fetchICU } from "@/app/tracking/querys/icuQuery";
import { useMutation, useQuery } from "@tanstack/react-query";
import { bedInfo, ICUInfo } from "@/types/ICU";
import { bedwSensor, sensor } from "@/types/sensor";
import BedBox from "./bedBox";
import SensorBox from "./sensorBox";
import { getSensors } from "./query/getSensors";
import { setSensor } from "./query/setSensor";
import { useToast } from "@/components/ui/use-toast";
import { SensorContext } from "./sensorContext";
const Box:CSSProperties = {
    backgroundColor: "#fff",
    backgroundImage:"linear-gradient(to top right, #A2CCFD 5%, white 60%)"
}

const DeviceSetup = () => {
    const {toast} = useToast();
    const [selectedICU, setSelectedICU] = useState<number|undefined>();
    const icuInfos = useQuery({ queryKey: ['icu'], queryFn: fetchICU });
    const Sensors = useQuery({ queryKey: ['sensors'], queryFn: getSensors });
    const [sensorMap, setSensorMap] = useState<Map<string, sensor>>(new Map())
    const { isPending:isLoading, error, data, mutateAsync } = useMutation({mutationFn: setSensor});
    const mapRef = useRef(new Map<number, bedwSensor>());
    const [_, refresh] = useState(new Date().getMilliseconds())
    const mapAll = useCallback(async ()=>{
        const map = mapRef.current;
        const sMap:Map<string, sensor> = new Map();
        (Sensors.data || []).forEach(e =>{
            sMap.set(e.id, e)
            if(!e.bedID || (e.bedID && map.get(e.bedID)?.sensorId.includes(e.id))) return;
            map.get(e.bedID)?.sensorId.push(e.id)
        })
        setSensorMap(sMap)
    },[Sensors.data])
    useEffect(()=>{
        if(icuInfos.data && Sensors.data){
            const beds = icuInfos.data.flatMap(e => e.beds);
            mapRef.current = (new Map(beds.map(bed => [bed.id, {...bed, sensorId: []}])));
            mapAll();
            refresh(new Date().getMilliseconds())
        }

    },
    [icuInfos.data, Sensors.data, mapAll])

    async function handleDragEnd(event:DragEndEvent) {
        const map = mapRef.current;
        const {over} = event;
        if(!over) return;
        const sensor = event.active.id.toString();
        try{
            if(over.id === "unmapped"){
                let sensorObj = Sensors.data?.find(e => e.id == sensor);
                if(!sensorObj) return;
                let sensorarr = map.get(sensorObj.bedID || -1)?.sensorId;
                if(!sensorarr) return;
                const op = await mutateAsync({id: sensor, bedID: undefined})
                sensorarr = sensorarr.filter(e => e != sensor);
                const sName = sensorMap.get(sensor)?.username ?? sensor;
                op && toast({title: `Sensor "${sName}" is now Unmapped successfully`, duration: 2000})
                console.log("removed")
            } else{
                let bed = map.get(parseInt(over.id.toString()));
                let sensorarr = bed?.sensorId;
                if(!sensorarr || sensorarr.includes(sensor)) return;
                const op = await mutateAsync({id: sensor, bedID: bed?.id})
                sensorarr.push(sensor);
                const sName = sensorMap.get(sensor)?.username ?? sensor;
                op && toast({title: "Successfull", description: `Sensor "${sName}" is now mapped successfully to ${bed?.name}`, variant:"default",duration: 2000})
                console.log("added")
            }
            Sensors.refetch();
            refresh(new Date().getMilliseconds())
        } catch (err) {
        toast({title: "Failed to configure", variant: "destructive", duration: 2000})
      }
    }
      const selectIcu = (e:string)=>{
        if(e === "all") return setSelectedICU(undefined);
        setSelectedICU(+e)
      }
    const mapArr = useCallback(()=> (icuInfos.data && selectedICU)?icuInfos.data.find(e=>e.id === selectedICU)?.beds.map((e):bedwSensor => {
        return {...e, sensorId : mapRef.current.get(e.id)?.sensorId ?? []}
    }) ?? []:Array.from(mapRef.current).map(([_, bed])=> bed), [icuInfos.data, selectedICU]);

    return (
        <main className="relative min-h-dvh">
            <NavBox title={`Device Setup`}/>
            <Select defaultValue="all" onValueChange={selectIcu}>
                    <SelectTrigger className="w-full m-auto max-w-2xl my-3">
                        <SelectValue placeholder="Select ICU" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem key={"all"} value={"all"}>All</SelectItem>
                        {(icuInfos.data || []).map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            <SensorContext.Provider value={sensorMap}>
            <DndContext onDragEnd={handleDragEnd}>
             <section className="grid grid-cols-4 gap-4 w-full p-2">
             <div className="grid gap-5 grid-cols-3 items-center m-auto my-5 col-span-3">
                {
                    mapArr().map((e) =>{

                        return (
                            <Droppable key={e.id} id={e.id.toString()}>
                                <BedBox bed={e}></BedBox>
                            </Droppable>
                        )
                    })
                }
             </div>
            <Droppable id={"unmapped"}>
             <div className="border rounded-xl p-3 h-full min-h-[85dvh]">
                <h2 className="text-lg font-semibold">Unmapped Devices</h2>
                <div className="grid grid-cols-3 gap-2">
                {
                    (Sensors.data || []).filter(e => e.bedID == undefined).map(e => {
                        return (
                            <Draggable id={e.id} key={e.id}>
                                <SensorBox>{e.username ?? e.id}</SensorBox>
                            </Draggable>
                        )
                    })
                }
                </div>
             </div>
            </Droppable>
             </section>
            </DndContext>
            </SensorContext.Provider>

        </main>
    )
}


export default DeviceSetup;