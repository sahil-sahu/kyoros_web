import Image from "next/image";
import { PatientRealtimeObj } from "@/types/pateintinfo"
import pin_img from "./pin.png"
import { Toggle } from "@/components/ui/toggle"

const GlanceBox = ({data}:{data:PatientRealtimeObj}) =>{
    return (
        <div className={`${data.critical? "border-dashed border-red-500":"border-solid" } border-2 w-[100%] h-[100%] p-1`}>
            <div className="flex justify-evenly items-center mb-2">
                <Toggle  variant="outline"><Image src={pin_img} alt="📌" className={"border-dotted border-bluecustom"}/></Toggle>
                <div className="py-6 px-3 text-center flex items-center rounded bg-bluecustom h-1">
                    <h3 className="text-white">
                        2201
                    </h3>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <h3 className="text-sm">
                        BP
                    </h3>
                    <p className="text-bluecustom text-lg">
                        {`${data.bp.bp_d} / ${data.bp.bp_s}`}
                    </p>
                </div>
            </div>
            <div className="flex justify-evenly items-center">
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-bluecustom text-lg">
                        {data.spo2}
                    </p>
                    <h3 className="text-sm leading-none">
                        SPO2
                    </h3>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-bluecustom text-lg">
                        {data.bpm}
                    </p>
                    <h3 className="text-sm leading-none">
                        Pulse
                    </h3>
                </div>
                <div className="flex flex-col gap-0 items-center justify-between">
                    <p className="text-bluecustom text-lg">
                        {data.temp}
                    </p>
                    <h3 className="text-sm leading-none">
                        Temp
                    </h3>
                </div>
            </div>
        </div>
    );
}

export default GlanceBox;