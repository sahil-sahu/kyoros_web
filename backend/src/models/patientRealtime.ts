import { Schema, model, Document, Types } from 'mongoose';

interface IBloodPressureLog {
  bpm: number;
  bloodPressure: number;
  timestamp: Date;
}

interface IPatientRealtime extends Document {
  patientId: Types.ObjectId;
  log: IBloodPressureLog[];
}

const patientRealtimeSchema = new Schema<IPatientRealtime>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    log: [
      {
        bpm: { type: Number, required: true },
        bloodPressure: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Adding a maximum length constraint for the 'log' array
patientRealtimeSchema.path('log').validate((value: IBloodPressureLog[]) => {
  return value.length <= 800;
}, 'Maximum length of log array exceeded (800).');

const PatientRealtimeModel = model<IPatientRealtime>('PatientRealtime', patientRealtimeSchema);

export default PatientRealtimeModel;
