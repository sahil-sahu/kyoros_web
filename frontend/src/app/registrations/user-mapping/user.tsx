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
import { Divide, Edit2Icon, Edit3Icon } from "lucide-react"
import { CaretDownIcon, UploadIcon } from "@radix-ui/react-icons"
import { ToastAction } from "@/components/ui/toast"
import Link from "next/link"
import { createUser, deleteUser, editUser, formSchema, medicalDepartments, UserType } from "./query/newUser"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchICU } from "@/app/tracking/querys/icuQuery"
import { User } from "./query/getusers"
import { UserRefreshContext } from "./context"
export function AddUser() {
    const {toast} = useToast()
    const filterApi = useQuery({ queryKey: ['icu'], queryFn: fetchICU });
    const [icu, setIcu] = useState<number[]>([])
    const userRefreshContext = useContext(UserRefreshContext)

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues:{
            tagged: []
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createUser(values);
            toast({
                description: "User created successfully",
                duration: 3000,
            })
            form.reset();
            document.getElementById("UserDialog")?.click();
            userRefreshContext && userRefreshContext()
        }
         catch(err){
            toast({
                title: "Try again",
                description: "Failed to create user",
                variant: "destructive",
                duration: 3000,
            })
         }
      }


    return (
            <Dialog>
              <DialogTrigger asChild>
                    <Button className="p-2 m-4 px-6 float-right text-white bg-darkblue">
                        Add User
                    </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] aspect-square bg-white">
                <DialogHeader onClick={()=>{form.reset()}} className="text-lg font-bold text-center w-full">
                    Add User
                </DialogHeader>
                <DialogDescription>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 items-stretch">

                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="space-0">
                            <FormControl>
                                <Input placeholder="Enter Name" {...field} />
                            </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-0">
                            <FormControl>
                                <Input type="email" placeholder="Enter Email" {...field} />
                            </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>User Type</FormLabel>
                        <FormControl>
                            <ul className="flex flex-col gap-1 capitalize ml-4">
                                {UserType.map((val) =>{
                                    return (
                                        <li className="flex gap-2 items-center" key={val}>
                                            <Checkbox
                                                checked={field.value == val}
                                                onCheckedChange={(checked) => field.onChange(val)}
                                                id={val}
                                            />
                                            <Label htmlFor={val}>
                                                {val}
                                            </Label>
                                        </li>
                                    )
                                })}
                            </ul>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                            <Select onValueChange={field.onChange}>
                                <SelectTrigger className="w-48 mp-1 flex">
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent className="grid grid-cols-1">
                                    {medicalDepartments.map(e => (<SelectItem key={e} value={e}>{e}</SelectItem>))}
                                </SelectContent>
                            </Select>
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
                            <FormLabel className="block">Tagged to</FormLabel>
                            <FormControl>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className='capitalize relative w-[10rem] text-left text-ellipsis'><span className='w-[8rem] text-left text-ellipsis overflow-hidden'>{(field.value?.length ?? 0) +" ICU Selected"}</span> <CaretDownIcon className='ml-2 float-end absolute right-2' /> </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>ICUs</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {
                                        (filterApi.data || []).map(e =>{
                                            return (
                                        <DropdownMenuCheckboxItem
                                            key={e.id}
                                            checked={icu.includes(e.id)}
                                            onCheckedChange={(val)=>setIcu(icus =>{
                                                if(val){
                                                    let arr = [...icus, e.id];
                                                    field.onChange(arr)
                                                    return arr;
                                                }
                                                let arr = icus.filter(k => k!= e.id);
                                                field.onChange(arr)
                                                return arr;
                                            })}
                                            >
                                                {e.name}
                                        </DropdownMenuCheckboxItem>

                                            )
                                        })
                                    }
                                </DropdownMenuContent>
                                </DropdownMenu>    
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <Button className="bg-darkblue font-semibold" type="submit">Add User</Button>
                    </form>
                </Form>
                </DialogDescription>
                <DialogFooter className="sm:justify-start hidden">
                    <DialogClose id="UserDialog" asChild>
                        <Button type="button" variant="secondary">
                        Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    )
}
export function EditUser({user}:{user:User}) {
    const {toast} = useToast()
    const filterApi = useQuery({ queryKey: ['icu'], queryFn: fetchICU });
    const [icu, setIcu] = useState<number[]>(user.watcher.map(w => w.icu.id))
    const userId = user.id;

    const userRefreshContext = useContext(UserRefreshContext)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues:{
            name: user.name,
            email: user.email,
            userType: user.userType,
            department: medicalDepartments.find(e => e == user.department),
            tagged: user.watcher.map(w => w.icu.id)
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await editUser({...values, id: userId});
            toast({
                description: "User updated successfully",
                duration: 3000,
            })
            // form.reset();
            document.getElementById("UserDialog")?.click();
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
            await deleteUser({...values, id: userId});
            toast({
                description: "User deleted successfully",
                duration: 3000,
            })
            // form.reset();
            document.getElementById("UserDialog")?.click();
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
                    <Button variant={"outline"} className="">
                        <Edit3Icon className="p-1 opacity-75" fill="" />
                    </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] aspect-square bg-white">
                <DialogHeader onClick={()=>{form.reset()}} className="text-lg font-bold text-center w-full">
                    Add User
                </DialogHeader>
                <DialogDescription>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 items-stretch">

                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="space-0">
                            <FormControl>
                                <Input placeholder="Enter Name" {...field} />
                            </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-0">
                            <FormControl>
                                <Input disabled type="email" placeholder="Enter Email" {...field} />
                            </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>User Type</FormLabel>
                        <FormControl>
                            <ul className="flex flex-col gap-1 capitalize ml-4">
                                {Object.values(UserType).map((val) =>{
                                    return (
                                        <li className="flex gap-2 items-center" key={val}>
                                            <Checkbox
                                                checked={field.value == val}
                                                onCheckedChange={(checked) => field.onChange(val)}
                                                id={val}
                                            />
                                            <Label htmlFor={val}>
                                                {val}
                                            </Label>
                                        </li>
                                    )
                                })}
                            </ul>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                            <Select onValueChange={field.onChange}>
                                <SelectTrigger className="w-48 mp-1 flex">
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent className="grid grid-cols-1">
                                    {medicalDepartments.map(e => (<SelectItem key={e} value={e}>{e}</SelectItem>))}
                                </SelectContent>
                            </Select>
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
                            <FormLabel className="block">Tagged to</FormLabel>
                            <FormControl>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className='capitalize relative w-[10rem] text-left text-ellipsis'><span className='w-[8rem] text-left text-ellipsis overflow-hidden'>{(field.value?.length ?? 0) +" ICU Selected"}</span> <CaretDownIcon className='ml-2 float-end absolute right-2' /> </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>ICUs</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {
                                        (filterApi.data || []).map(e =>{
                                            return (
                                        <DropdownMenuCheckboxItem
                                                key={e.id}
                                            checked={icu.includes(e.id)}
                                            onCheckedChange={(val)=>setIcu(icus =>{
                                                if(val){
                                                    let arr = [...icus, e.id];
                                                    field.onChange(arr)
                                                    return arr;
                                                }
                                                let arr = icus.filter(k => k!= e.id);
                                                field.onChange(arr)
                                                return arr;
                                            })}
                                            >
                                                {e.name}
                                        </DropdownMenuCheckboxItem>

                                            )
                                        })
                                    }
                                </DropdownMenuContent>
                                </DropdownMenu>    
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <div className="flex justify-stretch gap-4 w-full">
                        <Button className="bg-darkblue font-semibold w-full" type="submit">Update User</Button>
                        <Button onClick={(e)=>{
                            e.preventDefault();
                            DeleteonSubmit(form.getValues())}
                        } className="bg-red-600 font-semibold w-full">Delete User</Button>
                    </div>
                    </form>
                </Form>
                </DialogDescription>
                <DialogFooter className="sm:justify-start hidden">
                    <DialogClose id="UserDialog" asChild>
                        <Button type="button" variant="secondary">
                        Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    )
}