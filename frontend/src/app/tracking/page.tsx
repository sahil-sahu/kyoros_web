"use client";
import NavBox from "@/components/custom/header/header";
import { useEffect, useState, Suspense } from "react";
import TrackingHeader from "./trackingHeader";
import LiveView from "./liveView";
import Link from "next/link";
import folder_i from "./folder.png";
import phone_i from "./phone.png";
import Image from "next/image";
import TrendView from "./trend";
import { LiveTrend } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { fetchICU } from "./querys/icuQuery";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import AlertBox from "./components/alertBox";

const TrackingContent = () => {
    const searchParams = useSearchParams();
    const patientid = searchParams.get('patient');
    const displayType = searchParams.get('type') == LiveTrend.Trend ? LiveTrend.Trend : LiveTrend.Live;

    useEffect(() => {
        if (!patientid) return;
        // console.log(patientid);
    }, [patientid]);

    const { data, isLoading, refetch, error } = useQuery({ queryKey: ['icu'], queryFn: fetchICU });

    return (
        <>
            <section className='p-2'>
                {
                    (!isLoading && data) ? <TrackingHeader icusInfo={data} /> : (
                        <div className="p-2 m-auto max-w-md gap-1 flex justify-evenly items-center">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    )
                }
                {
                    displayType === LiveTrend.Live ?
                        <LiveView patientId={patientid} />
                        : <TrendView patientId={patientid} />
                }
            </section>
            <section className="mt-6 mb-4 h-[15rem] grid grid-cols-3 justify-stretch max-w-5xl gap-2 m-auto items-end text-center w-full">
                <Link className="h-full" href={"#"}>
                    <AlertBox></AlertBox>
                </Link>
                <Link className="border-2 border-darkblue h-full p-5 rounded-xl" href={"#"}>
                    <h3 className="text-lg mb-5 text-left font-semibold">Docs</h3>
                    <Image className="m-auto" src={folder_i} alt={"📂"} />
                </Link>
                <Link className="border-2 h-full border-darkblue p-5  rounded-xl" href={"#"}>
                    <h3 className="mb-5 text-lg text-left font-semibold">Call Nursing Station</h3>
                    <Image className="m-auto justify-self-center top-[10%] self-center origin-center" src={phone_i} alt={"📞"} />
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
