import { Response, Request, NextFunction } from 'express';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      next();
    } catch (error) {
      res.status(403).json({ error: 'Invalid or expired token' });
    }
  };