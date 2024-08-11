"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

  import { cn } from "@/lib/utils"
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"

import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, CaretDownIcon, PersonIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import NavBox from "@/components/custom/header/header"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { getByUhid } from "./query/getbyUhid"
import { fetchICU } from "@/app/tracking/querys/icuQuery"
import { useQuery } from "@tanstack/react-query"
import { Textarea } from "@/components/ui/textarea"
import { getUsers } from "./query/getUsers"
import { fetchICU_Unoccupied } from "./query/getICUs"
import { makeSession } from "./query/admitPatient"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import allYears from "@/lib/allyears"
export default function PatientForm() {
    const router = useRouter()
    const {toast} = useToast();
    const [found, setFound] = useState<string|undefined>();
    const [assign, setAssign] = useState(false);
    const [open, setOpen] = useState(false)
    const [_, refresh] = useState(new Date().getMilliseconds())
    const icuInfos = useQuery({ queryKey: ['icu_unoccupied'], queryFn: fetchICU_Unoccupied });
    const users = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const formSchema = z.object({
        patientInfo: z.object({
            uhid: z.string().refine(async (uhid)=>{
                try {
                    const res = await getByUhid({uhid});
                    if(!res || (!res.id)) {
                        setFound(undefined)
                        return true;
                    }
                    form.setValue("patientInfo", {uhid: res.uhid ?? uhid, name: res.name,dob:new Date(res.dob), gender: res.gender})
                    setFound(res.id)
                } catch (error) {
                    setFound(undefined)
                }
                return true;
              },{
                message: "UHID Found"
              }),
            dob: z.date(),
            gender: z.string(),
            name: z.string()
          }),
        session: z.object(
            {
                icu: z.number().optional(),
                icuName: z.string().optional(),
                bed: z.number().optional(),
                bedName: z.string().optional(),
                diagnosis: z.string(),
                comorbidities: z.string(),
                doctor: z.array(z.string()).min(1,{ message: "At least one doctor is required" }),
                apache: z.number(),
                nurse: z.array(z.string()).min(1,{ message: "At least one nurse is required" }),
            }
        )  
    })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
    toast({description:"Admitting current patient"})
    let payload = {...values, found}
    const session = await makeSession(payload);
    console.log(session)
    if(session.status == 200){
        const data = session.data;
        toast({description:"Successfully Admitted"})
        if(values.session?.icu && values.session?.bed) return router.replace(`/tracking?icu=${values.session?.icu}&bed=${values.session?.bed}&patient=${(data[0].patientId || found) ?? ""}&type=Live`);
        return router.replace(`/tracking?patient=${(data[0].patientId || found) ?? ""}&type=Live`)
    }
    } catch (error) {
        console.error(error)
    }
    toast({description:"Failed admit patient", variant:"destructive"})
    
  }
  return (
        <main>
            <NavBox title={"Add Patient"}></NavBox>
            <section className="max-w-3xl mx-auto p-4 w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField
                    control={form.control}
                    name="patientInfo.uhid"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>UHID</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter UHID" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    {found && "UHID exists"}
                    <FormField
                    control={form.control}
                    name="patientInfo.name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex gap-2 sm:flex-row flex-col">
                    <FormField
                    control={form.control}
                    name="patientInfo.dob"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-2.5">
                        <FormLabel>Birth Year</FormLabel>
                            <FormControl>
                                {/* <DatePicker selected={field.value} onChange={field.onChange} /> */}
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-[200px] justify-between"
                                        >
                                        {field.value?.getFullYear() || "Select year"}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                        <CommandInput typeof="number" className="h-9" />
                                        <CommandList>
                                            <CommandEmpty>No year found.</CommandEmpty>
                                            <CommandGroup>
                                            {allYears().map((year) => (
                                                <CommandItem
                                                key={year.getFullYear()}
                                                value={year.toISOString()}
                                                onSelect={(currentValue) => {
                                                    field.onChange(year)
                                                    setOpen(false)
                                                }}
                                                >
                                                {year.getFullYear()}
                                                <CheckIcon
                                                    className={cn(
                                                    "ml-auto h-4 w-4",
                                                    field.value?.getFullYear() === year.getFullYear() ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                </CommandItem>
                                            ))}
                                            </CommandGroup>
                                        </CommandList>
                                        </Command>
                                    </PopoverContent>
                                    </Popover>
                                {/* <Button
                                variant={"outline"}
                                className={"w-[240px] pl-3 text-left font-normal"}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button> */}
                            </FormControl>
                            
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="patientInfo.gender"
                    render={({ field }) => (
                        <FormItem className="space-0">
                        <FormLabel className="">Gender</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-2">
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-48 mp-1 flex">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent className="grid grid-cols-1">
                                    <SelectItem value="male" className="flex w-full">
                                        <div className="flex items-center"><PersonIcon color="#fff" strokeWidth="2" className="m-2 rounded-full bg-[#05A1EF] p-1 w-8 h-8" />
                                        <span>Male</span></div>
                                    </SelectItem>
                                    <SelectItem value="female">
                                    <div className="flex items-center"><PersonIcon color="#fff" strokeWidth="2" className="m-2 rounded-full bg-[#FF007D] p-1 w-8 h-8" />
                                    <span>Female</span></div>
                                    </SelectItem>
                                    {/* <SelectItem value="other" className="flex items-center">
                                        <span>Other</span>
                                    </SelectItem> */}
                                </SelectContent>
                            </Select>
                            {/* {
                                (field.value == "other" || field.value)?(
                                    <Input className="inline" placeholder="Enter Other Gender" {...field} />
                                ):null
                            } */}
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch onCheckedChange={(val)=>setAssign(val)} id="assignBed" />
                        <Label htmlFor="assignBed">Assign Bed</Label>
                    </div>
                    { assign && <FormField
                    control={form.control}
                    name="session.icu"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>ICU</FormLabel>
                        <FormControl>
                        <Select value={(field.value ?? -1).toString()} onValueChange={(e:string)=>{
                                        const icu = (icuInfos.data || []).find(k => k.id == +e)
                                        if(icu) {
                                            field.onChange(+e)
                                            form.setValue("session.icuName", icu.name)
                                        }
                                        form.setValue("session.bed", -1)
                                        refresh(new Date().getMilliseconds())
                                    }}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select ICU" />
                            </SelectTrigger>
                            <SelectContent>
                                {(icuInfos.data || []).map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />}
                    {assign && <FormField
                    control={form.control}
                    name="session.bed"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bed</FormLabel>
                        <FormControl>
                            <Select value={(field.value ?? -1).toString()} onValueChange={(e:string)=>{
                                        const bed = ((icuInfos.data || []).find(k => k.id == form.getValues().session.icu) || {beds:[]}).beds.find(k => k.id == +e)
                                        if(bed){
                                             field.onChange(+e)
                                             form.setValue("session.bedName", bed.name)
                                        }
                                    }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Bed" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        ((icuInfos.data || []).find(e => e.id === form.getValues().session?.icu) || {beds:[]}).beds.map(e => (
                                            <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />}
                    <FormField
                    control={form.control}
                    name="session.diagnosis"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Diagnosis</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Enter Diagnosis" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="session.comorbidities"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Comorbidities</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Enter Comorbidities , add multiple by pressing (enter)" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="session.apache"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Apache III</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Apache III Score" {...field} onChange={(({target:{value}}) =>{field.onChange(parseInt(value))})} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex gap-5">
                    <FormField
                    control={form.control}
                    name="session.doctor"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <div className="w-min inline"><Button variant="outline" className='relative w-fit text-left text-ellipsis'> <span className="mr-12">Doctors</span>  <CaretDownIcon className='ml-2 float-end absolute right-2' /> </Button>
                            <small className="p-2">{field.value && field.value.length? `selected ${field.value.length}`: null}</small></div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Doctors</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {(users.data || []).filter(e => e.userType == "doctor").map(e => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                        key={e.id}
                                        checked={field.value?.includes(e.id)}
                                        onCheckedChange={(val)=>{
                                            if(val) field.onChange([...(field.value || []), e.id])
                                            else field.onChange(field.value.filter(k => k != e.id))
                                        }}
                                        >
                                            {e.name}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="session.nurse"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="w-min inline"><Button variant="outline" className='relative w-fit text-left text-ellipsis'> <span className="mr-12">Nurses</span>  <CaretDownIcon className='ml-2 float-end absolute right-2' /> </Button>
                                <small className="p-2">{field.value && field.value.length? `selected ${field.value.length}`: null}</small></div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Nurses</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {(users.data || []).filter(e => e.userType == "nurse").map(e => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                        key={e.id}
                                        checked={field.value?.includes(e.id)}
                                        onCheckedChange={(val)=>{
                                            if(val) field.onChange([...(field.value || []), e.id])
                                            else field.onChange(field.value.filter(k => k != e.id))
                                        }}
                                        >
                                            {e.name}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    </div>
                    <Button className="bg-darkblue" type="submit">Submit</Button>
                </form>
                </Form>
            </section>
        </main>
    )
}
