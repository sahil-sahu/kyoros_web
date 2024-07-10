"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"  
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import upload_i from "./image 112.png"
import { useQuery } from "@tanstack/react-query"
import { fetchICU } from "../tracking/querys/icuQuery"
import { ReactNode, useEffect, useState } from "react"
import { bedInfo, ICUInfo } from "@/types/ICU"

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

const MAX_FILE_SIZE = 10 * 1024 * 1024;
export default function UploadBox({patientId, children}:{patientId:string|undefined; children:ReactNode}) {
    const filterApi = useQuery({ queryKey: ['icu'], queryFn: fetchICU });
    const [ICU, ICUSet]  = useState<ICUInfo|undefined>((filterApi.data || [])[0]);
    const [Bed, BedSet]  = useState<bedInfo|undefined>();

    const setICU = (val:string) =>{
      const icu = (filterApi.data || []).find(e => (parseInt(val) ?? 0) == e.id);
      if(icu) ICUSet(icu);
    }

    const setBed = (val:string, onChange: (...event: any[]) => void) => {
        const bed = ICU?.beds.find(e => (parseInt(val) ?? 0) == e.id);
        if(!bed) return;
        onChange("patientId", bed.patientId)
    }

    const formSchema = z.object({
        patientId:z.string(),
        tag: z.string(),
        fileName: z.string(),
        file: z
                .any().refine(
                    (file: File) => file instanceof File,
                    'Please select a file'
                )
                .refine((file: File) => {
                    if(!(file instanceof File)) return 'No file selected';

                    return file.size <= MAX_FILE_SIZE
                }, {
                message: 'File must be less than 10MB',
                }),
    })
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    })

    useEffect(()=>{
        if(!patientId) return;
        form.setValue("patientId", patientId)
    }, [patientId])

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }

    return (
            <Dialog>
              <DialogTrigger asChild>
                {children}
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader onClick={()=>{form.reset()}} className="text-lg font-bold text-center w-full">
                    Upload Document
                </DialogHeader>
                <DialogDescription>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 items-stretch">
                    { patientId == undefined && (<FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                        <FormItem className="space-0">
                            <FormControl>
                                <div className="flex gap-2">
                                <Select onValueChange={setICU} defaultValue={ICU?.id.toString()}>
                                <SelectTrigger className='w-32'>
                                        <SelectValue className='w-24' placeholder="Select ICU" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            (filterApi.data || []).map(e => (
                                                <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <Select onValueChange={(val)=>{setBed(val,field.onChange)}}>
                                    <SelectTrigger className='w-32'>
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
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />) }
                    <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Doc</FormLabel>
                        <FormControl>
                            <Input onChange={(e)=>{
                                field.onChange(e.target.files?.length ? e.target.files[0] : null);
                            }} id="picture" type="file" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="fileName"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="Enter File Name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                        <FormItem className="space-0">
                        <FormControl>
                            <Select onValueChange={field.onChange}>
                                <SelectTrigger className="w-48 mp-1 flex">
                                    <SelectValue placeholder="Select Tag" />
                                </SelectTrigger>
                                <SelectContent className="grid grid-cols-1">
                                    <SelectItem value="Pathology">
                                        Pathology
                                    </SelectItem>
                                    <SelectItem value="Radiology">
                                        Radiology
                                    </SelectItem>
                                    <SelectItem value="Microbiology">
                                        Microbiology
                                    </SelectItem>
                                    <SelectItem value="General">
                                        General
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button className="bg-darkblue font-semibold" type="submit">Upload</Button>
                    </form>
                </Form>
                </DialogDescription>
              </DialogContent>
            </Dialog>
    )
}