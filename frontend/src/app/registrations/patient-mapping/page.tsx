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
import { CSSProperties, useEffect, useState } from "react"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"

  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"  
import { useQuery } from "@tanstack/react-query";
import { fetchICU } from "@/app/tracking/querys/icuQuery";
import { axiosInstance, setheader } from "@/lib/axios";
import { QueryFunctionContext } from "@tanstack/query-core";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ICUInfo, bedInfo } from "@/types/ICU";

const Box:CSSProperties = {
    backgroundColor: "#fff",
    backgroundImage:"linear-gradient(to top right, #A2CCFD 5%, white 60%)"
}

interface infos {
    name:string;
    id:number;
    patientId?:string;
    occupied:boolean,
}

const bedArr = [222,223,225,264,963,698,642,756,742,638,753]

const PatientMapping = () => {

    const { data, isLoading, refetch, error } = useQuery({ queryKey: ['icu'], queryFn: fetchICU });
    const [selectedICU, setSelectedICU] = useState<number|undefined>();
    const {data: bedInfos, isLoading:loading, error: bedError} = useQuery({queryKey:["icu", selectedICU], queryFn: async ({queryKey}: QueryFunctionContext): Promise<infos[]> => {
        const [_, icuId] = queryKey;
        if(typeof(icuId) != 'number') throw Error("No Valid Icu Provided");
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
    return (
        <main className="relative min-h-dvh">
            <NavBox title={`Bed Transfer/Discharge`}/>
            <section className='p-2 py-5 max-w-3xl m-auto'>
                <div className="relative">
                    <span className="text-xs absolute -top-2 left-5 bg-white px-2">ICU</span>
                <Select onValueChange={(e)=>{setSelectedICU(+e);}}>
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
                        <DialogTrigger>
                            <div className="text center">
                                <div className={`m-auto bg w-10 p-3 h-10 rounded ${e.occupied? 'bg-red-500': 'bg-green-500'}`}></div>
                                <p className="py-1 text-xs">{e.name}
                                </p>
                            </div>
                        </DialogTrigger>
                        {e.occupied?(
                            <DialogContent className="bg-white">
                                <RadioGroup defaultValue="transfer">
                                    <div className="flex gap-4">
                                        <RadioGroupItem value="transfer" id="option-one" />
                                        <Label htmlFor="option-one">Transfer Patient</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Select onValueChange={setICU} defaultValue={ICU?.id.toString()}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select ICU" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    (data || []).map(e => (
                                                        <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <Select value={Bed?.id.toString()}>

                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Bed" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    (ICU || {beds:[]}).beds.map(e => (
                                                        <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="option-two" id="option-two" />
                                        <Label htmlFor="option-two">Discharge Patient</Label>
                                        <Button className="bg-darkblue p-2 px-3 rounded m-auto">
                                            Discharge
                                        </Button>
                                    </div>
                                </RadioGroup>

                            </DialogContent>
                        ):(
                            <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle>Assign Patient</DialogTitle>
                                <Select onValueChange={(e)=>{setSelectedICU(+e);}}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Name" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(data || []).map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Select onValueChange={(e)=>{setSelectedICU(+e);}}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="UHID" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(data || []).map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Button className="bg-darkblue p-2 px-3 rounded m-auto">
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

export default PatientMapping;