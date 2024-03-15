import { Schema, model} from 'mongoose';
import { IPatientPeriodic } from '../types';



const PatientPeriodicSchema = new Schema<IPatientPeriodic>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    bloodTests: { type: String, required: true },
    abgAnalysis: { type: String, required: true },
    imagingStudies: { type: String, required: true },
    nutritionalAssessment: { type: String, required: true },
    drugLevels: { type: String, required: true },
    fluidBalance: { type: String, required: true },
    woundAssessment: { type: String, required: true },
    rehabilitationProgress: { type: String, required: true },
    cultureAndInfectionMarkers: { type: String, required: true },
    ecgMonitoring: { type: String, required: true },
    mentalHealthAssessment: { type: String, required: true },
  },
  { timestamps: true }
);

const PatientPeriodicModel = model<IPatientPeriodic>('PatientPeriodic', PatientPeriodicSchema);

export default PatientPeriodicModel;
