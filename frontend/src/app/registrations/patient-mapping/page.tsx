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
import { CSSProperties, useState } from "react"
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

const Box:CSSProperties = {
    backgroundColor: "#fff",
    backgroundImage:"linear-gradient(to top right, #A2CCFD 5%, white 60%)"
}

const bedArr = [222,223,225,264,963,698,642,756,742,638,753]

const PatientMapping = () => {

    return (
        <main className="relative min-h-dvh">
            <NavBox title={`Patient Mapping`}/>
            <section className='p-2 py-5'>
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Bed Allocation" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>
                <div className="p-3 text-lg">
                    Beds Occupied: <span className="text-bluecustom">{`${13} out of ${20}`}</span>
                </div>
                <div className="grid grid-cols-5 gap-5">
                    {bedArr.map((e,i)=>(
                        <Drawer key={i}>
                            <DrawerTrigger>
                                <div className="text center">
                                    <div className={`m-auto bg w-6 p-3 h-6 rounded ${e%2 == 0? 'bg-red-500': 'bg-green-500'}`}></div>
                                    <p className="py-1 text-xs">{e}
                                    </p>
                                </div>
                            </DrawerTrigger>
                            <DrawerContent className="bg-white">
                            <DrawerHeader>
                                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                                <DrawerDescription>This action cannot be undone.</DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
                                <Button>Submit</Button>
                                <DrawerClose>
                                <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    ))}
                </div>
            </section>

            <Button className="bottom-2 absolute max-w-md right-1/2 translate-x-1/2 bg-bluecustom px-4 w-[95%] py-2">Save</Button>
        </main>
    )
}

export default PatientMapping;