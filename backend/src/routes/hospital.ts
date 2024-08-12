import { Router } from "express";
import { adminInsights, adminTrends, getGlance, getHospitals, getICUs, getICUs_w_unoccupied, getOccupancy, getOverviewforUser, getUsers, getbeds, getbedsAll } from "../controllers/hospitalController";
import { verifyToken } from "../middleware/jwtCheck";

const router = Router();

router.get("/icu", verifyToken,getICUs)
router.get("/getbeds", verifyToken, getbeds)
router.get("/getbedsall", verifyToken, getbedsAll)
router.get("/unoccupied", verifyToken, getICUs_w_unoccupied)
router.get("/admin/insights", adminInsights)
router.get("/admin/trends", adminTrends)
router.get("/users", verifyToken, getUsers)
router.get("", getHospitals)
router.get("/glance", verifyToken,getGlance)
router.get("/overview", verifyToken, getOverviewforUser)
router.get("/occupancy", verifyToken, getOccupancy)


export default router;