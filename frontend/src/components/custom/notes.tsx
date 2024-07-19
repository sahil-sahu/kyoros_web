  import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"
import { useEffect, useRef, useState } from "react"
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { getTimeFromISOString } from "@/lib/linechartformatter";
import { Button } from "../ui/button";

import print_i from "./print.png";
import Image from "next/image";
import { Input } from "../ui/input";
import { DotsHorizontalIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { QueryFunctionContext } from "@tanstack/query-core";
import { axiosInstance, setheader } from "@/lib/axios";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";

interface ChatBox_t {
  name: string;
  type: "admin"|"nurse"|"doctor";
  id: string;
  note: string;
  createdAt: string;
}
const ChatBox = ({name, createdAt, note, type}:ChatBox_t) =>{
  return (
    <div className="chatbox flex gap-3 items-center">
      <Checkbox />
      <div className={`p-4 py-2 text-white rounded-lg ${type.includes("doctor")? "bg-darkblue":"bg-[#4C8484]"}`}>
        <p className="font-bold">{name}</p>
        <p className="text-sm">{note}</p>
        <p className="text-right text-xs">{getTimeFromISOString(createdAt)}</p>
      </div>
    </div>
  )
}

const dummy:ChatBox_t[] = [
  {
    "id": "1a2b3c4d",
    "name": "Dr. Emily Watson",
    "createdAt": "2024-07-01T09:15:30Z",
    "note": "Patient is showing signs of improvement.",
    "type": "doctor"
  },
  {
    "id": "2b3c4d5e",
    "name": "Nurse John Doe",
    "createdAt": "2024-07-01T09:30:45Z",
    "note": "Administered morning medication.",
    "type": "nurse"
  },
  {
    "id": "3c4d5e6f",
    "name": "Dr. Michael Smith",
    "createdAt": "2024-07-01T10:00:00Z",
    "note": "Reviewed patient's lab results, everything is normal.",
    "type": "doctor"
  },
  {
    "id": "4d5e6f7g",
    "name": "Nurse Anna Lee",
    "createdAt": "2024-07-01T10:15:30Z",
    "note": "Checked patient's vital signs, all within normal range.",
    "type": "nurse"
  },
  {
    "id": "5e6f7g8h",
    "name": "Dr. David Brown",
    "createdAt": "2024-07-01T11:00:00Z",
    "note": "Discussed treatment plan with patient.",
    "type": "doctor"
  },
  {
    "id": "6f7g8h9i",
    "name": "Nurse Sarah Johnson",
    "createdAt": "2024-07-01T11:30:45Z",
    "note": "Patient requested assistance with mobility.",
    "type": "nurse"
  }
]

export const fetchNotes = async ({queryKey}: QueryFunctionContext): Promise<ChatBox_t[]> => {
  const [_, patientId] = queryKey;
  const response = await axiosInstance.get(`/patient/${patientId}/notes`, {
      headers: await setheader(),
    });
  const notes: ChatBox_t[] = response.data;  
  return notes;
};
export const makeNote = async (body: {note:string; patientId:string;}): Promise<ChatBox_t> => {
  const response = await axiosInstance.post(`/patient/notes`, body,{
      headers: await setheader(),
    });
  const note: ChatBox_t = response.data;  
  return note;
};

const ChatArea = ({patientId, timeStamp, notes}:{patientId:string, timeStamp:Date, notes:UseQueryResult<ChatBox_t[], Error>}) =>{
  const [params, setparams] = useState<("all"|"doctor"|"nurse")>("all")
  const [chat, setchat] = useState<ChatBox_t[]>([])
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  useEffect(()=>{
    if(notes.data) setchat(notes.data)
  },[notes.data])

  useEffect(()=>{
    if(params === "doctor") return setchat((notes.data || []).filter( k => k.type === "doctor"))
    if(params === "nurse") return setchat((notes.data || []).filter( k => k.type === "nurse"))
    return setchat((notes.data || [])) ;
  }, [params, notes.data])
  
  return (
    <section className="chatarea">
      <header>
      <ul className="flex justify-evenly items-center gap-4">
            <li className="font-bold text-lg">
                Filter:
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox onClick={()=>setparams("all")} checked={params.includes("all")} id="all" />
                <Label htmlFor="all">All</Label>
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox className="data-[state=checked]:bg-darkblue border-darkblue" onClick={()=>setparams("doctor")} checked={params.includes("doctor")} id="Doctor"></Checkbox>
                <Label htmlFor="Doctor">Doctor</Label>
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox className="data-[state=checked]:bg-[#4C8484] border-[#4C8484]" onClick={()=>setparams("nurse")} checked={params.includes("nurse")} id="Nurse"></Checkbox>
                <Label htmlFor="Nurse">Nurse</Label>
            </li>
        </ul>
      </header>
      <div ref={scrollRef} className="grid grid-cols-1 gap-4 my-2 max-h-[60dvh] lg:max-h-[80dvh] overflow-y-auto">
        {
          (chat.length == 0) && "No new messages"
        }
        {
          chat.map(e => <ChatBox id={e.id} key={e.id} type={e.type} name={e.name} createdAt={e.createdAt} note={e.note} />)
        }
      </div>
    </section>
  );
}
export default function Notes({patientId}:{patientId:string}) {
    const [dayId, setDay] = useState<string>("day1");
    const notes = useQuery({queryKey:["notes", patientId], queryFn:fetchNotes})
    const addNote = useMutation({mutationFn:makeNote})
    const message = useRef<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const {toast} = useToast();
    const handleAddNote = async () => {
      if(message.current === "") return;
      try {
        await addNote.mutateAsync({note:message.current, patientId})
        notes.refetch()
        if(inputRef.current) inputRef.current.value = "";
      } catch (error) {
        console.error(error)
        toast({description: "failed add notes", variant:"destructive"})
      }
    }
    return (
      <>
        <div className="flex justify-between">
          <ToggleGroup defaultValue={dayId} className="notes w-full justify-start grid grid-cols-5" type="single" onValueChange={(val)=>setDay(val)}>
              <ToggleGroupItem value="day1" aria-label="Toggle bold">
              Day 1
              </ToggleGroupItem>
              <ToggleGroupItem value="day2" aria-label="Toggle italic">
              Day 2
              </ToggleGroupItem>
              <ToggleGroupItem value="day3" aria-label="Toggle strikethrough">
              Day 3
              </ToggleGroupItem>
              <ToggleGroupItem value="day4" aria-label="Toggle strikethrough">
              Day 4
              </ToggleGroupItem>
              <ToggleGroupItem value="day5" aria-label="Toggle strikethrough">
              Day 5
              </ToggleGroupItem>
              <ToggleGroupItem value="day6" aria-label="Toggle strikethrough">
              Day 6
              </ToggleGroupItem>
          </ToggleGroup>
          <Button variant={"outline"}>
            <Image src={print_i} className="mx-1" alt={"🖨️"} />
            Print
          </Button>
        </div>
        <ChatArea notes={notes} patientId={patientId} timeStamp={new Date()} />
        <div className="flex gap-2 items-center">
          <Input ref={inputRef} onChange={(e)=>{message.current = e.target.value}} className="rounded-full" />
          <Button onClick={handleAddNote} variant={"outline"} className="rounded-full w-12 h-12">{addNote.isPending? <DotsHorizontalIcon />: <PaperPlaneIcon className="-rotate-45" />}</Button>
        </div>
      </>
    )
  }
  