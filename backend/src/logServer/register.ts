import { Request, Response, Router } from "express";
import { verifyToken } from "./middleware/verfier";
import { prisma } from "../prisma";
import { sign } from "jsonwebtoken";
import * as dotenv from 'dotenv';
const registerRouter = Router();

registerRouter.post('', verifyToken, async(req:Request,res:Response) => {
    try {
        const {hospitalId, name} = req.body;
        const sensor = await prisma.sensor.create({data:{hospitalId, username: name}});
        const token = sign(sensor.id, process.env.SENSORSECRET)
        return res.json({...sensor, token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default registerRouter;