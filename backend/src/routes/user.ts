import { Router } from "express";
const router = Router();
import { resetPassword, testNotification } from "../controllers/userController";
import { verifyToken } from "../middleware/jwtCheck";

router.post('/test-notify', verifyToken, testNotification);
router.post('/reset', verifyToken, resetPassword);

export default router;