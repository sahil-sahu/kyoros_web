import { Router } from "express";
import { getGlance, getHospitals, getICUs, getICUs_w_unoccupied, getUsers, getbeds } from "../controllers/hospitalController";
import { verifyToken } from "../middleware/jwtCheck";

const router = Router();

router.get("/icu", verifyToken,getICUs)
router.get("/getbeds", verifyToken, getbeds)
router.get("/unoccupied", verifyToken, getICUs_w_unoccupied)
router.get("/users", verifyToken, getUsers)
router.get("", getHospitals)
router.get("/glance", verifyToken,getGlance)


export default router;