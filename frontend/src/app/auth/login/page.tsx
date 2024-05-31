"use client";
import * as React from "react"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logUser } from "./mutation";
import { useMutation } from "@tanstack/react-query";

import Logo from "@/assets/logo.webp";
import Image from "next/image";


enum Color {
    Doctor = 'doctor',
    Nurse = 'nurse',
    Admin = 'admin',
  }
export default function Login(){
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { mutate, isPending:isLoading, error, data } = useMutation({mutationFn:logUser});
  const router = useRouter()
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate({email,password});
  }
  
  React.useEffect(()=>{
    if(data){
      router.push("/");
    }
  }, [data, router]);

    return <form onSubmit={login}>
    <Card className="w-[350px] bg-white p-8 border-none md:border-solid rounded">
        <CardHeader className="text-center">
            <Image className="m-auto" src={Logo} alt="Kyoros"/>
            <CardTitle>Login to Kyoros</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Input id="email" onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="User-ID" />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Input onChange={(e) => setPassword(e.target.value)} value={password} id="password" placeholder="password" type="password"/>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button className="w-[100%] text-center bg-bluecustom" type="submit">SignIn</Button>
            {isLoading && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="animate-spin w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>}
        </CardFooter>
        <CardFooter className="flex underline text-sm text-center justify-between">
            <Link href="/auth/forgot">
              Forgot User ID or Password
            </Link>
        </CardFooter>
    </Card>
    </form>;
}