import { Response, Request, NextFunction } from 'express';
import { sign, verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { AuthRequest } from '../../types';
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const apiKey = req.headers['x-api-key'];
      if(apiKey != process.env.NEWENTRY)
        return res.json({error: "Invalid ENTRY key"}).status(400);

      next();
    } catch (error) {
      res.status(403).json({ error: 'Invalid or expired token' });
    }
  };

export const verifySensor = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]

      if (token == null) return res.sendStatus(401)

      verify(token, process.env.SENSORSECRET as string, (err, user:string) => {
        if (err) throw "Invalid sensor";

        req.user = user;

        next()
      })
    } catch (error) {
      res.status(403).json({ error: 'Invalid Sensor token' });
    }
  };