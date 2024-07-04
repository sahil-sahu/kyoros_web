"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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

import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, PersonIcon } from "@radix-ui/react-icons"
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
  
  
  export default function PatientForm() {
    const [found, setFound] = useState<boolean>(false);
    const formSchema = z.object({
        patientInfo: z.object({
            uhid: z.string().refine((uhid)=>{
                setFound(uhid.length > 6)
                console.log("yup", uhid.length > 6)
                return uhid.length < 6
              },{
                message: "UHID Found"
              }),
            dob: z.date(),
            gender: z.string(),
            name: z.string()
          }),
        session: z.object(
            {
                icu: z.number(),
                bed: z.number(),
                diagnosis: z.string(),
                comorbidities: z.string(),
                doctor: z.string(),
                apache: z.number(),
                nurse: z.string(),
            }
        )  
    })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  })
  useEffect(()=>{
    if(!found) return;
    form.setValue("patientInfo", {uhid:"fdfdfdf", name: "kjhdkg",dob:new Date(), gender: "gay"})
  }, [found, form])

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
                        <FormLabel>Date of birth</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={"w-[240px] pl-3 text-left font-normal"}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
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
                            <Select onValueChange={field.onChange}>
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
                                    <SelectItem value="other" className="flex items-center">
                                        <span>Other</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {
                                field.value == "other"?(
                                    <Input className="inline" placeholder="Enter Other Gender" {...field} />
                                ):null
                            }
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    </div>
                    
                    <FormField
                    control={form.control}
                    name="session.icu"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>ICU Number</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Enter ICU Number" {...field} onChange={(({target:{value}}) =>{field.onChange(parseInt(value))})} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="session.bed"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Bed Number</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Enter Bed Number" {...field} onChange={(({target:{value}}) =>{field.onChange(parseInt(value))})} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="session.diagnosis"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Diagnosis</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Diagnosis" {...field} />
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
                            <Input placeholder="Enter Comorbidities" {...field} />
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
                    <FormField
                    control={form.control}
                    name="session.doctor"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Doctor Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Doctor Name" {...field} />
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
                        <FormLabel>Nurse Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Nurse Name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button className="bg-darkblue" type="submit">Submit</Button>
                </form>
                </Form>
            </section>
        </main>
    )
}
