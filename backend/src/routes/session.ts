import { Router } from "express";
import { verifyToken } from "../middleware/jwtCheck";
import { discharge, getSessionsActive, makeSession, transfer } from "../controllers/sessionController";

const router = Router();

router.post("/make", verifyToken, makeSession)
router.post("/transfer", verifyToken, transfer)
router.post("/discharge", verifyToken, discharge)
router.get("/activesessions", verifyToken, getSessionsActive)


export default router;