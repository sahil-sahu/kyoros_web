import { Patientlog } from "./pateintinfo";

export interface GlanceInfo {
    name:string;
    id:number;
    patientId: string;
    icuId:number;
    bedLogs:[Patientlog];
}