import express, { Router } from 'express';
import { createPatient, createPatientPeriodic, getLatestlog, getPatients } from '../controllers/patientController';

const patientRouter: Router = express.Router();

patientRouter.post('/periodic', createPatientPeriodic);
patientRouter.post('', createPatient);
patientRouter.get('', getPatients);
patientRouter.get('/:patient', getPatients);
patientRouter.get('/:patient/realtimelog', getLatestlog)
export default patientRouter;