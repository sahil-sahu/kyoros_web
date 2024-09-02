import sendTestNotification from '../helpers/testNotify';
import { fireAuth } from '../firebase';
import { prisma } from '../prisma';
import { AuthRequest } from '../types';

export const testNotification = async (req: AuthRequest, res: any) => {
  try {
      const {fireTokens} = await prisma.user.findUnique({
        where:{firebaseUid:req.user}
      });
      await sendTestNotification(fireTokens);
      await res.json({"notification":true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};