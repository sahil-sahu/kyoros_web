"use client"
import NavBox from "@/components/custom/header/header"
import { useState } from "react"
import { DataTableDemo } from "./table"
import { useQuery } from "@tanstack/react-query"
import { getDocs } from "./queries/getDocs"
const PatientDocs = ({ params:{patientid} }: { params: { patientid: string } }) =>{
    console.log(patientid)
    const { data, isLoading, refetch, error } = useQuery({queryKey:["docs",patientid], queryFn:getDocs});
    return (
        <main>
            <NavBox title={"Docs"} />
            {data && <section className="flex justify-evenly items-center p-4">
                <h2 className="text-lg font-semibold capitalize">
                    Name : {data.patient.name}
                </h2>
                {data.patient.uhid && <h2 className="text-lg font-semibold">
                    UHID : {data.patient.uhid} 
                </h2>}
            </section>}
            
            {data && <DataTableDemo data={data.docs} />}
        </main>
    )
}

export default PatientDocs;