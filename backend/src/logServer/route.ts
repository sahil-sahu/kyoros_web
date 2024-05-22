import { addLog } from "./controller";
import { verifySensor, verifyToken } from "./middleware/verfier";

const express = require('express');
const router = express.Router();

router.post('', verifySensor, addLog);

export default router;