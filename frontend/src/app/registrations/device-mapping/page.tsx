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

const Box:CSSProperties = {
    backgroundColor: "#fff",
    backgroundImage:"linear-gradient(to top right, #A2CCFD 5%, white 60%)"
}

const bedArr = [222,223,225,264,963]

const DeviceSetup = () => {

    return (
        <main className="relative min-h-dvh">
            <NavBox title={`Device Setup`}/>
            <section className='p-2 py-5'>
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="ICU Name" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>
                <div className="container w-full grid grid-cols-3 lg:grid-cols-5 gap-2 shadow-inner my-4 p-3 justify-evenly rounded-lg" style={Box}>
                    {
                    bedArr.map((e,i) => (
                        <div className="flex-col flex items-center justify-center gap-2" key={i}>
                            <div className="p-1 bg-bluecustom rounded px-3 text-white font-semibold">{e}</div>
                            <Select >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Vitals Moniter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    ))
                    }
                </div>
            </section>

            <Button className="bottom-2 absolute max-w-md right-1/2 translate-x-1/2 bg-bluecustom px-4 w-[95%] py-2">Save</Button>
        </main>
    )
}

export default DeviceSetup;