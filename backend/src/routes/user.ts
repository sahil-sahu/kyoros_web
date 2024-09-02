import { Router } from "express";
const router = Router();
import { testNotification } from "../controllers/userController";
import { verifyToken } from "../middleware/jwtCheck";

router.post('/test-notify', verifyToken, testNotification);

export default router;