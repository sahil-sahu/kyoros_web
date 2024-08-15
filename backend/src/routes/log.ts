import { Router } from "express";
import { verifyToken } from "../middleware/jwtCheck";
import { getPatientLastLog, getPatientLogs, printLogs } from "../controllers/logController";

const router = Router();

router.get("/trend/:patientid", verifyToken,getPatientLogs)
router.get("/latest/:patientid", verifyToken,getPatientLastLog)
router.get("/print", verifyToken,printLogs)

export default router;