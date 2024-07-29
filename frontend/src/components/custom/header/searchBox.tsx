"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useQuery } from "@tanstack/react-query"
import { searchPatient } from "./query/searchPatient"
import { Search, SearchCheckIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { PatientInfoProps } from "@/types/pateintinfo"
import Fuse from 'fuse.js'

const fuseOptions = {
	// isCaseSensitive: false,
	// includeScore: false,
	// shouldSort: true,
	// includeMatches: false,
	// findAllMatches: false,
	// minMatchCharLength: 1,
	// location: 0,
	// threshold: 0.6,
	// distance: 100,
	// useExtendedSearch: false,
	// ignoreLocation: false,
	// ignoreFieldNorm: false,
	// fieldNormWeight: 1,
	keys: [
		"name",
		"uhid",
	]
};


export default function SearchBox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const router = useRouter();
  const debounce = React.useRef(setTimeout(() => {}, 1000));
  const fuseRef= React.useRef(new Fuse([] as PatientInfoProps[], fuseOptions));
  const [patient, setpatient] = React.useState<PatientInfoProps[]>([]);
  const resultPatients = useQuery({queryKey:["search"], queryFn:searchPatient})
    const onSubmit = (data: FormData) => {
        resultPatients.refetch()
      };
  React.useEffect(()=>{
    if(resultPatients.data){
      fuseRef.current = new Fuse(resultPatients.data, fuseOptions)
    }
  },[resultPatients.data])
  React.useEffect(()=>{
    if(value == "") return setpatient(resultPatients.data || []);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      console.log("hi")
      setpatient(fuseRef.current.search(value).map(({item})=>item))
    }, 500);
    }
  ,[resultPatients.data, value])
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] px-2 justify-evenly"
        >
          Search patient
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="S p-0">
        <Command>
          <Input onChange={(e)=>{setValue(e.target.value)}} placeholder="Enter Name or UHID" className="h-9"  />
          <CommandList>
          <CommandEmpty>No patient found.</CommandEmpty>
          <CommandGroup>
          {(patient).map((patient) => (
                <CommandItem
                key={patient.id}
                value={patient.uhid}
                className="capitalize"
                onSelect={(currentValue) => {
                    setValue(currentValue)
                    router.push("/tracking?patient="+patient.id)
                    setOpen(false)
                }}
                >
                { patient.uhid+" "+patient.name}
                <CheckIcon
                    className={cn(
                        "ml-auto h-4 w-4",
                        value === patient.uhid ? "opacity-100" : "opacity-0"
                    )}
                    />
                </CommandItem>
            ))}
          </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
