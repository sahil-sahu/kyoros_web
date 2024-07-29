import express, { Router } from 'express';
import { createPatient, createPatientPeriodic, getBedInfobyPatient, getDocs, getLatestlog, getNotes, getPatient, getPatientbyUhid, getPatients, makeNote, searchPatients, setCritcality } from '../controllers/patientController';
import { upload } from '../helpers/docUpload';
import { verifyToken } from '../middleware/jwtCheck';

const patientRouter: Router = express.Router();

patientRouter.post('/docupload', verifyToken ,upload.single("file"), createPatientPeriodic);
patientRouter.post('/notes', verifyToken , makeNote);
patientRouter.get('/:patient/notes', verifyToken , getNotes);
patientRouter.get('/:patient/docs', verifyToken, getDocs);
patientRouter.post('', createPatient);
patientRouter.get('', verifyToken, getPatients);
patientRouter.get('/search', verifyToken,searchPatients);
patientRouter.get('/byuhid', verifyToken, getPatientbyUhid);
patientRouter.get('/:patient', getPatient);
patientRouter.get('/:patient/realtimelog', getLatestlog)
patientRouter.post('/setcriticality', verifyToken, setCritcality);
patientRouter.get('/getBedInfobyPatient', verifyToken, getBedInfobyPatient);
export default patientRouter;