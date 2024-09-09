import { axiosInstance, setheader } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ClipboardCopyIcon, CopyIcon, LockClosedIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons"

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
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useEffect } from "react";
interface PassResetResponse {
    email: string;
     link: string;
}
const getresetLink = async (payload:{email: string}):Promise<PassResetResponse> =>{
    try {
        const response = await axiosInstance.post(`/user/reset`, payload, {
          headers: await setheader(),
        });
    
        if (response.status !== 200) {
          throw new Error(`Failed to reset user: ${response.statusText}`);
        }
        
        return response.data;
      } catch (error) {
        console.error('Error in reset password user:', error);
        throw error;
      }
}

export const ResetBox = ({email}:{email: string}) => {
    const {toast} = useToast()
    const {mutate, isPending, isError, isSuccess, data} = useMutation({mutationFn: getresetLink})
    return (
        <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={()=>{mutate({email})}} title="Password Reset"><LockClosedIcon /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Password Reset link</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              {isPending && <p className="animate-pulse">Generating link...</p>}
              <Input
                id="link"
                value={data?.link}
                readOnly
              />
              {isSuccess && (
                <div className="flex gap-2 items-center">
                    <Button onClick={()=>{
                        if(data){
                            navigator.clipboard.writeText(data.link).then(() => {
                            toast({
                                title: "Link Copied",
                                description: "Password reset link has been copied to your clipboard.",
                            });
                          })
                        }
                        }}><ClipboardCopyIcon />
                    </Button>
                    <Link target="_blank" href={data.link}>
                        <Button>
                            <OpenInNewWindowIcon />
                        </Button>
                    </Link>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

}