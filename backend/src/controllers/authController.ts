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

export const setFCM = async (req: AuthRequest, res: any) => {
  try {
    if(req.user){
      const { token } = req.body;
      const user = await User.updateOne({firebaseUid: req.user}, {$set:{fireToken:token}});
      res.json({"fcmSet":true});
    }else{
      console.log("mai ka choda");
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