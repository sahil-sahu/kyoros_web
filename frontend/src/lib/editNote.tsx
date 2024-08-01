import { axiosInstance, setheader } from "./axios";
import { User } from "./getAllotedUserforPatient";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useRef, useState } from "react";

interface ChatBox_t {
    name: string;
    type: "admin"|"nurse"|"doctor";
    id: string;
    note: string;
    createdAt: string;
    users: User[];
  }

interface ChatRes {
    notes: ChatBox_t[];
    bedStamp: string; //date string
  }  
export const editNote = async (payload:{
    note:string;
    noteId:string;
}): Promise<ChatBox_t> => {
    const response = await axiosInstance.put(`/patient/notes`, payload,{
        headers: await setheader(),
      });
    return response.data;
  }

const Edit_Box = ({noteId, note, refetch, setEdit, open}:{noteId:string, note:string; open:boolean; setEdit:Dispatch<SetStateAction<boolean>>;refetch: ((options?: RefetchOptions) => Promise<QueryObserverResult<ChatRes, Error>>)|null}) => {

    const [message, setMessage] = useState(note);
    const ref = useRef<HTMLButtonElement>(null);
    const {data, error, isPending, isSuccess, mutate} = useMutation({mutationFn:editNote})
    if(isSuccess) {
      // setMessage(data.note);
      setEdit(false)
      refetch && refetch();
    }
    return (
      <Dialog open={open} onOpenChange={(open)=>{
        if(!open) setTimeout(()=>{setEdit(false)},100);
      }}>
        <DialogTrigger asChild>
            <div>
              {/* Edit */}
            </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Make changes to your note here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Note
              </Label>
              <Input value={message} onChange={(e)=>setMessage(e.target.value)} id="name" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            {error && <div>{error.message}</div>}
            {!isPending && <Button onClick={()=>{mutate({note:message,noteId})}} type="submit">Save</Button>}
            {isPending && <Button type="submit">Saving...</Button>}
            {isSuccess && <Button type="submit">Done</Button>}
          </DialogFooter>
          <DialogClose ref={ref} className="hidden">
            Close
          </DialogClose>
        </DialogContent>
      </Dialog>
    )
}

export default Edit_Box;