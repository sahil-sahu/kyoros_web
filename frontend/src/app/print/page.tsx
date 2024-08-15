import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import { PatientInfoProps, Patientlog } from "@/types/pateintinfo";
import DataTable from "./dataTable";
interface LogData extends PatientInfoProps {
    logs : Patientlog[];
}
const _PrintPage = async ({
    params:param,
    searchParams,
  }: {
    params: { slug: string }
    searchParams: { [key: string]: string | undefined }
  }) =>{
    const params = searchParams["params"]?.split(",") ?? ["bp","heart_rate","pulse","resp_rate","spo2","temp"];
    let query = ["printlogs",searchParams["patientId"]+"", searchParams["start"]+"", searchParams["end"]+"", searchParams["freq"]+""]
    const [_, patientId, start, end, freq] = query;
    const cookieStore = cookies()
    const token = cookieStore.get('authToken')?.value || searchParams["token"]
    const q = new URLSearchParams()
    q.append('patientId', patientId+"")
    q.append('start', start+"")
    q.append('end', end+"")
    q.append('freq', freq+"")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/logs/print?${q.toString()}`, {
        cache:"no-store",
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        
    })
    const data:LogData = await res.json()
    // console.log(data)

    if (!res.ok) {
        redirect("/tracking?patient="+searchParams["patientId"]+"")
      }
    
    return (<DataTable data={data} searchParams={searchParams} />)
}
// const PrintPage = () =>{
//     return <Suspense>
//         <_PrintPage></_PrintPage>
//     </Suspense>
// }

export default _PrintPage;