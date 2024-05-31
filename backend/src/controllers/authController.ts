import { fireAuth } from '../firebase';
import { prisma } from '../prisma';
import { AuthRequest } from '../types';

export const signup = async (req: AuthRequest, res: any) => {
  try {
    if(req.user){
      const { email, userType, hospitalId } = req.body;
      const user =  await prisma.user.create({
        data:{
          userType,
          email,
          firebaseUid: req.user,
          hospitalId
        }
      })
      // const user = new User({ userType, email,firebaseUid: req.user });
      // await user.save();
      await fireAuth.setCustomUserClaims(req.user, {userType,hospitalId});
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
      const {fireTokens} = await prisma.user.findUnique({
        where:{firebaseUid:req.user}
      });

      if(!fireTokens.includes(token)){
        fireTokens.push(token);
        await prisma.user.update({
          where:{firebaseUid:req.user},
          data:{
            fireTokens
          }
        })
      }
      res.json({"fcmSet":true});
    }else{
      console.log("mai ka choda");
      throw "unauthorised";
    }
  } catch (error) {
    console.error(error);
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