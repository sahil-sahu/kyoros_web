import React from "react";
import sensor_i from "./sensor.png"
import Image from "next/image";
const SensorBox = (props:{children:any}) =>{
    return (
        <div className="aspect-square rounded-xl flex flex-col gap-1 shadow justify-center items-center p-2">
            <Image src={sensor_i} alt="📺" />
            <h4 className="font-medium break-words text-sm uppercase max-w-full">
                {props.children}
            </h4>
        </div>
    )
}
export default SensorBox;