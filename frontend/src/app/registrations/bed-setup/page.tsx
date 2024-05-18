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

const bedArr = ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B']

const BedSetup = () => {
    const [beds, setBeds] = useState<string[]>(bedArr);

    return (
        <main className="relative min-h-dvh">
            <NavBox title={`Bed Setup`}/>
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
                <div className="container shadow-inner max-w-lg my-4 p-3 flex flex-col justify-evenly rounded-lg" style={Box}>
                    <h3>
                        Name Bed serially
                    </h3>
                    <div className="flex gap-5 justify-between"> 
                        <Input placeholder="from" className="border bg-white"/>
                        <Input placeholder="to" className="border bg-white"/>
                    </div>
                    <h4 className="text-lg text-center m-4">
                        OR
                    </h4>
                    <div>
                        <h3 className="my-2">
                            Name Bed manually
                        </h3>
                        <div className="grid grid-cols-5 gap-3">
                        {
                            beds.map((e,i) => <p key={i} className="p-2 text-center text-white font-bold bg-bluecustom rounded">{e}</p>)
                        }
                        </div>
                    </div>
                </div>
            </section>

            <Button className="bottom-2 absolute max-w-md right-1/2 translate-x-1/2 bg-bluecustom px-4 w-[95%] py-2">Save</Button>
        </main>
    )
}

export default BedSetup;