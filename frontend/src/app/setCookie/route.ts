import { cookies } from "next/headers";
export const POST = async (req:Request) =>{
    const cookie = cookies();
    const form= await req.formData();
    const token = form.get('token') ?? ""
    const hospital = form.get('hospital') ?? ""
    cookie.set("token", token.toString())
    cookie.set("hospital", hospital.toString())
    return Response.json({cookies:true});
}