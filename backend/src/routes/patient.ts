import express, { Router } from 'express';
import { createPatient, createPatientPeriodic, getDocs, getLatestlog, getNotes, getPatientbyUhid, getPatients, makeNote, setCritcality } from '../controllers/patientController';
import { upload } from '../helpers/docUpload';
import { verifyToken } from '../middleware/jwtCheck';

const patientRouter: Router = express.Router();

patientRouter.post('/docupload', verifyToken ,upload.single("file"), createPatientPeriodic);
patientRouter.post('/notes', verifyToken , makeNote);
patientRouter.get('/:patient/notes', verifyToken , getNotes);
patientRouter.get('/:patient/docs', verifyToken, getDocs);
patientRouter.post('', createPatient);
patientRouter.get('', getPatients);
patientRouter.get('/byuhid', verifyToken, getPatientbyUhid);
patientRouter.get('/:patient', getPatients);
patientRouter.get('/:patient/realtimelog', getLatestlog)
patientRouter.post('/setcriticality', verifyToken, setCritcality);
export default patientRouter;