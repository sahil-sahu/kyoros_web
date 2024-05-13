"use client"

import { auth } from "@/lib/firebase"
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "../ui/button";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export function AuthBox(){
    const {data, isPending, refetch, error} = useQuery({queryKey: ["authCheck"], queryFn:fetchAuth});
    async function LogOut (){
        await signOut(auth);
        refetch();
    }
    if(data){
        return <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div>
                    <Button onClick={LogOut} className="inline-block text-sm px-4 py-2 leading-none border rounded border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">LogOut</Button>
                    </div>
                </div>
    }
    return <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div>
                    <Link href="/auth/login" className="inline-block text-sm px-4 py-2 leading-none border rounded border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Login</Link>
                    </div>
                </div>

}

export async function fetchAuth (){
    await auth.authStateReady();
    const user = auth.currentUser;
    if(auth.currentUser != null){
        sessionStorage.setItem('token', await auth.currentUser?.getIdToken())
        return true;
    }
    return false;
}

export async function LogOut (){
    await signOut(auth);
    return true;
}