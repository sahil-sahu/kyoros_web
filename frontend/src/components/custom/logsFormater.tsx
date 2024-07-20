import { Patientlog } from "@/types/pateintinfo";
import { getTimeFromISOString } from "@/lib/linechartformatter";

const formatData = (logs:Patientlog[]) =>{
    const heartrates:number[] = [];
    const bp_s:([number, number][]) = [];
    const resp_rates:number[] = [];
    const spo2_s:number[] = [];
    const temp_s:number[] = [];
    const timeStamps:string[] = [];
    if(logs != null && logs.length)
     {logs.forEach(log=>{
        if(!log) return;
        heartrates.push(log.heart_rate);
        bp_s.push(log.bp);
        resp_rates.push(log.resp_rate);
        spo2_s.push(log.spo2);
        temp_s.push(log.temp);
        timeStamps.push(getTimeFromISOString(log.timeStamp));
    })}
    return {
        heartrates,
        bp_s,
        resp_rates,
        spo2_s,
        temp_s,
        timeStamps,
    }
}

const GetTable = ({logs, latestInfo}:{logs:Patientlog[]; latestInfo: Patientlog}) =>{
    const formattedData = formatData(logs);
    return (
        <table className="w-full">
                    <thead className='bg-darkblue text-white text-left p-2'>
                        <tr className='-2'>
                            <th className='px-5 p-1'>Parameters</th>
                            {formattedData.timeStamps.map(e => <th key={e}>{e}</th>)}
                            <th>Latest</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y-2'>
                        <tr>
                            <td className='m-5 translate-x-5'>Heart Rate</td>
                            {formattedData.heartrates.map((e,i) => <td key={i}>{e}</td>)}
                            <td>{latestInfo?.heart_rate}</td>
                        </tr>
                        <tr>
                            <td className='m-5 translate-x-5'>Blood Pressure</td>
                            {formattedData.bp_s.map((e,i) => <td key={i}>{e.join("/")}</td>)}
                            <td>{latestInfo && latestInfo.bp.join("/") }</td>
                        </tr>
                        <tr>
                            <td className='m-5 translate-x-5'>Resp Rate</td>
                            {formattedData.resp_rates.map((e,i) => <td key={i}>{e}</td>)}
                            <td>{latestInfo?.resp_rate}</td>
                        </tr>
                        <tr>
                            <td className='m-5 translate-x-5'>SpO2</td>
                            {formattedData.spo2_s.map((e,i) => <td key={i}>{e}</td>)}
                            <td>{latestInfo?.spo2}</td>
                        </tr>
                        <tr>
                            <td className='m-5 translate-x-5'>Temp (°F)</td>
                            {formattedData.temp_s.map((e,i) => <td key={i}>{e}</td>)}
                            <td>{latestInfo?.temp}</td>
                        </tr>
                    </tbody>
                </table>
    )
}

export default GetTable;