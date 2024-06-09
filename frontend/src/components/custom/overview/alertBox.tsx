'use client';

import { getCounts } from "@/lib/indexedDB";
import { useQuery } from "@tanstack/react-query";

const AlertBox = () =>{
    const {isLoading,isError, data, refetch} = useQuery({queryKey:["alertcount"], queryFn: getCounts})
    if(isLoading || isError){
        return (
            <div className="col-span-1 text-white rounded-xl bg-darkblue p-4 flex flex-col justify-evenly">
              <h3 className=" text-lg font-semibold">
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
      <div className="text-white rounded-xl shadow col-span-1 bg-darkblue p-4 flex flex-col justify-evenly">
        <h3 className=" text-lg font-semibold">
          Alerts
        </h3>
        <p className="text-sm">
            <span className="lg:text-6xl text-4xl lg:px-5">{data?.moderate}</span> Moderate
        </p>
        <p className="text-sm">
            <span className="lg:text-6xl text-4xl lg:px-5">{data?.critical}</span> Critical
        </p>
      </div>
    );
  }

export default AlertBox;  