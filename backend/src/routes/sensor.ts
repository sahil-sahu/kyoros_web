import { Router } from "express";
import { verifyToken } from "../middleware/jwtCheck";
import { getSensors, setSensor } from "../controllers/sensorController";

const router = Router();

router.post("/setsensor", verifyToken, setSensor)
router.get("", verifyToken, getSensors)

export default router;