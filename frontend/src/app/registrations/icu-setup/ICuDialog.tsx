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
import { ReactNode, useContext, useEffect, useState } from "react"
import { bedInfo, ICUInfo } from "@/types/ICU"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

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
// import { formSchema, UploadDoc } from "./query/docUpload"
import { useToast } from "@/components/ui/use-toast"
import { CaretDownIcon, UploadIcon } from "@radix-ui/react-icons"
import { ToastAction } from "@/components/ui/toast"
import Link from "next/link"
import { createICU, deleteICU, editICU, formSchema } from "./query/newICU"
import { ICURefreshContext } from "./context"
import { getUsers } from "../new-patient/query/getUsers"
import { ICUConfig } from "./query/query"
import ICUInstance from "./ICUInstances"
export function AddICU() {
    const {toast} = useToast()
    const users = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const userRefreshContext = useContext(ICURefreshContext)
    const [bedsArr, setarr] = useState<string[]>([])
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
        defaultValues:{
            tagged: [],
            firstBed: 1,
            bedArray: [],
            beds:0
        }
    })

    const bedsGenerator = (beds:number, starting:number) =>{
        const bedsArray = []
        for(let i=starting ?? 1; i<(beds||0)+(starting||0); i++){
            bedsArray.push(i+"")
        }
        return bedsArray
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createICU(values);
            toast({
                description: "ICU created successfully",
                duration: 3000,
            })
            form.reset();
            document.getElementById("ICUDialog")?.click();
            userRefreshContext && userRefreshContext()
        }
         catch(err){
            toast({
                title: "Try again",
                description: "Failed to ICU user",
                variant: "destructive",
                duration: 3000,
            })
         }
      }


    return (
            <Dialog>
              <DialogTrigger asChild>
                    <Button className="p-2 m-4 px-6 float-right text-white bg-darkblue">
                        Add ICU
                    </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] lg:h-[50vh] overflow-auto aspect-square bg-white">
                <DialogHeader onClick={()=>{form.reset()}} className="text-lg font-bold text-center w-full">
                    Add User
                </DialogHeader>
                <DialogDescription>
                <Form {...form}>
                    <form onSubmit={(e)=>{
                    e.preventDefault();
                }} className="flex flex-col gap-3 items-stretch">

                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="space-0">
                            <FormLabel htmlFor="icuName">Name</FormLabel>
                            <FormControl>
                                <Input id="icuName" placeholder="Enter Name" {...field} />
                            </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="beds"
                    render={({ field }) => (
                        <FormItem className="space-0">
                            <FormLabel htmlFor="icuBeds">Number of Beds</FormLabel>
                            <FormControl>
                                <Input id="icuBeds" value={field.value} type="number" placeholder="Enter no. of beds" onChange={(e)=>{
                                     field.onChange(+e.target.value);
                                     form.setValue("bedArray", bedsGenerator(form.getValues().beds, form.getValues().firstBed))
                                     setarr(form.getValues().bedArray)
                                }} />
                            </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="firstBed"
                    render={({ field }) => (
                        <FormItem className="space-0">
                            <FormLabel htmlFor="icuBeds">First Bed No.</FormLabel>
                            <FormControl>
                                <Input id="icuBeds" className="w-1/2" type="number" placeholder="" value={field.value} onChange={(e)=>{
                                     field.onChange(+e.target.value)
                                     form.setValue("bedArray", bedsGenerator(form.getValues().beds, form.getValues().firstBed))
                                }} />
                            </FormControl>
                            {(bedsArr && bedsArr.length > 0) && (
                                <div>
                                    <h3>
                                        Bed Names:
                                    </h3>
                                    <p>
                                        {form.getValues().bedArray.join(', ')}
                                    </p>
                                </div>
                            )}
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormLabel className="" htmlFor="">Tagged</FormLabel>
                    <div className="flex gap-5">
                    
                    <FormField
                    control={form.control}
                    name="tagged"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <div className="w-min inline"><Button variant="outline" className='relative w-fit text-left text-ellipsis'> <span className="mr-12">Doctors</span>  <CaretDownIcon className='ml-2 float-end absolute right-2' /> </Button>
                            <small className="p-2">{field.value && field.value.length? `selected ${(users.data || []).filter(e => e.userType == "doctor").filter(e => field.value.includes(e.id)).length}`: null}</small></div>
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
                    name="tagged"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="w-min inline"><Button variant="outline" className='relative w-fit text-left text-ellipsis'> <span className="mr-12">Nurses</span>  <CaretDownIcon className='ml-2 float-end absolute right-2' /> </Button>
                                <small className="p-2">{field.value && field.value.length? `selected ${(users.data || []).filter(e => e.userType == "nurse").filter(e => field.value.includes(e.id)).length}`: null}</small></div>
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
                    <Button onClick={form.handleSubmit(onSubmit)} className="bg-darkblue font-semibold" type="submit">Add ICU</Button>
                    </form>
                </Form>
                </DialogDescription>
                <DialogFooter className="sm:justify-start hidden">
                    <DialogClose id="ICUDialog" asChild>
                        <Button type="button" variant="secondary">
                        Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    )
}
export function EditICU({icu}:{icu:ICUConfig}) {
    const {toast} = useToast()
    const users = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const userRefreshContext = useContext(ICURefreshContext)
    const [bedsArr, setarr] = useState<string[]>([])
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
        defaultValues:{
            tagged: icu.users,
            firstBed: 1,
            beds:icu.total,
            bedArray: [],
            name: icu.name
        }
    })

    const bedsGenerator = (beds:number, starting:number) =>{
        const bedsArray = []
        for(let i=starting ?? 1; i<(beds||0)+(starting||0); i++){
            bedsArray.push(i+"")
        }
        return bedsArray
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await editICU({...values, id: icu.id});
            toast({
                description: "ICU updated successfully",
                duration: 3000,
            })
            // form.reset();
            document.getElementById("ICUDialog")?.click();
            userRefreshContext && userRefreshContext()
        }
         catch(err){
            toast({
                title: "Try again",
                description: "Failed to update user",
                variant: "destructive",
                duration: 3000,
            })
         }
      }
    async function DeleteonSubmit(values: z.infer<typeof formSchema>) {
        try {
            await deleteICU({...values, id: icu.id});
            toast({
                description: "ICU deleted successfully",
                duration: 3000,
            })
            // form.reset();
            document.getElementById("ICUDialog")?.click();
            userRefreshContext && userRefreshContext()
        }
         catch(err){
            toast({
                title: "Try again",
                description: "Failed to delete user",
                variant: "destructive",
                duration: 3000,
            })
         }
      }


      return (
        <Dialog>
          <DialogTrigger asChild>
                    <button>
                    <ICUInstance icu={icu} />
                    </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]  overflow-auto aspect-square bg-white">
            <DialogHeader onClick={()=>{form.reset()}} className="text-lg font-bold text-center w-full">
                Edit ICU
            </DialogHeader>
            <DialogDescription>
            <Form {...form}>
                <form onSubmit={(e)=>{
                    e.preventDefault();
                }} className="flex flex-col gap-3 items-stretch">

                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="space-0">
                        <FormLabel htmlFor="icuName">Name</FormLabel>
                        <FormControl>
                            <Input id="icuName" placeholder="Enter Name" {...field} />
                        </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="beds"
                render={({ field }) => (
                    <FormItem className="space-0">
                        <FormLabel htmlFor="icuBeds">Number of Beds</FormLabel>
                        <FormControl>
                            <Input disabled id="icuBeds" value={field.value} type="number" placeholder="Enter no. of beds" onChange={(e)=>{
                                 field.onChange(+e.target.value);
                                 form.setValue("bedArray", bedsGenerator(form.getValues().beds, form.getValues().firstBed))
                                 setarr(form.getValues().bedArray)
                            }} />
                        </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormLabel className="" htmlFor="">Tagged</FormLabel>
                <div className="flex gap-5">
                
                <FormField
                control={form.control}
                name="tagged"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <div className="w-min inline"><Button variant="outline" className='relative w-fit text-left text-ellipsis'> <span className="mr-12">Doctors</span>  <CaretDownIcon className='ml-2 float-end absolute right-2' /> </Button>
                        <small className="p-2">{field.value && field.value.length? `selected ${(users.data || []).filter(e => e.userType == "doctor").filter(e => field.value.includes(e.id)).length}`: null}</small></div>
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
                name="tagged"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="w-min inline"><Button variant="outline" className='relative w-fit text-left text-ellipsis'> <span className="mr-12">Nurses</span>  <CaretDownIcon className='ml-2 float-end absolute right-2' /> </Button>
                            <small className="p-2">{field.value && field.value.length? `selected ${(users.data || []).filter(e => e.userType == "nurse").filter(e => field.value.includes(e.id)).length}`: null}</small></div>
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
                <div className="flex justify-center gap-4">
                <Button onClick={form.handleSubmit(onSubmit)} className="bg-darkblue font-semibold w-full">Edit ICU</Button>
                <Button onClick={(e)=>{
                            e.preventDefault();
                            DeleteonSubmit(form.getValues())}
                        } className="bg-red-600 font-semibold w-full">Delete ICU</Button>
                </div>
                </form>
            </Form>
            </DialogDescription>
            <DialogFooter className="sm:justify-start hidden">
                <DialogClose id="ICUDialog" asChild>
                    <Button type="button" variant="secondary">
                    Close
                    </Button>
                </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
)
}