"use client"
import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AutoBreadcrumb from "@/components/custom/breadCrumb"
import { Button } from "@/components/ui/button"
import { useQuery } from "react-query"
import { fetchPatients } from "@/lib/getpatients"
import Link from "next/link"
 
export default function PatientPage(){
  const { data, isLoading, refetch, error } = useQuery(['patients'], fetchPatients);

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <AutoBreadcrumb/>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Add report</TableCell>
            </TableRow>
          </TableHead>
        </Table>
        <div className="flex flex-row space-y-3">
            <Skeleton className="h-[50px] w-[50px] rounded-xl" />
            <Skeleton className="h-4 w-[50px]" />
            <Skeleton className="h-4 w-[20px]" />
            <Skeleton className="h-4 w-[30px]" />
        </div>
      </div>
    );
  }
  return (
    <div className="container align-top mx-auto ">
      <AutoBreadcrumb/>
      <div className="float-right pr-10">
        <Button >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        {
          error?<p className="text-red">Unable to fetch try reloading</p>:<p />
        }
        </Button>
      </div>
      <br />
      <br />
      <Table className="rounded-md border">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Add report</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((patient) => (
            <TableRow key={patient._id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell className="flex">
                <Link className="ml-auto" href={'nurse/patient/'+patient._id}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}