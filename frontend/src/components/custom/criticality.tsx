import * as React from "react"
import { Minus, Plus } from "lucide-react"
 
import { Button } from "@/components/ui/button"

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
import { Label } from "@/components/ui/label"  
import { Textarea } from "@/components/ui/textarea"
import { GlanceInfo } from "@/types/glance"
import { axiosInstance, setheader } from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "../ui/use-toast"
export default function Criticality({ g_criticality,data:{patientId, apache:criticality, id:bedId}, setCriticality}:{g_criticality:number|undefined;data:GlanceInfo; setCriticality:React.Dispatch<React.SetStateAction<number | undefined>>}){
    const { toast } = useToast()
    const [_critical, setCritical] = React.useState(g_criticality ?? 0)
    const { isPending:isLoading, error, data, mutateAsync } = useMutation({mutationFn:async (criticality:number) =>{
        const resp = await axiosInstance.post(`/patient/setcriticality`, {patientId, bedId, criticality},{
            headers: await setheader(),
          });
        return resp.status == 200;
    }});
    if(error){
        toast({
            title: `Failed to update criticality`,
            variant: "destructive"
          })
    }
    const resetCriticality = async () =>{
        const res = await mutateAsync(_critical);
        if(!res){
            toast({
                title: `Failed to update criticality`,
                variant: "destructive"
              })
            return;
        }
        toast({
            title: `Updated Criticality to ${_critical}`
          })
        setCriticality(_critical);
          
    }
 
        function onClick(adjustment: number) {
            setCritical(Math.max(0, Math.min(10, _critical + adjustment)))
        }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <h2 className="px-3 cursor-pointer py-0.5 bg-c_lg_blue rounded-full font-semibold text-white">
                    Criticality: {g_criticality ?? "--"}
                </h2>
            </DrawerTrigger>
            <DrawerContent className="bg-white">
                <div className="mx-auto w-full max-w-sm">
                <div className="p-4 pb-0">
                    <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={() => onClick(-1)}
                        disabled={_critical <= 0}
                    >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Decrease</span>
                    </Button>
                    <div className="flex-1 text-center">
                        <div className="text-7xl font-bold tracking-tighter">
                        {_critical}
                        </div>
                        <div className="text-[0.70rem] uppercase text-muted-foreground">
                            Criticality
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full "
                        onClick={() => onClick(1)}
                        disabled={_critical >= 10}
                    >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Increase</span>
                    </Button>
                    
                    </div>
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="message">Comments</Label>
                        <Textarea placeholder="Type your message here." id="message" />
                    </div>
                </div>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button onClick={resetCriticality} className="bg-c_lg_blue">Submit</Button>
                    </DrawerClose>
                    <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
                </div>
            </DrawerContent>
            </Drawer>
    )
}