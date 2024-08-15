"use client"
import ageCalc from "@/lib/ageCalc";
import { PatientInfoProps, Patientlog } from "@/types/pateintinfo";
import { useEffect } from "react";
interface LogData extends PatientInfoProps {
    logs : Patientlog[];
}
const DataTable = ({data, searchParams}:{data:LogData, searchParams: { [key: string]: string | undefined }}) =>{
    useEffect(()=>{
        // let type = searchParams["download"]
        // if(type == "true"){
        //     @import("")
        // } else{
            window.print()
        // }
    })
    const params = searchParams["params"]?.split(",") ?? ["bp","heart_rate","pulse","resp_rate","spo2","temp"];
    let bp_b = params.includes("bp");
    let heartrates_b = params.includes("heart_rate");
    let pulse_b = params.includes("pulse");
    let resp_rate_b = params.includes("resp_rate");
    let spo2_b = params.includes("spo2");
    let temp_b = params.includes("temp");

    return (
        <div className="m-auto w-[794px] p-5">
        <table className="table-auto w-full border text-center mb-5">
            <thead>
                <tr className="border">
                    <th className="border border-r">Name</th>
                    <th className="border border-r">UHID</th>
                    <th className="border border-r">Gender</th>
                    <th className="border border-r">Age</th>
                </tr>
            </thead>
            <tbody className="border">
                    <tr className="border">
                        <td className="border border-r">{data.name}</td>
                        <td className="border border-r">{data.uhid}</td>
                        <td className="border border-r">{data.gender}</td>
                        <td className="border border-r">{ageCalc(data.dob)}</td>
                    </tr>
            </tbody>
        </table>
        <table className="table-auto w-full border text-center">
            <thead>
                <tr className="border">
                    <th className="border border-r">Timestamp</th>
                    {bp_b && <th className="border border-r">BP</th>}
                    {heartrates_b && <th className="border border-r">Heart Rate</th>}
                    {pulse_b && <th className="border border-r">Pulse</th>}
                    {resp_rate_b && <th className="border border-r">Resp Rate</th>}
                    {spo2_b && <th className="border border-r">SPO2</th>}
                    {temp_b && <th>Temperatue</th>}
                </tr>
            </thead>
            <tbody className="border">
                {data.logs.map((log, index) => (
                    <tr className="border" key={index}>
                        <td className="border border-r">{new Date(log.timeStamp).toLocaleString()}</td>
                        {bp_b && <td className="border border-r">{log.bp.join("/")}</td>}
                        {heartrates_b && <td className="border border-r">{log.heart_rate}</td>}
                        {pulse_b && <td className="border border-r">{log.pulse}</td>}
                        {resp_rate_b && <td className="border border-r">{log.resp_rate}</td>}
                        {spo2_b && <td className="border border-r">{log.spo2}</td>}
                        {temp_b && <td>{log.temp}</td>}
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )
}

export default DataTable;