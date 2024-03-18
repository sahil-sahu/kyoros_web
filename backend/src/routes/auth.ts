const express = require('express');
const router = express.Router();
import { setFCM, signin, signup } from "../controllers/authController";
import { verifyToken } from "../middleware/jwtCheck";

// Sign-up route
router.post('/signup', verifyToken, signup);
router.post('/set-fcm', verifyToken, setFCM);

// Sign-in route
router.post('/signin', signin);

export default router;