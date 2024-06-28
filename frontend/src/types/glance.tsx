import { PatientInfoProps, Patientlog } from "./pateintinfo";

export interface GlanceInfo {
    name:string;
    id:number;
    patientId: string;
    icuId:number;
    bedStamp?: string;
    days?: number;
    latest?: Patientlog;
    // bedLogs:[Patientlog];
    pinned?:boolean;
    apache? :number;
    patient: PatientInfoProps;
}