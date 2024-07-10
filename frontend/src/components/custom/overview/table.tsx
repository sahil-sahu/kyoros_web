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

interface OverViewModel {
  icuName: string;
  bedName: string;
  admissionDt: string; //ISOString
  patientId: string;
  patient: PatientInfoProps;
  apache: number;
  diagnosis: string;
  comorbities: string[];
  summary: string;  
}

const data: OverViewModel[] = [
  {
    icuName: "ICU-1",
    bedName: "Bed-A",
    admissionDt: "2024-06-10T08:00:00Z",
    patientId: "patient-001",
    patient: {
      id: "patient-001",
      uhid: "UHID-12345",
      gender: "Male",
      name: "John Doe",
      diagnosis: "Sepsis",
      dept: "Critical Care",
      comorbidities: ["Hypertension"],
      Surgeries: ["Appendectomy"],
      Medicines: ["Paracetamol"],
      age: 45,
      email: "john.doe@example.com",
      phone: "123-456-7890",
      hospitalId: "hospital-001",
      apache: 25,
      bedId: 101
    },
    apache: 25,
    diagnosis: "Sepsis",
    comorbities: ["Hypertension"],
    summary: "Patient admitted with sepsis. Hypertension is controlled."
  },
  {
    icuName: "ICU-2",
    bedName: "Bed-B",
    admissionDt: "2024-06-11T09:30:00Z",
    patientId: "patient-002",
    patient: {
      id: "patient-002",
      gender: "Female",
      name: "Jane Smith",
      diagnosis: "Pneumonia",
      dept: "Pulmonology",
      comorbidities: ["Asthma"],
      Surgeries: [],
      Medicines: ["Albuterol"],
      age: 60,
      email: "jane.smith@example.com",
      phone: "098-765-4321",
      hospitalId: "hospital-002",
      bedId: 102
    },
    apache: 30,
    diagnosis: "Pneumonia",
    comorbities: ["Asthma"],
    summary: "Patient admitted with severe pneumonia. Asthma exacerbated."
  },
  {
    icuName: "ICU-3",
    bedName: "Bed-C",
    admissionDt: "2024-06-12T10:15:00Z",
    patientId: "patient-003",
    patient: {
      id: "patient-003",
      uhid: "UHID-67890",
      gender: "Male",
      name: "Robert Brown",
      diagnosis: "Myocardial Infarction",
      dept: "Cardiology",
      comorbidities: ["Diabetes"],
      Surgeries: ["Angioplasty"],
      Medicines: ["Aspirin"],
      age: 55,
      email: "robert.brown@example.com",
      phone: "555-555-5555",
      hospitalId: "hospital-003",
      apache: 40,
      bedId: 103
    },
    apache: 40,
    diagnosis: "Myocardial Infarction",
    comorbities: ["Diabetes"],
    summary: "Patient admitted with a heart attack. Diabetes management required."
  },
  {
    icuName: "ICU-4",
    bedName: "Bed-D",
    admissionDt: "2024-06-13T11:00:00Z",
    patientId: "patient-004",
    patient: {
      id: "patient-004",
      gender: "Female",
      name: "Emily Davis",
      diagnosis: "Stroke",
      dept: "Neurology",
      comorbidities: ["Hypertension", "Diabetes"],
      Surgeries: [],
      Medicines: ["Lisinopril"],
      age: 70,
      email: "emily.davis@example.com",
      phone: "222-333-4444",
      hospitalId: "hospital-004",
      bedId: 104
    },
    apache: 35,
    diagnosis: "Stroke",
    comorbities: ["Hypertension", "Diabetes"],
    summary: "Patient admitted with a stroke. Multiple comorbidities."
  },
  {
    icuName: "ICU-5",
    bedName: "Bed-E",
    admissionDt: "2024-06-14T12:30:00Z",
    patientId: "patient-005",
    patient: {
      id: "patient-005",
      uhid: "UHID-54321",
      gender: "Male",
      name: "Michael Wilson",
      diagnosis: "Renal Failure",
      dept: "Nephrology",
      comorbidities: ["Hypertension"],
      Surgeries: ["Kidney Transplant"],
      Medicines: ["Cyclosporine"],
      age: 50,
      email: null,
      phone: "666-777-8888",
      hospitalId: "hospital-005",
      bedId: 105
    },
    apache: 45,
    diagnosis: "Renal Failure",
    comorbities: ["Hypertension"],
    summary: "Patient admitted with renal failure. Recent kidney transplant."
  }
];






export const columns: ColumnDef<OverViewModel>[] = [
  {
    accessorKey: "icuName",
    header: "ICU Bed",
    cell: ({ row }) => (
      <div className="hover:!underline-offset-4 min-w-24 m-auto">{row.getValue("icuName")+ " ,"+ row.original.bedName}</div>
    ),
  },
  {
    accessorKey: "patient.age",
    header: "Age/Sex",
    cell: ({ row }) => <div className="m-auto">{row.original.patient.age+"/"+row.original.patient.gender}</div>,
  },
  {
    accessorKey: "admissionDt",
    cell: ({ row }) => (
      <div className="capitalize m-auto text-center">{getDateDifferenceFromNow(row.getValue("admissionDt"))}</div>
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
      <div className="capitalize m-auto text-center">{row.getValue("apache")}</div>
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
  {
    accessorKey: "patientId",
    header: "Patient History",
    cell: ({ row }) => (
      <PatientHistory patientId={row.getValue("patientId")} />
    ),
  },
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

export function OverViewTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
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
                    {column.id}
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