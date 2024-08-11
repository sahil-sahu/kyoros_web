import user_from_redis from "./userfromRedis";

export const usersNames = async (users:string[]):Promise<string> =>{
    const names = await Promise.all(users.map(async (user) => {
        const userDetails = await user_from_redis(user);
        return userDetails.name;
    }))
    return names.join(", ");
}