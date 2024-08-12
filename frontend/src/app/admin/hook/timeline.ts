import { Timeline } from "@/types/pateintinfo";
import { useState } from "react";
function roundISOToNearestFiveMinutes(): Date {
    // Parse the input string into a Date object
    const date = new Date();
    if (isNaN(date.getTime())) {
      throw new Error("Invalid ISO date string");
    }
  
    // Get the current minutes
    const minutes = date.getUTCMinutes();
  
    // Calculate the nearest 5-minute interval
    const roundedMinutes = Math.round(minutes / 5) * 5;
  
    // Set the minutes to the nearest 5-minute interval
    date.setUTCMinutes(roundedMinutes, 0, 0); // Set seconds and milliseconds to zero
  
    return date;
  }
export const useTimeline = () =>{
    const now = roundISOToNearestFiveMinutes();
    const dt = new Date();
    dt.setHours(0,0,0,0)
    dt.setMonth(dt.getMonth()-6)
    const [old, _setTimeline] = useState<Date>(dt);
    const setTimeline = (t:string) =>{
        const dt = new Date();
        dt.setHours(0,0,0,0)
        switch (t) {
            case "1D":
                return _setTimeline(dt);
            case "7D":
                return _setTimeline(new Date(now.getTime() - 7*24*60*60*1000));
            case "1M":
                dt.setMonth(dt.getMonth()-1)
                return _setTimeline(dt);
            case "3M":
                dt.setMonth(dt.getMonth()-3)
                return _setTimeline(dt);
            case "6M":
                dt.setMonth(dt.getMonth()-6)
                return _setTimeline(dt);
            case "1Y":
                dt.setFullYear(dt.getFullYear()-1)
                return _setTimeline(dt);
            case "3Y":
                dt.setFullYear(dt.getFullYear()-3)
                return _setTimeline(dt);
            default:
              throw new Error(`Unsupported timeline: ${t}`);
          }
    }
    return [old, setTimeline] as const; 
}