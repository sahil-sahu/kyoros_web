  import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"
import { createContext, Dispatch, FormEvent, SetStateAction, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { getTimeFromISOString } from "@/lib/linechartformatter";
import { Button } from "../ui/button";

import print_i from "./print.png";
import Image from "next/image";
import { Input } from "../ui/input";
import { DotsHorizontalIcon, DotsVerticalIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { QueryFunctionContext, QueryObserverResult, RefetchOptions } from "@tanstack/query-core";
import { axiosInstance, setheader } from "@/lib/axios";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllotedUserforPatient, User } from "@/lib/getAllotedUserforPatient";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import Edit_Box from "@/lib/editNote";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"



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
const MessageContext = createContext<{ message: string; setMessage: Dispatch<SetStateAction<string>>; refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<ChatRes, Error>>; notesMap:Map<string, string>;}|undefined>(undefined);
const useMessage = () => useContext(MessageContext);

// const SuggestionBox = () =>{
//   return ();
// }

// const users = [
//   {
//     id: "clwx5wq8m0001l5vhyzhwtgiz",
//     email: "sahilku2003@gmail.com",
//     name:"Sahil"
//   },
//   {
//     id: "clx4e3ozt0001hamzyuamym2i",
//     email: "arpitbhal11@gmail.com",
//     name: "John"
//   }
// ]

const formatChat = (chat:string, setMessage: Dispatch<SetStateAction<string>>, users: User[]) =>{
  let chatArray = chat.split(" ");
  let len = chatArray.length -1;
  let tagged:string[] = [];
  let chatFormatted = chatArray.map((e,i) =>{
    if(e.charAt(0) == "@"){
      let email = e.slice(1)
      let user = users.find(e => e.email == email)
      if(user){
        tagged.push(user.id)
        return <span key={user.id} title={user.name} className="underline">{e+" "}</span>
      }
      if(i == len){
        return (
          <>
          <ul className="absolute origin-bottom bottom-10 bg-white border rounded">
            {users.map(e =>{
              return (
                <li className="hover:bg-slate-50 p-2 cursor-pointer" onClick={()=>{
                  setMessage((mss)=>{
                    let arr = mss.split(" ")
                    arr.pop();
                    arr.push("@"+e.email)
                    return arr.join(" ");
                  })
                }} key={e.id}>
                  {e.name+" "+e.email}
                </li>
              )
            })}
          </ul>
          <span key={e} className="">{e+" "}</span>
          </>
        )
      }
    }
    if(e.includes("\n")) return <><span key={e} className="">{e+" "}</span><br /></>;
    return <span key={e} className="">{e+" "}</span>;
  })
  if(chatArray[chatArray.length -1] == "") chatFormatted.push(<span key={"last"} className="text-transparent">.</span>);

  return [chatFormatted, tagged]
}
const getTagged = (chat:string, users: User[]) =>{
  let chatArray = chat.split(" ");
  let len = chatArray.length -1;
  let tagged:string[] = [];
  let chatFormatted = chatArray.map((e,i) =>{
    if(e.charAt(0) == "@"){
      let email = e.slice(1)
      let user = users.find(e => e.email == email)
      if(user){
        tagged.push(user.id)
        return <span key={user.id} title={user.name} className="underline text-c_lg_blue">{e+" "}</span>
      }
    }
    return <span key={e} className="">{e+" "}</span>;
  })

  return tagged
}

const ChatBox = ({name, createdAt, note, type, users, id}:ChatBox_t) =>{

  const MessageContext = useMessage();
  const [openEdit, setEdit] = useState(false);
  const arr = note.split(" ")
  const animate = (noteId:string)=>{
    const box = document.getElementById(noteId.slice(1))
    box?.classList.add("bg-gray-900")
    setTimeout(()=>{
      box?.classList.remove("bg-gray-900")
    }, 500)
  }
  let noteJsx: JSX.Element|null = null;
  let chatFormatted = arr.map((e,i) =>{
    if(e.charAt(0) == "#"){
      let note = MessageContext?.notesMap.get(e)
      if(note){
        noteJsx = <div onClick={()=>{animate(e)}} className="px-2  py-2 bg-[rgba(255,255,255,.075)] text-xs rounded-lg m-1.5 cursor-pointer" key={e}>
        <span className="block">
          Replied to:
        </span>
        <span >{note}</span>
      </div>
        return null;
      }
    }
    if(e.charAt(0) == "@"){
      let user = users.find(k => k.email == e.slice(1))
      if(user) return <span key={e} title={user.name+" "+user.email} className="underline">{"@"+user.name+" "}</span>
    }
    return <span key={e} className="">{e+" "}</span>
  })

  let chats = (
    <div className="text-sm">
    {noteJsx}
    <p className="px-4 ">{chatFormatted}</p>
    </div>
  )


  return (
    <ContextMenu>
      <ContextMenuTrigger className="chatbox flex gap-3 transition-all items-center w-fit">
      <>
      <div className="chatbox flex gap-3 items-center">
        <Checkbox />
        <div id={id} className={` py-2 text-white rounded-lg ${type.includes("doctor")? "bg-darkblue":"bg-[#4C8484]"}`}>
          <div className="px-4 font-bold flex justify-between">
            <p>{name}</p>
            <HoverCard>
              <HoverCardTrigger><DotsVerticalIcon/></HoverCardTrigger>
              <HoverCardContent className="text-sm font-normal p-0">
                <div className="hover:bg-slate-50 flex p-2 justify-between" onClick={()=>setEdit(true)}>Edit</div>
                <div onClick={()=>{
                  MessageContext?.setMessage("#"+id)
                }} className="hover:bg-slate-50 flex p-2 justify-between">Reply</div>
              </HoverCardContent>
            </HoverCard>
          </div>
          {chats}
          <p className="text-right text-xs px-4">{getTimeFromISOString(createdAt)}</p>
        </div>
      </div>
      {openEdit && <Edit_Box open={openEdit} setEdit={setEdit} refetch={MessageContext?.refetch ?? null} note={note} noteId={id} />}
      </>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={()=>setEdit(true)}>Edit</ContextMenuItem>
        <ContextMenuItem onClick={()=>{
                  MessageContext?.setMessage("#"+id)
                }}>Reply</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

// const dummy:ChatBox_t[] = [
//   {
//     "id": "1a2b3c4d",
//     "name": "Dr. Emily Watson",
//     "createdAt": "2024-07-01T09:15:30Z",
//     "note": "Patient is showing signs of improvement.",
//     "type": "doctor"
//   },
//   {
//     "id": "2b3c4d5e",
//     "name": "Nurse John Doe",
//     "createdAt": "2024-07-01T09:30:45Z",
//     "note": "Administered morning medication.",
//     "type": "nurse"
//   },
//   {
//     "id": "3c4d5e6f",
//     "name": "Dr. Michael Smith",
//     "createdAt": "2024-07-01T10:00:00Z",
//     "note": "Reviewed patient's lab results, everything is normal.",
//     "type": "doctor"
//   },
//   {
//     "id": "4d5e6f7g",
//     "name": "Nurse Anna Lee",
//     "createdAt": "2024-07-01T10:15:30Z",
//     "note": "Checked patient's vital signs, all within normal range.",
//     "type": "nurse"
//   },
//   {
//     "id": "5e6f7g8h",
//     "name": "Dr. David Brown",
//     "createdAt": "2024-07-01T11:00:00Z",
//     "note": "Discussed treatment plan with patient.",
//     "type": "doctor"
//   },
//   {
//     "id": "6f7g8h9i",
//     "name": "Nurse Sarah Johnson",
//     "createdAt": "2024-07-01T11:30:45Z",
//     "note": "Patient requested assistance with mobility.",
//     "type": "nurse"
//   }
// ]

export const fetchNotes = async ({queryKey}: QueryFunctionContext): Promise<ChatRes> => {
  const [_, patientId] = queryKey;
  const response = await axiosInstance.get(`/patient/${patientId}/notes`, {
      headers: await setheader(),
    });
  const notes: ChatRes = response.data;  
  return notes;
};
export const makeNote = async (body: {note:string; patientId:string; tagged:string[]}): Promise<ChatBox_t> => {
  const response = await axiosInstance.post(`/patient/notes`, body,{
      headers: await setheader(),
    });
  const note: ChatBox_t = response.data;  
  return note;
};

const ChatArea = ({patientId, timeStamp, notes}:{patientId:string, timeStamp:Date, notes:UseQueryResult<ChatRes, Error>}) =>{
  const [params, setparams] = useState<("all"|"doctor"|"nurse")>("all")
  const [chat, setchat] = useState<ChatBox_t[]>([])
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams);
  const dt = currentParams.get("dt")
  const usersRef = useQuery({queryKey:["users", patientId], queryFn:getAllotedUserforPatient})

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  },[params, notes.data, dt]);

  
  useEffect(()=>{
    if(params === "doctor") return setchat((notes.data?.notes || []).filter( k => k.type === "doctor"))
      if(params === "nurse") return setchat((notes.data?.notes || []).filter( k => k.type === "nurse"))
        return setchat((notes.data?.notes || [])) ;
    }, [params, notes.data])
    useLayoutEffect(()=>{
      if(dt && dt != "all") return setchat((notes.data?.notes || []).filter( k => {
        const date = new Date(k.createdAt);
        date.setHours(0,0,0,0)
        return date.toISOString() == dt
      }))
      return setchat((notes.data?.notes || [])) ;
    }, [dt, notes.data])
    
    return (
      <section className="chatarea h-max">
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
      <div ref={scrollRef} className="flex flex-col justify-start gap-4 my-2 max-h-[61dvh] mb-16 overflow-y-auto">
        {
          (chat.length == 0) && "No new messages"
        }
        {
          chat.map(e => <ChatBox id={e.id} key={e.id} users={usersRef.data || []} type={e.type} name={e.name} createdAt={e.createdAt} note={e.note} />)
        }
      </div>
    </section>
  );
}

export default function Notes({patientId}:{patientId:string}) {
    const [dayId, setDay] = useState<string>("day1");
    const notes = useQuery({queryKey:["notes", patientId], queryFn:fetchNotes})
    const [notesMap,setMap] = useState(new Map<string, string>())
    const usersRef = useQuery({queryKey:["users", patientId], queryFn:getAllotedUserforPatient})
    const addNote = useMutation({mutationFn:makeNote})
    const [message, setMessage] = useState("");
    const [focus, setFocus] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentParams = new URLSearchParams(searchParams);
    const inputRef = useRef<HTMLInputElement>(null);

    const inputDivRef = useRef<HTMLDivElement>(null);
    const {toast} = useToast();
    const bedStamp = notes.data?.bedStamp ?? ""

    useEffect(()=>{
      if(notes.data?.notes){
        setMap(new Map(notes.data.notes.map(e => ["#"+e.id, e.note])))
      }
    },[notes.data])

    const getDays = useCallback(() => {
      const dateObj1 = new Date(bedStamp);
      const dateObj2 = new Date();
      dateObj1.setHours(0,0,0,0)
      dateObj2.setHours(0,0,0,0)
  
      const timeDiff = Math.abs(dateObj2.getTime() - dateObj1.getTime());
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const days = [];
      for(let i = 1; i <= dayDiff+1; i++) {
        let iso = new Date(dateObj1.getTime() + 1000 * 3600 * 24 * (i-1));
        days.push({
          day: `Day ${i}`,
          id: iso.toISOString(),
        })
      }
      return days;
    }, [bedStamp]);

    const handleAddNote = async () => {
      if(message === "") return;
      // console.log(message)
      try {
        await addNote.mutateAsync({note:message, patientId, tagged: getTagged(message, usersRef.data || [])})
        setMessage("")
        notes.refetch()
      } catch (error) {
        console.error(error)
        toast({description: "failed add notes", variant:"destructive"})
      }
    }
    return (
      <div className="h-full items-stretch relative">
        <div className="flex justify-between">
          <ToggleGroup defaultValue={"all"} className="notes w-full justify-start grid grid-cols-5" type="single" onValueChange={(val)=>{
            currentParams.set("dt", val)
            router.push('/tracking?'+currentParams.toString())
            setDay(val)
          }}>
              <ToggleGroupItem key={"all"} value={"all"} aria-label="Toggle bold">
                  <a href={"#"}>
                    {"All"}
                  </a>
                </ToggleGroupItem>
              {getDays().map(e => (
                <ToggleGroupItem key={e.id} value={e.id} aria-label="Toggle bold">
                  <a href={"#"+e.id}>
                    {e.day}
                  </a>
                </ToggleGroupItem>
              ))}
          </ToggleGroup>
          <Button variant={"outline"}>
            <Image src={print_i} className="mx-1" alt={"🖨️"} />
            Print
          </Button>
        </div>
        <MessageContext.Provider value={{message, setMessage, refetch: notes.refetch, notesMap}}>
          <ChatArea notes={notes} patientId={patientId} timeStamp={new Date()} />
        </MessageContext.Provider>
        <form onSubmit={(e)=>{
          e.preventDefault()
          handleAddNote()
        }} className="flex gap-2 float-end absolute bottom-12 w-full items-center">
          {/* <Input ref={inputRef} onChange={(e)=>setMessage(e.target.value)} className="rounded-full" /> */}
          <div onFocus={(e)=>{
            inputRef.current?.focus()
          }} className="rounded-full text-sm p-2 min-h-8 w-full border relative">
          <div className="w-auto pl-1 relative">{formatChat(message, setMessage, usersRef.data || [])[0]}
            {/* {focus && <div className="h-full w-0 border-l border-l-black animate-caret-blink inline"></div>} */}
          </div>
          <Input value={message} ref={inputRef} onBlur={()=>{
            setFocus(false)
          }} onFocus={(e)=>{
            setFocus(true)
          }} onChange={(e)=>setMessage(e.target.value)} className="absolute w-full left-0 h-full border-none top-0" />
          {/* <div style={{
            visibility:"hidden"
          }} ref={inputDivRef} className="inline h-8 border absolute top-1 left-1" contentEditable={true} onInput={(e)=> setMessage(inputDivRef.current?.innerText ?? "")}>
          </div> */}
          </div>
          <Button type="submit" variant={"outline"} className="rounded-full w-12 h-12">{addNote.isPending? <DotsHorizontalIcon />: <PaperPlaneIcon className="-rotate-45" />}</Button>
        </form>
      </div>
    )
  }
  