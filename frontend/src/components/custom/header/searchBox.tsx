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

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export default function SearchBox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const router = useRouter()
  const resultPatients = useQuery({queryKey:["search"], queryFn:searchPatient})
    const onSubmit = (data: FormData) => {
        resultPatients.refetch()
      };
      
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? ((resultPatients.data || [])).find((patient) => patient.uhid === value)?.name
            : "Search patient"}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="S p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
          {(resultPatients.data || []).map((patient) => (
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
