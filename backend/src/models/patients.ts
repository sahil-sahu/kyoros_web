import { Schema, model, Document } from 'mongoose';
import { IPatient } from '../types';



const PatientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String }
});

const PatientModel = model<IPatient>('Patient', PatientSchema);

export default PatientModel;
