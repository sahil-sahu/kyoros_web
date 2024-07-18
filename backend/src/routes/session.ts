import { Router } from "express";
import { verifyToken } from "../middleware/jwtCheck";
import { makeSession } from "../controllers/sessionController";

const router = Router();

router.post("/make", verifyToken, makeSession)


export default router;