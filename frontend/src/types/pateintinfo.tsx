export interface PatientInfoProps {
    name: string;
    age: number;
    gender: string;
    id: string;
    diagnosis?: string;
    dept?: string;
  }

export interface PatientRealtimeObj {
  bp:{bp_d:number;bp_s:number;};
  spo2:number;
  temp:number;
  critical: boolean;
  bpm:number;
  timestamp:string;
}

export interface Patientlog {
  id: string;
  bp: [number,number];
  heart_rate: number;
  pulse: number;
  resp_rate: number;
  spo2: number;
  temp: number;
  patientId: string;
  bedID: number;
  timeStamp: string;
  sensorid:string;
}

export const PatientInfoType: HealthParameter[] = ["bp", "heart_rate", "pulse", "resp_rate", "spo2", "temp"];

export type HealthParameter = "bp" | "heart_rate" | "pulse" | "resp_rate" | "spo2" | "temp";

export enum Timeline {
  m30 = "30m",
  h3 = "3h",
  h12 = "12h",
  d1 = "1D",
  d3 = "3D",
  d5 = "5D",
}

export interface PatientFormData {
    bloodTests: string;
    abgAnalysis: string;
    imagingStudies: string;
    nutritionalAssessment: string;
    drugLevels: string;
    fluidBalance: string;
    woundAssessment: string;
    rehabilitationProgress: string;
    cultureAndInfectionMarkers: string;
    ecgMonitoring: string;
    mentalHealthAssessment: string;
  }  