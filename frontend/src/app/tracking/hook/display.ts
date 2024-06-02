import { HealthParameter } from "@/types/pateintinfo";
import { useState } from "react";

export const useDisplay = () =>{
    const [display, changeDisplay] = useState<HealthParameter>('heart_rate');
    const setDisplay = (val:string) => {
            switch (val) {
                case "bp":
                    changeDisplay(val);
                    break;
                case "heart_rate":
                    changeDisplay(val);
                    break;
                    case "pulse":
                    changeDisplay(val);
                    break;
                    case "resp_rate":
                    changeDisplay(val);
                    break;
                case "spo2":
                    changeDisplay(val);
                    break;
                case "temp":
                    changeDisplay(val);
                    break;
                default:
                    console.log(`${val} is not a valid HealthParameter`);
                    break;
            }
    }
    return [display, setDisplay] as const;
}