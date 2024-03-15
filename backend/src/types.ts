import { Request } from 'express';
import * as admin from 'firebase-admin';
import { Document, Types } from 'mongoose';
export interface AuthRequest extends Request {
    user?: string;
  }

export interface IPatientPeriodic extends Document {
    patientId: Types.ObjectId; // Foreign key
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

export interface IPatient extends Document {
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
}

export interface Patientlog {
  bp: number;
  bpm: number;
  timestamp: string;
}