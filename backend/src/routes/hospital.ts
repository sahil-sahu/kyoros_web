import { Router } from "express";
import { getHospitals, getICUs } from "../controllers/hospitalController";
import { verifyToken } from "../middleware/jwtCheck";

const router = Router();

router.get("/icu", verifyToken,getICUs)
router.get("", getHospitals)

export default router;