export interface PatientInfoProps {
    name: string;
    age: number;
    gender: string;
    id: string;
  }

export interface PatientRealtimeObj {
  bp:{bp_d:number;bp_s:number;};
  spo2:number;
  temp:number;
  critical: boolean;
  bpm:number;
  timestamp:string;
}

export enum PatientInfoType {
  bp = "bp",
  bpm = "bpm",
  spo2 = "spo2",
  temp = "temp"
}

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