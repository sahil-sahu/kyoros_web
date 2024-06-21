import { PatientInfoProps, Patientlog } from "./pateintinfo";

export interface GlanceInfo {
    name:string;
    id:number;
    patientId: string;
    icuId:number;
    updatedAt: string;
    days?: number;
    bedLogs:[Patientlog];
    pinned?:boolean;
    criticality: [{criticality:number;}] | [];
    patient: PatientInfoProps;
}