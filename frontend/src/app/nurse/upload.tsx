"use client"
import {
    Dialog,
    DialogClose,
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
import { useMutation, useQuery } from "@tanstack/react-query"
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
import { formSchema, UploadDoc } from "./query/docUpload"
import { useToast } from "@/components/ui/use-toast"
import { Divide } from "lucide-react"
import { UploadIcon } from "@radix-ui/react-icons"
import { ToastAction } from "@/components/ui/toast"
import Link from "next/link"
export default function UploadBox({patientId, children}:{patientId:string|undefined; children:ReactNode}) {
    const {toast} = useToast()
    const filterApi = useQuery({ queryKey: ['icu'], queryFn: fetchICU });
    const [ICU, ICUSet]  = useState<ICUInfo|undefined>((filterApi.data || [])[0]);
    const [Bed, BedSet]  = useState<bedInfo|undefined>();
    const [open, setOpen] = useState<boolean|undefined>()
    const setICU = (val:string) =>{
      const icu = (filterApi.data || []).find(e => (parseInt(val) ?? 0) == e.id);
      if(icu) ICUSet(icu);
    }

    const setBed = (val:string, onChange: (...event: any[]) => void) => {
        const bed = ICU?.beds.find(e => (parseInt(val) ?? 0) == e.id);
        if(!bed) return;
        onChange(bed.patientId)
    }

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    })

    useEffect(()=>{
        if(!patientId) return;
        form.setValue("patientId", patientId)
    }, [patientId])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast({
                description: "Uploading Document...",
                duration: 3000,
            })
            const res = await UploadDoc(values);
            setOpen(false)
            toast({
                description: "Your document has been uploaded successfully.",
                duration: 3000,
                action: <ToastAction altText="Go Patient"><Link href={'/docs/'+form.getValues().patientId}>Go to docs</Link></ToastAction>
            })
            form.reset();
        }
         catch(err){
            toast({
                title: "Try again",
                description: "Error in Uploading",
                variant: "destructive",
                duration: 3000,
            })
         }
      }


    return (
            <Dialog open={open}>
              <DialogTrigger asChild>
                {children}
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] aspect-square bg-white">
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
                    name="name"
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