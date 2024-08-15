import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import print_i from "@/components/custom/print.png";
import dayjs from 'dayjs';
import { StyledEngineProvider } from '@mui/material/styles';
import { useRef, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

function getTimeFromISOString(isoString: string|Date): string {
    const date = new Date(isoString);
  
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  }

const PrintDialog = ({patientId}:{patientId:string}) =>{
    const now = new Date()
    now.setHours(0,0,0,0)
    const [startDt, setStartDt] = useState(now);
    const [endDt, setEndDt] = useState(now);
    const [acc, setAcc] = useState("none");
    const [download, setDownload] = useState(false)
    const [freq, setFreq] = useState(5);
    const [params, setparams] = useState<("bp"|"heart_rate"|"pulse"|"resp_rate"|"spo2"|"temp")[]>(["bp","heart_rate","pulse","resp_rate","spo2","temp"])

    const handlePrint = () =>{
        const currentParams = new URLSearchParams();
        currentParams.set('start', startDt.toISOString());
        currentParams.set('end', endDt.toISOString());
        currentParams.set('params', params.join(","));
        currentParams.set('patientId', patientId);
        currentParams.set('download',download+"");
        currentParams.set('freq', freq+"");
        window.open(`/print?${currentParams.toString()}`, "_blank");
    }

    return (
    <StyledEngineProvider injectFirst>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"}>
                <Image src={print_i} className="mx-1" alt={"🖨️"} />
                Print
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-screen overflow-auto">
            <DialogHeader>
              <DialogTitle className="font-bold text-lg">Print Patient Data</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className='grid grid-cols-3 gap-2'>
                    <div className='flex items-center gap-2 col-span-full'>
                        <Checkbox
                            id="all"
                            checked={params.toLocaleString() == ["bp","heart_rate","pulse","resp_rate","spo2","temp"].toLocaleString()}
                            onCheckedChange={(val)=>setparams((params)=>{
                                let check = val.valueOf() as boolean
                                if(check) return ["bp","heart_rate","pulse","resp_rate","spo2","temp"]
                                return [];
                            })}>
                        </Checkbox>
                        <label
                            htmlFor="all"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            All
                        </label> 
                    </div>
                    <div className='flex items-center gap-2'>
                    <Checkbox
                        id="bp"
                        checked={params.includes("bp")}
                        onCheckedChange={(val)=>setparams((params)=>{
                            let check = val.valueOf() as boolean
                            if(check && !params.includes("bp")) return [...params, "bp"]
                            let arr = [...params];
                            let i = arr.findIndex((val)=> val == "bp")
                            i != -1 && arr.splice(i)
                            return arr;
                        })}>
                    </Checkbox>
                    <label
                            htmlFor="bp"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            BP
                        </label> 
                    </div>
                    <div className='flex items-center gap-2'>
                    <Checkbox
                        id="heart_rate"
                        checked={params.includes("heart_rate")}
                        onCheckedChange={(val)=>setparams((params)=>{
                            let check = val.valueOf() as boolean
                            if(check && !params.includes("heart_rate")) return [...params, "heart_rate"]
                            let arr = [...params];
                            let i = arr.findIndex((val)=> val == "heart_rate")
                            i != -1 && arr.splice(i)
                            return arr;
                        })}>
                    </Checkbox>
                    <label
                            htmlFor="heart_rate"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            Heart Rate
                        </label> 
                    </div>
                    <div className='flex items-center gap-2'>
                    <Checkbox
                        id="pulse"
                        checked={params.includes("pulse")}
                        onCheckedChange={(val)=>setparams((params)=>{
                            let check = val.valueOf() as boolean
                            if(check && !params.includes("pulse")) return [...params, "pulse"]
                            let arr = [...params];
                            let i = arr.findIndex((val)=> val == "pulse")
                            i != -1 && arr.splice(i)
                            return arr;
                        })}>
                    </Checkbox>
                    <label
                            htmlFor="pulse"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            Pulse
                        </label> 
                    </div>
                    <div className='flex items-center gap-2'>
                    <Checkbox
                        id="resp_rate"
                        checked={params.includes("resp_rate")}
                        onCheckedChange={(val)=>setparams((params)=>{
                            let check = val.valueOf() as boolean
                            if(check && !params.includes("resp_rate")) return [...params, "resp_rate"]
                            let arr = [...params];
                            let i = arr.findIndex((val)=> val == "resp_rate")
                            i != -1 && arr.splice(i)
                            return arr;
                        })}>
                    </Checkbox>
                    <label
                            htmlFor="resp_rate"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            Resp Rate
                        </label> 
                    </div>
                    <div className='flex items-center gap-2'>
                    <Checkbox
                        id="spo2"
                        checked={params.includes("spo2")}
                        onCheckedChange={(val)=>setparams((params)=>{
                            let check = val.valueOf() as boolean
                            if(check && !params.includes("spo2")) return [...params, "spo2"]
                            let arr = [...params];
                            let i = arr.findIndex((val)=> val == "spo2")
                            i != -1 && arr.splice(i)
                            return arr;
                        })}>
                    </Checkbox>
                    <label
                            htmlFor="spo2"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            SPO2
                        </label> 
                    </div>
                    <div className='flex items-center gap-2'>
                    <Checkbox
                        id="temp"
                        checked={params.includes("temp")}
                        onCheckedChange={(val)=>setparams((params)=>{
                            let check = val.valueOf() as boolean
                            if(check && !params.includes("temp")) return [...params, "temp"]
                            let arr = [...params];
                            let i = arr.findIndex((val)=> val == "temp")
                            i != -1 && arr.splice(i)
                            return arr;
                        })}>
                    </Checkbox>
                    <label
                            htmlFor="temp"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            Temperature
                        </label> 
                    </div>
                </div>  
              <div className=' items-center w-full'>
                <Accordion value={acc} type="single" collapsible>
                    <AccordionItem  value="start">
                            <AccordionTrigger onClick={()=>{acc == "start"?setAcc("none"):setAcc("start")}}>
                            <div className='text-left'>
                                <span>Start Date</span>
                                <span className='text-xs text-gray-600 block'>{getTimeFromISOString(startDt)}</span>
                            </div>
                            </AccordionTrigger>
                        <AccordionContent>
                            <DemoContainer components={['DateTimePicker']}>
                                <DemoItem label="">
                                    <StaticDateTimePicker onAccept={(val)=>{
                                        val && setStartDt(val?.toDate())
                                        setAcc('end')
                                    }} defaultValue={dayjs(startDt)} />
                                </DemoItem>
                            </DemoContainer>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="end">
                        <AccordionTrigger onClick={()=>{acc == "end"?setAcc("none"):setAcc("end")}}>
                            <div className='text-left'>
                                <span>End Date</span>
                                <span className='text-xs text-gray-600 block'>{getTimeFromISOString(endDt)}</span>
                            </div>
                            </AccordionTrigger>
                        <AccordionContent>
                            <DemoContainer components={['DateTimePicker']}>
                                <DemoItem label="">
                                    <StaticDateTimePicker onAccept={(val)=>{
                                        val && setEndDt(val?.toDate())
                                        setAcc('none')
                                    }} defaultValue={dayjs(endDt)} />
                                </DemoItem>
                            </DemoContainer>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
              </div>
              <Select defaultValue={freq+""} onValueChange={(val)=>{
                    let freq = parseInt(val);
                    setFreq(freq)
                }}>
                            <SelectTrigger className="max-w-20">
                                <SelectValue placeholder="Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem key={5} value={"5"}>5m</SelectItem>
                                <SelectItem key={15} value={"15"}>15m</SelectItem>
                                <SelectItem key={30} value={"30"}>30m</SelectItem>
                                <SelectItem key={60} value={"60"}>1hr</SelectItem>
                                <SelectItem key={30} value={"180"}>3hr</SelectItem>
                            </SelectContent>
                </Select>
              <div className="items-top flex space-x-2 text-darkblue font-semibold">
                <Checkbox id="download" onCheckedChange={(val:boolean)=> setDownload(val)} />
                <div className="grid gap-1.5 leading-none">
                    <label
                    htmlFor="download"
                    className="text-sm text-darkblue font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Download to file system
                    </label>
                </div>
                </div>
            </div>
            <DialogFooter>
              {
                download ? (<a className='w-full' download={"logs.pdf"} href={`/print/download/?start=${startDt.toISOString()}&end=${endDt.toISOString()}&params=${params.join(",")}&patientId=${patientId}&freq=${freq}`}>
                {/* download ? (<a className='w-full' href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/print?start=${startDt.toISOString()}&end=${endDt.toISOString()}&params=${params.join(",")}&patientId=${patientId}&freq=${freq}`}> */}
                    <Button  className='w-full bg-darkblue' type="submit">Download</Button>
                </a>):<Button onClick={handlePrint} className='w-full bg-darkblue' type="submit">Print</Button>
              }
              {/* <Button onClick={handlePrint} className='w-full bg-darkblue' type="submit">Print</Button> */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </LocalizationProvider>
    </StyledEngineProvider>
        );
}
export default PrintDialog;