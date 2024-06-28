import express, { Router } from 'express';
import { createPatient, createPatientPeriodic, getDocs, getLatestlog, getPatients, setCritcality } from '../controllers/patientController';
import { upload } from '../helpers/docUpload';
import { verifyToken } from '../middleware/jwtCheck';

const patientRouter: Router = express.Router();

patientRouter.post('/docupload', upload.single("file"), createPatientPeriodic);
patientRouter.get('/:patient/docs', verifyToken, getDocs);
patientRouter.post('', createPatient);
patientRouter.get('', getPatients);
patientRouter.get('/:patient', getPatients);
patientRouter.get('/:patient/realtimelog', getLatestlog)
patientRouter.post('/setcriticality', verifyToken, setCritcality);
export default patientRouter;