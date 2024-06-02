import { Router } from "express";
import { verifyToken } from "../middleware/jwtCheck";
import { getPatientLastLog, getPatientLogs } from "../controllers/logController";

const router = Router();

router.get("/trend/:patientid", verifyToken,getPatientLogs)
router.get("/latest/:patientid", verifyToken,getPatientLastLog)

export default router;