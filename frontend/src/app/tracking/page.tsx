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
import { useRouter, useSearchParams } from "next/navigation";
import { ICUInfo, bedInfo } from "@/types/ICU";
import { Skeleton } from "@/components/ui/skeleton";

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
            <section className="flex justify-evenly max-w-lg m-auto items-end text-center w-full">
                <Link className="border-solid border-bluecustom text-bluecustom" href={"#"}>
                    <h3 className="text-4xl">3</h3>
                    <p>Alerts</p>
                </Link>
                <Link className="border-solid border-bluecustom text-bluecustom" href={"#"}>
                    <Image src={folder_i} alt={"📂"} />
                    <p>Alerts</p>
                </Link>
                <Link className="border-solid border-bluecustom text-bluecustom" href={"#"}>
                    <Image src={phone_i} alt={"📞"} />
                    <p>Alerts</p>
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
