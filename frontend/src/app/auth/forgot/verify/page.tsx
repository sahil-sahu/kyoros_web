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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query";

import Logo from "@/assets/logo.webp";
import Image from "next/image";
import SetNew from "./setNew";
import OTP from "./otpCheck";


export default function Verify(){
  const [verfied, setVerfied] = React.useState<boolean>(false)
  const router = useRouter()
  
//   React.useEffect(()=>{
//     if(data){
//       router.push("/"+data);
//     }
//   }, [data, router]);

    return <form>
    <Card className="w-[400px] bg-white p-8 border-none md:border-solid rounded">
        <CardHeader className="text-center">
            <Image className="m-auto" src={Logo} alt="Kyoros"/>
            <CardTitle className="text-lg">Forgot User ID or Password</CardTitle>
        </CardHeader>
        {verfied? <SetNew></SetNew> : <OTP verfied={setVerfied}/>}
    </Card>
    </form>;
}