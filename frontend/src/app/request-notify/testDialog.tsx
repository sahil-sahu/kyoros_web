import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query";
import { sendTestNotification } from "./query/testNotification";
import { HelpCircleIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";



export function TestDialog({setConnected}:{setConnected: Dispatch<SetStateAction<boolean>>}) {
    const {toast} = useToast();
    const { mutate, isPending:isLoading, error, data } = useMutation({mutationFn:sendTestNotification});
    const resetFcm = () => {
        localStorage.setItem("fcmSet","false");
        document.getElementById("closeTest")?.click();
        setConnected(false);
    }
    useEffect(()=>{
        if(error){
            toast({
                title: `Failed to send test notification`,
                variant: "destructive"
              });
        }
    }, [error])  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="inline border-none" variant="outline"><HelpCircleIcon /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notification  testing</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button onClick={()=>mutate()}>
            Test
          </Button>
          <Button className="w-full" variant={"destructive"} onClick={()=>{resetFcm()}}>
            Reset
          </Button>
          <DialogClose className="w-full hidden">
            <button id="closeTest"></button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
