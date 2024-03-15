import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { usePatientQuery } from "@/lib/getpatients";
import React from "react";

const PatientInfo = ({ patientid }:{patientid:string}) => {
    const { data:patientinfo, isLoading:p_isLoading, error:p_error } = usePatientQuery(patientid);
    return <Table className="w-3/4 align-center m-auto">
            <TableCaption>Patient Info</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead className="text-right">Gender</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            <TableRow key={1}>
                    <TableCell className="font-medium">{patientinfo?.name}</TableCell>
                    <TableCell>{patientinfo?.age}</TableCell>
                    <TableCell className="text-right">{patientinfo?.gender}</TableCell>
            </TableRow>
            </TableBody>
        </Table>;
}

export default PatientInfo;