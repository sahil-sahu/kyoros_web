import { addLog } from "./controller";
import { verifyToken } from "./middleware/verfier";

const express = require('express');
const router = express.Router();

router.post('', verifyToken, addLog);

export default router;