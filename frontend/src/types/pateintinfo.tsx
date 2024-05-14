export interface PatientInfoProps {
    name: string;
    age: number;
    gender: string;
  }

export interface PatientRealtimeObj {
  bp_d:number;
  bp_s:number;
  spo2:number;
  temp:number;
  critical: boolean;
  bpm:number;
  timestamp:string;
}

export enum PatientInfoType {
  bp_d = "bp_d",
  bp_s = "bp_s",
  bpm = "bpm",
  spo2 = "spo2",
  temp = "temp"
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