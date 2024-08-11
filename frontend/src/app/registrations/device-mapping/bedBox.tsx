import { bedwSensor } from "@/types/sensor";
import { Draggable } from "./draggable";
import SensorBox from "./sensorBox";
import { useContext } from "react";
import { SensorContext } from "./sensorContext";

const BedBox = ({bed}:{bed:bedwSensor}) =>{
    const sensorMap = useContext(SensorContext)

    if(!bed.sensorId.length) return(
        <div className="aspect-square border p-3">
            <div className="py-6 px-3 text-center flex items-center rounded w-min min-w-[5rem] m-auto my-3 bg-bluecustom h-1">
                    <h3 className="text-white">
                    {bed.name}
                    </h3>
                </div>
                <div  className="h-[10rem] flex justify-center items-center w-full aspect-square rounded-xl text-xl font-bold">Drop here</div>
        </div>
    )
    return(
        <div className="aspect-square border p-3">
            <div className="py-6 px-3 text-center flex items-center rounded w-min min-w-[5rem] m-auto my-3 bg-bluecustom h-1">
                    <h3 className="text-white">
                    {bed.name}
                    </h3>
                </div>
            <div className="grid grid-cols-3 gap-2">
            {
                    bed.sensorId.map(e=>{
                    const name = sensorMap.get(e)?.username || e;
                    return (
                        <Draggable key={e} data={e} id={e}>
                            <SensorBox>{name}</SensorBox>
                        </Draggable>
                    )
                })
            }
            </div>
        </div>
    )
}

export default BedBox;