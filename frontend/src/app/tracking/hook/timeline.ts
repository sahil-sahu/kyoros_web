import { Timeline } from "@/types/pateintinfo";
import { useState } from "react";
function roundISOToNearestFiveMinutes(): Date {
    // Parse the input string into a Date object
    const date = new Date("2024-11-02 17:50:01.626");
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
    const [old, _setTimeline] = useState<Date>(new Date(now.getTime() - 30*60*1000));
    const setTimeline = (t:Timeline) =>{
        switch (t) {
            case Timeline.m30:
                return _setTimeline(new Date(now.getTime() - 30*60*1000));
            case Timeline.h3:
                return _setTimeline(new Date(now.getTime() - 3*60*60*1000));
            case Timeline.h12:
                return _setTimeline(new Date(now.getTime() - 12*60*60*1000));
            case Timeline.d1:
                return _setTimeline(new Date(now.getTime() - 24*60*60*1000));
            case Timeline.d3:
                return _setTimeline(new Date(now.getTime() - 3*24*60*60*1000));
            case Timeline.d5:
                return _setTimeline(new Date(now.getTime() - 5*24*60*60*1000));
            default:
              throw new Error(`Unsupported timeline: ${t}`);
          }
    }
    return [old, setTimeline] as const; 
}