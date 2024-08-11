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
import { PatientInfoProps } from "@/types/pateintinfo"
import { bedInfo, ICUInfo } from "@/types/ICU"
import { getDateDifferenceFromNow } from "@/lib/daysCalc"
import PatientHistory from "../patientHistory"
import ageCalc from "@/lib/ageCalc"
import { axiosInstance, setheader } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

interface OverViewModel {
  icuName: string;
  bedName: string;
  admittedAt: string; //ISOString
  patientId: string;
  patient: PatientInfoProps;
  apache: number;
  bedId: number[];
  icuId: number[];
  diagnosis: string;
  comorbities: string[];
  summary: string;
  doctors: string;
}







export const columns: ColumnDef<OverViewModel>[] = [
  {
    accessorKey: "icuName",
    header: "ICU Bed",
    cell: ({ row }) => (
      <div className="hover:!underline-offset-4 min-w-24 m-auto">{row.getValue("icuName") || "--"+ " ,"+ (row.original?.bedName ?? "--")}</div>
    ),
  },
  {
    accessorKey: "patient.name",
    header: "Patient Name",
    cell: ({ row }) => <div className="m-auto capitalize">{row.getValue("patient_name")}</div>,
  },
  {
    accessorKey: "doctors",
    header: "Assigned Doctors",
    cell: ({ row }) => <div className="m-auto capitalize">{row.getValue("doctors")}</div>,
  },
  {
    accessorKey: "patient.dob",
    header: "Age/Sex",
    cell: ({ row }) => <div className="m-auto">{ageCalc(row.original.patient.dob)+"/"+row.original.patient.gender}</div>,
  },
  {
    accessorKey: "admittedAt",
    cell: ({ row }) => (
      <div className="capitalize pl-5 w-full m-auto">{getDateDifferenceFromNow(row.getValue("admittedAt"))}</div>
    ),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Days in ICU
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "apache",
    cell: ({ row }) => (
      <div className="capitalize pl-5 w-full m-auto">{row.getValue("apache")}</div>
    ),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Apache III
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  // {
  //   accessorKey: "patientId",
  //   header: "Patient History",
  //   cell: ({ row }) => (
  //     <PatientHistory patientId={row.getValue("patientId")} />
  //   ),
  // },
  {
    accessorKey: "patient.diagnosis",
    header: "Primary Diagnosis",
    cell: ({ row }) => <div className="m-auto">{row.original.patient.diagnosis}</div>,
  },
  {
    accessorKey: "summary",
    header: "Events",
    cell: ({ row }) => <div className="m-auto">{row.getValue("summary")}</div>,
  },
]

export const overViewFn = async (): Promise<OverViewModel[]> => {
  const response = await axiosInstance.get(`/hospital/overview`, {
      headers: await setheader(),
    });
  return response.data;
};

export function OverViewTable() {
  const overView = useQuery({queryKey:["overview"], queryFn:overViewFn})
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      patient_name:false
    })
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data:(overView.data || []),
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

  return (
    <div className="p-5 col-span-full max-w-[95vw] overflow-auto">
      <div className="flex items-center py-4 min-w-max">
        <h2 className="text-2xl font-semibold">
          Patients
        </h2>
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
                    {(typeof(column.columnDef.header) == "string")? column.columnDef.header?.toString() : column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="">
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
                  className="cursor-pointer"
                  onClick={()=>{
                    router.push(`/tracking?patient=${row.original.patientId}&icu=${row.original.icuId[row.original.icuId.length-1]}&bed=${row.original.bedId[row.original.bedId.length-1]}`)
                  }}
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
                  {overView.isLoading? "Loading...":"No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <div className="flex items-center justify-end space-x-2 py-4">
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
      </div> */}
    </div>
  )
}


export default OverViewTable;