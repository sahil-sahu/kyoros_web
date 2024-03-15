import { fireAuth } from '../firebase';
import { AuthRequest } from '../types';

import { Response, NextFunction } from 'express';

// Sign-up data validation middleware


  // JWT middleware
  export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
      }
      const token = authHeader.split(' ')[1];

      // Verify the token using Firebase Admin SDK
      const decodedToken = await fireAuth.verifyIdToken(token);

      // Add the decoded token to the request object
      req.user = decodedToken.uid;

      next();
    } catch (error) {
      res.status(403).json({ error: 'Invalid or expired token' });
    }
  };