export interface PatientInfoProps {
    name: string;
    age: number;
    gender: string;
  }

export interface PatientRealtimeObj {
  bp:number;
  bpm:number;
  timestamp:string;
}

export enum PatientInfoType {
  bp = "bp",
  bpm = "bpm"
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