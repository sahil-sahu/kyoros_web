import { Timeline } from "@/types/pateintinfo";
import { useState } from "react";


export const useTimeline = () =>{
    const now = new Date();
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