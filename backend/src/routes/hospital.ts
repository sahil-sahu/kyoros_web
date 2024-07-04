import { Router } from "express";
import { getGlance, getHospitals, getICUs, getbeds } from "../controllers/hospitalController";
import { verifyToken } from "../middleware/jwtCheck";

const router = Router();

router.get("/icu", verifyToken,getICUs)
router.get("/getbeds", verifyToken, getbeds)
router.get("", getHospitals)
router.get("/glance", verifyToken,getGlance)


export default router;