"use client"

import { auth } from "@/lib/firebase"
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { signOut } from "firebase/auth";
import logout_ico from './header/icons/logout.png';
import Image from "next/image";
import { useRouter } from "next/navigation";
export function AuthBox(){
    const router = useRouter();
    const {data, isPending, refetch, error} = useQuery({queryKey: ["authCheck"], queryFn:fetchAuth});
    async function LogOut (){
        localStorage.setItem("fcmSet","false");
        await signOut(auth);
        refetch();
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
        router.push('/auth/login');
    }
    if(data){
        return(<Link href='#' onClick={LogOut}>
                    <Image height={20} className="inline mr-2" width={20} src={logout_ico} alt=''/>
                    Logout
                </Link>)
    }
    return  <Link href="/auth/login">
                <Image height={20} className="inline mr-2" width={20} src={logout_ico} alt=''/>
                Login
            </Link>

}

export async function fetchAuth (){
    await auth.authStateReady();
    const user = auth.currentUser;
    if(auth.currentUser != null){
        localStorage.setItem('token', await auth.currentUser?.getIdToken())
        return true;
    }
    return false;
}