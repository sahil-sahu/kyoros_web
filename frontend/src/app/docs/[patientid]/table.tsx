"use client"
import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  OpenInNewWindowIcon,
} from "@radix-ui/react-icons"
import { Label } from "@/components/ui/label"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { PatientDoc } from "@/types/patientDoc"




const data: PatientDoc[] = [
    {
        id: 1,
        createdAt: "2024-02-02T11:09:19.585953",
        name: "XkkijXi",
        s3Link: "https://s3.amazonaws.com/JVMFQkHUeW",
        tag: "Pathology"
    },
    {
        id: 2,
        createdAt: "2023-07-10T11:09:19.586036",
        name: "3jRDroU1gf",
        s3Link: "https://s3.amazonaws.com/WPnCqgoqG9",
        tag: "Radiology"
    },
    {
        id: 3,
        createdAt: "2023-08-25T11:09:19.586078",
        name: "97GN3GwD",
        s3Link: "https://s3.amazonaws.com/WcY5woQP6L",
        tag: "Microbiology"
    },
    {
        id: 4,
        createdAt: "2023-07-29T11:09:19.586118",
        name: "OfM1QXOGCQ",
        s3Link: "https://s3.amazonaws.com/YvUVeITziY",
        tag: "General"
    },
    {
        id: 5,
        createdAt: "2023-12-06T11:09:19.586150",
        name: "Tx1O3YP5p",
        s3Link: "https://s3.amazonaws.com/vhpAKcmVes",
        tag: "Pathology"
    },
    {
        id: 6,
        createdAt: "2023-08-04T11:09:19.586176",
        name: "B7ELF3Ci",
        s3Link: "https://s3.amazonaws.com/oHcVtRu4gA",
        tag: "Radiology"
    },
    {
        id: 7,
        createdAt: "2024-05-04T11:09:19.586222",
        name: "tF5wH4",
        s3Link: "https://s3.amazonaws.com/W6Q88f6KHG",
        tag: "Microbiology"
    },
    {
        id: 8,
        createdAt: "2024-02-18T11:09:19.588098",
        name: "4acEmnK",
        s3Link: "https://s3.amazonaws.com/i6yANRnF7C",
        tag: "General"
    },
    {
        id: 9,
        createdAt: "2023-12-08T11:09:19.588126",
        name: "wyrcVXRK",
        s3Link: "https://s3.amazonaws.com/OFPUISG8p0",
        tag: "Pathology"
    },
    {
        id: 10,
        createdAt: "2023-11-27T11:09:19.588148",
        name: "YRFgPL",
        s3Link: "https://s3.amazonaws.com/4CXp6DDh05",
        tag: "Radiology"
    }
];

function formatDateString(isoString: string): string {
    const date = new Date(isoString);

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    return date.toLocaleString('en-US', options).replace(',', ' at');
}

export const columns: ColumnDef<PatientDoc>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link target="_blank" href={row.original.s3Link} className="capitalize hover:underline-offset-4"><span className="hover:!underline-offset-4">{row.getValue("name")}</span><OpenInNewWindowIcon className="inline mx-1"/></Link>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created at
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="">{formatDateString(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "tag",
    header: "Tag",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tag")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DataTableDemo({data}:{data:PatientDoc[]}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [tag, setTag] = React.useState<""|"Pathology"|"Radiology"|"Microbiology"|"General">("")
  const [filter, setFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  React.useEffect(()=>{
    table.getColumn("name")?.setFilterValue(filter)
    table.getColumn("tag")?.setFilterValue(tag)
  },[filter, tag, table])

  return (
    <>
    <section className="w-full bg-gray-100 flex flex-col gap-16 md:flex-row justify-center p-2">
        <ul className="flex justify-evenly items-center gap-4">
            <li className="font-bold text-lg">
                Filter:
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox className="bg-c_lg_blue" onClick={()=>setTag("")} checked={tag==""} id="all" />
                <Label htmlFor="all">All</Label>
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox onClick={()=>setTag("Pathology")} checked={tag=="Pathology"} id="Pathology"></Checkbox>
                <Label htmlFor="Pathology">Pathology</Label>
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox onClick={()=>setTag("Radiology")} checked={tag=="Radiology"} id="Radiology"></Checkbox>
                <Label htmlFor="Radiology">Radiology</Label>
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox onClick={()=>setTag("Microbiology")} checked={tag=="Microbiology"} id="Microbiology"></Checkbox>
                <Label htmlFor="Microbiology">Microbiology</Label>
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox onClick={()=>setTag("General")} checked={tag=="General"} id="General"></Checkbox>
                <Label htmlFor="General">General</Label>
            </li>
        </ul>
    </section>
    <div className="w-full p-5">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter name..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
    </>
  )
}
