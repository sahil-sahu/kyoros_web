'use client';

import { getByPatient, getCounts } from "@/lib/indexedDB";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

const AlertBox = ({patientId}:{patientId:string}) =>{
    const {isLoading,isError, data, refetch} = useQuery({queryKey:["alertcount", patientId], queryFn: async ({queryKey}: QueryFunctionContext)=>{
      const [_, filter]=queryKey;
      return await getByPatient(typeof(filter) == "string"? filter: undefined);
    }})
    if(isLoading || isError){
        return (
          <div className="h-full text-black rounded-xl text-left shadow col-span-1 border-2 border-darkblue p-5 flex mb-6 flex-col gap-[10%]">
          <h3 className="text-lg  font-semibold">
            Alerts
          </h3>
          <p className="text-sm text-darkblue">
              <span className="text-4xl px-3 lg:pr-5">-</span> Moderate
          </p>
          <p className="text-sm text-darkblue">
              <span className="text-4xl px-3  lg:pr-5">-</span> Critical
          </p>
        </div>
          )
    }
    return (
      <div className="h-full text-black rounded-xl text-left shadow col-span-1 border-2 border-darkblue p-5 flex flex-col gap-[10%]">
        <h3 className="text-lg  font-semibold">
          Alerts
        </h3>
        <p className="text-sm text-darkblue">
            <span className="text-4xl px-3 lg:pr-5">{data?.moderate}</span> Moderate
        </p>
        <p className="text-sm text-darkblue">
            <span className="text-4xl px-3  lg:pr-5">{data?.critical}</span> Critical
        </p>
      </div>
    );
  }

export default AlertBox;  