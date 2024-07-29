import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { getTimeFromISOString } from "@/lib/linechartformatter"
import Link from "next/link"

interface historyModel {
    id: string;
    date: string;//isoString
    diagnosis:string;
    medications:string[];
    patientId:string;
}

const data: historyModel[] = [
    {
      id: "history-001",
      date: "2024-07-01T08:00:00Z",
      diagnosis: "Hypertension",
      medications: ["Lisinopril", "Hydrochlorothiazide"],
      patientId: "patient-001"
    },
    {
      id: "history-002",
      date: "2024-07-02T09:30:00Z",
      diagnosis: "Diabetes",
      medications: ["Metformin", "Insulin"],
      patientId: "patient-002"
    },
    {
      id: "history-003",
      date: "2024-07-03T10:15:00Z",
      diagnosis: "Asthma",
      medications: ["Albuterol", "Fluticasone"],
      patientId: "patient-003"
    },
    {
      id: "history-004",
      date: "2024-07-04T11:00:00Z",
      diagnosis: "Pneumonia",
      medications: ["Azithromycin", "Ceftriaxone"],
      patientId: "patient-004"
    },
    {
      id: "history-005",
      date: "2024-07-05T12:30:00Z",
      diagnosis: "Chronic Kidney Disease",
      medications: ["Losartan", "Furosemide"],
      patientId: "patient-005"
    }
  ];

export default function PatientHistory({patientId}:{patientId:string;}){
    return (
        <Dialog onOpenChange={undefined}>
          <DialogTrigger className={"w-full text-center m-auto"} asChild>
            <h1 className="bg-clip-text cursor-pointer text-transparent bg-gradient-to-r from-[#05BBFF] to-[#4F60FF]">
                    Patient History
                    <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                className="inline"
                viewBox="0 0 15 15"
                >
                <path
                    fill="#4F60FF"
                    fillRule="evenodd"
                    d="M12 13a1 1 0 001-1V3a1 1 0 00-1-1H3a1 1 0 00-1 1v3.5a.5.5 0 001 0V3h9v9H8.5a.5.5 0 000 1H12zM9 6.5v3a.5.5 0 01-1 0V7.707l-5.146 5.147a.5.5 0 01-.708-.708L7.293 7H5.5a.5.5 0 010-1h3a.498.498 0 01.5.497"
                    clipRule="evenodd"
                ></path>
                </svg>
                </h1>
          </DialogTrigger>
          <DialogContent className="w-max min-w-[50%] min-h-[50%] bg-white">
            <Tabs defaultValue={data.length? data[0].id : undefined} className="flex gap-5 items-stretch">
                <TabsList className="flex flex-col relative h-full justify-stretch gap-2 bg-white rounded border p-2">
                    {data.map((e)=>{return (<TabsTrigger className="relative data-[state=active]:bg-darkblue data-[state=active]:text-white" key={e.id} value={e.id}>{getTimeFromISOString(e.date)}</TabsTrigger>)})}
                </TabsList>
                {data.map((e) =>{
                    return (
                        <TabsContent key={e.id} value={e.id} className="w-full">
                            <table className="text-left gap-4 w-full">
                                <thead>
                                    <tr>
                                        <th>Diagnosis</th>
                                        <th>Medications</th>
                                        <th>Reports and Docs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{e.diagnosis}</td>
                                        <td>
                                            <ol>
                                            {e.medications.map(e => <li key={e}>{e}</li>)}
                                            </ol>
                                        </td>
                                        <td>
                                            <Link href={"/docs/"+patientId} className="m-auto ml-5">
                                            <h1 className="bg-clip-text text-transparent bg-gradient-to-r m-auto from-[#05BBFF] to-[#4F60FF]">
                                                    <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="32"
                                                height="32"
                                                fill="none"
                                                viewBox="0 0 15 15"
                                                >
                                                <path
                                                    fill="#4F60FF"
                                                    fillRule="evenodd"
                                                    d="M12 13a1 1 0 001-1V3a1 1 0 00-1-1H3a1 1 0 00-1 1v3.5a.5.5 0 001 0V3h9v9H8.5a.5.5 0 000 1H12zM9 6.5v3a.5.5 0 01-1 0V7.707l-5.146 5.147a.5.5 0 01-.708-.708L7.293 7H5.5a.5.5 0 010-1h3a.498.498 0 01.5.497"
                                                    clipRule="evenodd"
                                                ></path>
                                                </svg>
                                                </h1>
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </TabsContent>
                    )
                })}
            </Tabs>
          </DialogContent>

        </Dialog>
      )
}