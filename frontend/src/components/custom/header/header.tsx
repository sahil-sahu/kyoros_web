import Image from "next/image";
import Link from "next/link";

// import Logo from "@/assets/logo.webp"
import Logo from "@/assets/ic_kyoro-01-03 3.webp"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import navigationMenu from "./navMenu";

export default function NavBox({title}:{title:string|null|undefined}) {
    return <nav className="flex items-center justify-between flex-wrap p-6 border-b border-gray-300">
        <Link href={'/'} className="flex items-center flex-shrink-0 text-white mr-6">
            <Image src={Logo} height={50} alt="Kyoros"/>
        </Link>
        <div className="flex items-center text-lg font-semibold  flex-shrink-0 mr-6">
            <h3>
                {title ?? "Overview"}
            </h3>
        </div>
        <div className="flex items-center flex-shrink-0">
            <Link className="p-2" href={'/request-notify'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                </svg>
            </Link>
            <Sheet>
                <SheetTrigger>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                </SheetTrigger>
                <SheetContent className="bg-white">
                    {navigationMenu}
                </SheetContent>
            </Sheet>
        </div>
    </nav>;
}