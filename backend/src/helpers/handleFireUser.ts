import { fireAuth } from "../firebase"

const userExisting = async (email:string) => {
    try{
        const user = await fireAuth.getUserByEmail(email);
        return user.uid;
    }catch(err){
        console.error("Non existing user");
        return null;
    }
}

export const newUser = async (email:string, name:string) =>{
    const fireUser = await userExisting(email);
    if(fireUser) return fireUser;
    
    const user = await fireAuth.createUser({
        email,
        emailVerified: false,
        password: '12345678',
        displayName: name,
        disabled: false,
    })
    return user.uid;
}



export const deleteFireUser = async (uid:string) => {
    return await fireAuth.deleteUser(uid);
}