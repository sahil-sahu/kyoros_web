"use client"
import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  OpenInNewWindowIcon,
  ReloadIcon,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import extractFileType from "@/lib/extensionFinder"
import { User } from "./query/getusers"
import { EditUser } from "./user"

const serializeWatcherIcu = (watcher:{
    id: number;
    icu: {
        id: number;
        name: string;
    };
}[]) => {
    return watcher.map(e => e.icu.name).join(', ');
}

export const columns: ColumnDef<User>[] = [
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
      <div>{row.getValue("name")}</div>
        ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div>{row.getValue("email")}</div>
        ),
  },
  {
    accessorKey: "userType",
    header: "Type",
    cell: ({ row }) => <div className="capitalize">{row.getValue("userType")}</div>,
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <div className="">{row.getValue("department")||"--"}</div>
    ),
  },
  {
    accessorKey: "watcher",
    header: "Tagged To",
    cell: ({ row }) => (
      <div className="">{serializeWatcherIcu(row.getValue("watcher"))}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {

      return (
        <EditUser user={row.original} />
      )
    },
  },
]

export function DataTable({data, refetch}:{data:User[];refetch: () => void}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [tag, setTag] = React.useState<""|"All"|"Doctor"|"Nurse"|"Admin"|"Lab">("")
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
    table.getColumn("userType")?.setFilterValue(tag.toLowerCase())
  },[tag, table])

  return (
    <>
    <section className="w-full bg-gray-100 flex flex-col gap-2 p-2 py-4">
        <ul className="flex justify-evenly items-center gap-4">
            <li className="font-bold text-lg">
                Filter:
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox className="" onClick={()=>setTag("")} checked={tag==""} id="all" />
                <Label htmlFor="all">All</Label>
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox onClick={()=>setTag("Doctor")} checked={tag=="Doctor"} id="Doctors"></Checkbox>
                <Label htmlFor="Doctors">Doctors</Label>
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox onClick={()=>setTag("Nurse")} checked={tag=="Nurse"} id="Nurses"></Checkbox>
                <Label htmlFor="Nurses">Nurses</Label>
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox onClick={()=>setTag("Admin")} checked={tag=="Admin"} id="Admins"></Checkbox>
                <Label htmlFor="Admins">Admins</Label>
            </li>
            <li className="flex justify-between items-center gap-2">
                <Checkbox onClick={()=>setTag("Lab")} checked={tag=="Lab"} id="Labs"></Checkbox>
                <Label htmlFor="Labs">Labs</Label>
            </li>
        </ul>
    </section>
    <div className="w-full p-5">
      <div className="flex items-center w-full justify-between py-4">
        <div className="flex items-center">
        <Button variant={"outline"} className="mx-2" onClick={refetch}><ReloadIcon /></Button>    
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
                  key={row.original.id}
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
