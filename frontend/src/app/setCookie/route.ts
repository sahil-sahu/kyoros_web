import { cookies } from "next/headers";
export const POST = async (req:Request) =>{
    const cookie = cookies();
    const form= await req.formData();
    const token = form.get('token') ?? ""
    const hospital = form.get('hospital') ?? ""
    const userType = form.get('userType') ?? ""
    cookie.set("token", token.toString(),{maxAge:31536000000})
    cookie.set("hospital", hospital.toString(),{maxAge:31536000000})
    cookie.set("userType", userType.toString(),{maxAge:31536000000})
    return Response.json({cookies:true});
}