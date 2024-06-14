"use client";
import NavBox from "@/components/custom/header/header";
import { useEffect, useState, Suspense } from "react";
import TrackingHeader from "./trackingHeader";
import LiveView from "./liveView";
import Link from "next/link";
import folder_i from "./folder.png";
import phone_i from "./phone.png";
import Image from "next/image";
import { LiveTrend } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { fetchICU } from "./querys/icuQuery";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import AlertBox from "./components/alertBox";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/use-toast";
const TrendView = dynamic(() => import("./trend"), {
    ssr: false,
  });
const fallback = <Skeleton className="h-[50vh] w-full"></Skeleton>;

const TrackingContent = () => {
    const searchParams = useSearchParams();
    const patientid = searchParams.get('patient');
    const displayType = searchParams.get('type') == LiveTrend.Trend ? LiveTrend.Trend : LiveTrend.Live;
    const {toast} = useToast();
    useEffect(() => {
        if (!patientid) return;
        // console.log(patientid);
    }, [patientid]);

    const { data, isLoading, refetch, error } = useQuery({ queryKey: ['icu'], queryFn: fetchICU });

    useEffect(()=>{
        if(error){
            toast({
                title: "Configuration Error",
                description: error.message,
                variant: "destructive",
                // duration: 5000,
            })
        }
    },[error, toast]);

    return (
        <>
            <section className='p-2'>
                {
                    (!isLoading && data) ? <TrackingHeader icusInfo={data} /> : (
                        <div className="p-2 m-auto max-w-4xl gap-2 flex justify-stretch w-full items-center">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    )
                }
                {
                    displayType === LiveTrend.Live ?
                        <LiveView patientId={patientid} />
                        : <Suspense fallback={fallback}><TrendView patientId={patientid} /></Suspense>
                }
            </section>
            <section className="hidden mt-6 mb-4 px-3 md:grid grid-cols-3 justify-stretch max-w-5xl gap-2 m-auto items-stretch text-center w-full">
                <Link className="" href={"#"}>
                    <AlertBox></AlertBox>
                </Link>
                <Link className="border-2 border-darkblue p-5 rounded-xl" href={"#"}>
                    <h3 className="text-lg mb-5 text-left font-semibold">Docs</h3>
                    <Image className="m-auto w-auto p-1" src={folder_i} alt={"📂"} />
                </Link>
                <Link className="border-2 border-darkblue p-5  rounded-xl" href={"#"}>
                    <h3 className="mb-5 text-lg text-left font-semibold">Call Nursing Station</h3>
                    <Image className="m-auto justify-self-center w-auto p-1 top-[10%] self-center origin-center" src={phone_i} alt={"📞"} />
                </Link>
            </section>
        </>
    );
};
const Tracking = () => {
    return (
        <main>
            <NavBox title={"Tracking"} />
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <TrackingContent />
            </Suspense>
        </main>
    );
};

export default Tracking;
