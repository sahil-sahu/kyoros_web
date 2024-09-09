import { fireAuth } from '../firebase';

export const generateResetLink = async (email:string) => {
    const link = await fireAuth.generatePasswordResetLink(email)
    return link;
}