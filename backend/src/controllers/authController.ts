import { fireAuth } from '../firebase';
import User from '../models/user';
import { AuthRequest } from '../types';

interface SignUpData {
  email: string;
}

interface SignInData {
  email: string;
}

export const signup = async (req: AuthRequest, res: any) => {
  try {
    if(req.user){
      const { email, userType } = req.body;
      const user = new User({ userType, email,firebaseUid: req.user });
      await user.save();
      await fireAuth.setCustomUserClaims(req.user, {userType});
      res.json(user);
    }else{
      throw "unauthorised";
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signin = async (req: any, res: any) => {
  try {
    const token = fireAuth.createCustomToken(req.body.uid);
    return res.json({token});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};