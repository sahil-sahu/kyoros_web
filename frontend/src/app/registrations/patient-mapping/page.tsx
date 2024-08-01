"use client";
import NavBox from "@/components/custom/header/header"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CSSProperties, Suspense, useEffect, useRef, useState } from "react"
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"  
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchICU } from "@/app/tracking/querys/icuQuery";
import { axiosInstance, setheader } from "@/lib/axios";
import { QueryFunctionContext } from "@tanstack/query-core";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ICUInfo, bedInfo } from "@/types/ICU";
import { transferPatient } from "./queries/transfer";
import { dischargePatient } from "./queries/discharge";
import { fetchICU_Unoccupied } from "../new-patient/query/getICUs";
import { useSearchParams } from "next/navigation";
import { getActiveSessions } from "./queries/sessionActive";
import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast";

interface infos {
    name:string;
    id:number;
    patientId?:string;
    occupied:boolean;
    sessionId? : string;
}

interface transferObj {bedId?:number, bedName?:string, icuName?:string , oldId?: number; icuId?:number, sessionId?:string}
const PatientMapping = () => {

    const {toast} = useToast();

    const { data, isLoading, refetch, error } = useQuery({ queryKey: ['icu'], queryFn: fetchICU });
    const activeSessions = useQuery({queryKey:['activeSessions'], queryFn: getActiveSessions});
    const icuInfos = useQuery({ queryKey: ['icu_unoccupied'], queryFn: fetchICU_Unoccupied });

    const [_, refresh] = useState(new Date().getMilliseconds())

    const transferMutation =  useMutation({mutationFn:transferPatient})
    const dischargeMutation =  useMutation({mutationFn:dischargePatient})

    const transferRef = useRef<transferObj>({bedId: undefined, bedName: undefined, icuName:undefined, oldId: undefined , icuId:undefined, sessionId:undefined})
    const dischargeRef = useRef<{sessionId?: string, reason?: string}>({sessionId:undefined, reason: undefined})

    const icu = +(useSearchParams().get('icu') ?? "0");
    const [selectedICU, setSelectedICU] = useState<number|undefined>(icu);

    let beds = (data || []).flatMap(e => e.beds.map(k => {return {...k, icuId:e.id, icuName:e.name}}));

    const {data: bedInfos, isLoading:loading, error: bedError, refetch: bedRefetch} = useQuery({queryKey:["icu", selectedICU], queryFn: async ({queryKey}: QueryFunctionContext): Promise<infos[]> => {
        const [_, icuId] = queryKey;
        if(undefined || typeof(icuId) != 'number') throw Error("No Valid Icu Provided");
        const response = await axiosInstance.get(`/hospital/getbeds`, {
            params:{icu:icuId},
            headers: await setheader(),
          });
        const res:infos[] = response.data;
        return res;  
      }})

    const [ICU, ICUSet]  = useState<ICUInfo|undefined>((data && data.length)? data[0]: undefined);
      const setICU = (val:string) =>{
        const icu = (data || []).find(e => (parseInt(val) ?? 0) == e.id);
        if(icu) ICUSet(icu);
    }
      const [Bed, BedSet]  = useState<bedInfo|undefined>();

    const transferPatientfn = async ()=>{
        // console.log(transferRef.current)
        toast({
            description:"Transfering Patient"
        });
          if (transferRef.current && (
                transferRef.current.bedId !== undefined &&
                transferRef.current.bedName !== undefined &&
                transferRef.current.icuName !== undefined &&
                transferRef.current.icuId !== undefined &&
                transferRef.current.sessionId
          )) {
            try {
              await transferMutation.mutateAsync({
                bedId:transferRef.current.bedId,
                bedName:transferRef.current.bedName,
                oldId:transferRef.current.oldId,
                icuId:transferRef.current.icuId,
                sessionId:transferRef.current.sessionId,
                icuName:transferRef.current.icuName
            });
            toast({
                description:"Transfering Successfull"
            });
            bedRefetch();

            } catch (error) {
                toast({
                    description:"Failed to Transfer Patient",
                    variant:"destructive"
                });
                console.error(error);
            }
          }
          
    }  
    const dischargePatientfn = async (sessionId:string|undefined|null, reason:string|undefined)=>{
          if (sessionId && reason) {
            try {
              await dischargeMutation.mutateAsync({sessionId,reason});
            bedRefetch();

            } catch (error) {
              console.error(error);
            }
          }
          
    } 
    return (
        <main className="relative min-h-dvh">
            <NavBox title={`Bed Transfer/Discharge`}/>
            <section className='p-2 py-5 max-w-3xl m-auto'>
                <div className="relative">
                    <span className="text-xs absolute -top-2 left-5 bg-white px-2">ICU</span>
                <Select defaultValue={icu?.toString()}  onValueChange={(e)=>{setSelectedICU(+e);}}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select ICU" />
                    </SelectTrigger>
                    <SelectContent>
                        {(data || []).map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                </div>
                <div className="p-3 text-lg text-center">
                    Beds Occupied: <span className="text-bluecustom">{`${(bedInfos || []).filter(e => e.occupied).length} out of ${(bedInfos || []).length}`}</span>
                </div>
                <div className="grid grid-cols-5 gap-5">
                    {loading && "Loading..."}
                    {bedError && bedError.message }
                    {(bedInfos || []).map((e)=>(
                        <Dialog key={e.id}>
                        <DialogTrigger disabled={(!e.sessionId && e.occupied)}>
                            <div title={(!e.sessionId && e.occupied)?"not configured properly":""} className="text center">
                                <div  className={`m-auto bg w-10 p-3 h-10 rounded ${e.occupied? 'bg-red-500': 'bg-green-500'} ${(!e.sessionId && e.occupied) ? "!bg-gray-500": ''}`}></div>
                                <p className="py-1 text-xs">{e.name}
                                </p>
                            </div>
                        </DialogTrigger>
                        {e.occupied?(
                            <DialogContent className="border-none shadow-none">
                                <RadioGroup defaultValue="transfer">
                                    <div className="flex flex-col bg-white shadow rounded space-x-2 p-4 gap-4">
                                        <div>
                                            <RadioGroupItem value="transfer" id="option-one" />
                                            <Label className="px-2" htmlFor="option-one">Transfer Patient</Label>
                                        </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <Select onValueChange={(e:string)=>{
                                        const icu = (icuInfos.data || []).find(k => k.id == +e)
                                        if(icu) {
                                                transferRef.current.icuId = +e;
                                                transferRef.current.icuName = icu.name;
                                                refresh(new Date().getMilliseconds())
                                            }
                                                    }}>
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="Select ICU" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(icuInfos.data || []).map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Select onValueChange={(e:string)=>{
                                                    const bed = ((icuInfos.data || []).find(k => k.id == transferRef.current.icuId) || {beds:[]}).beds.find(k => k.id == +e)
                                                    if(bed){
                                                        transferRef.current.bedId = +e;
                                                        transferRef.current.bedName = bed.name;
                                                    }
                                                }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Bed" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    ((icuInfos.data || []).find(e => e.id == transferRef.current.icuId) || {beds:[]}).beds.map(e => (
                                                        <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        </div>
                                        <div className="w-full flex justify-center items-center">
                                        <Button onClick={()=>{
                                            transferRef.current.sessionId = e.sessionId;
                                            transferRef.current.oldId = e.id;
                                            transferPatientfn()

                                        }} className="bg-darkblue p-2 px-3 rounded m-auto">
                                            Transfer
                                        </Button>
                                        </div>
                                    </div>

                                    <div className="space-x-2 bg-white shadow rounded my-0.5 p-4">
                                        <div className="gap-1 flex items-center">
                                            <RadioGroupItem value="option-two" id="option-two" />
                                            <Label className="px-2" htmlFor="option-two">Discharge Patient</Label>
                                        </div>
                                        <Select onValueChange={(e:string)=>{
                                                    dischargeRef.current.reason = e
                                                }}>
                                            <SelectTrigger className="my-4">
                                                <SelectValue  placeholder="Reason" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem key={"Patient Deceased"} value={"Patient Deceased"}>{"Patient Deceased"}</SelectItem>
                                                <SelectItem key={"Patient Stable"} value={"Patient Stable"}>{"Patient Stable"}</SelectItem>
                                                <SelectItem key={"Patient's wish"} value={"Patient's wish"}>{"Patient's wish"}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="w-full flex justify-center items-center">
                                        <Button onClick={()=>{dischargePatientfn(e.sessionId, dischargeRef.current.reason)}} className="bg-darkblue p-2 px-3 rounded">
                                            Discharge
                                        </Button>
                                        </div>
                                    </div>
                                </RadioGroup>

                            </DialogContent>
                        ):(
                            <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle>Assign Patient</DialogTitle>
                                <Select onValueChange={(val)=>{
                                    let session = JSON.parse(val);
                                    transferRef.current.oldId = session.bedId.length? session.bedId[session.bedId.length-1]: undefined;
                                    transferRef.current.sessionId = session.id;
                                    transferRef.current.bedId = e.id;
                                    transferRef.current.bedName = e.name;
                                    let inst = beds.find(k => e.id == k.id)
                                    transferRef.current.icuId = inst?.icuId;
                                    transferRef.current.icuName = inst?.icuName;

                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(activeSessions.data || []).map((session)=>{
                                            return <SelectItem key={session.id} value={JSON.stringify(session)}>{`${session.patient.uhid} ${session.patient.name}`}</SelectItem>
                                        })}
                                    </SelectContent>
                                </Select>
                                <Button onClick={transferPatientfn} className="bg-darkblue p-2 px-3 rounded m-auto">
                                    Confirm
                                </Button>
                            </DialogHeader>
                            </DialogContent>
                        )}
                      </Dialog>
                      
                    ))}
                </div>
            </section>

            <Button className="bottom-2 absolute max-w-md right-1/2 translate-x-1/2 bg-bluecustom px-4 w-[95%] py-2">Save</Button>
        </main>
    )
}

const _PatientMapping = ()=>{
    return(
        <Suspense>
            <PatientMapping></PatientMapping>
        </Suspense>
    )
}

export default _PatientMapping;