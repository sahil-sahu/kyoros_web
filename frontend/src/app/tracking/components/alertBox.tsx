'use client';

import { getCounts } from "@/lib/indexedDB";
import { useQuery } from "@tanstack/react-query";

const AlertBox = () =>{
    const {isLoading,isError, data, refetch} = useQuery({queryKey:["alertcount"], queryFn: getCounts})
    if(isLoading || isError){
        return (
            <div className="h-full rounded-xl shadow col-span-1 border-2 border-darkblue p-5 flex flex-col gap-[15%]">
              <h3 className="text-lg font-semibold">
                Alerts
              </h3>
              <p className="text-sm">
                  <span className="lg:text-6xl text-4xl px-5">0</span> Moderate
              </p>
              <p className="text-sm">
                  <span className="lg:text-6xl text-4xl px-5">0</span> Critical
              </p>
            </div>
          )
    }
    return (
      <div className="h-full text-black rounded-xl text-left shadow col-span-1 border-2 border-darkblue p-5 flex flex-col gap-[15%]">
        <h3 className="text-lg  font-semibold">
          Alerts
        </h3>
        <p className="text-sm text-darkblue">
            <span className="lg:text-6xl text-4xl px-3 lg:pr-5">{data?.moderate}</span> Moderate
        </p>
        <p className="text-sm text-darkblue">
            <span className="lg:text-6xl text-4xl px-3  lg:pr-5">{data?.critical}</span> Critical
        </p>
      </div>
    );
  }

export default AlertBox;  