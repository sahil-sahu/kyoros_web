// pages/index.tsx
"use client";
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { setFcm } from './mutation';
import { useRouter } from 'next/navigation';
import { app } from '@/lib/firebase';
import NavBox from '@/components/custom/header/header';
import { Checkbox } from "@/components/ui/checkbox"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export type Alert = {
  id: string
  title: string
  status: "critical" | "normal"
  feed: string
  timestamp : string
}

const columns: ColumnDef<Alert>[] = [
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
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "timestamp",
    header: "Time",
  },
]

function getData(): Alert[] {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      title: "Critical Alert",
      status: "critical",
      feed: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "2024-05-13T12:00:00Z",
    },
    {
      id: "2",
      title: "Normal Alert",
      status: "normal",
      feed: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      timestamp: "2024-05-13T12:30:00Z",
    },
    // Add more dummy data as needed
  ];
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })
  return (
    <div className="rounded-md border">
      <Table>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}


export default function Messaging() {
    const { mutate, isPending:isLoading, error, data } = useMutation({mutationFn:setFcm});
    const router = useRouter();
    useEffect(() => {

    if(data){
        // router.back();
    }

    const requestNotificationPermission = async () => {
      if(!isSupported()){
        alert("notification not supported on this browser");
        router.back();
      } 
      const messaging = getMessaging(app);
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {vapidKey:process.env.NEXT_PUBLIC_FCM});
        mutate({token});
      } else {
        console.log('Notification permission denied');
      }
    };

    requestNotificationPermission();
  }, [data, mutate, router]);

  // if(isLoading){
  //   return <div>subscribing our services</div>
  // }

  return (
    <main>
      <NavBox title={"Notifications"}></NavBox>
      <section>
        <h2>
          Critical
        </h2>
        <DataTable columns={columns} data={getData()} />
      </section>
    </main>
  );
}