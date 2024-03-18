import AuthBox from "@/components/custom/authCheck";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <main className="">
        <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <span className="font-semibold text-xl tracking-tight">Kyoros</span>
          </div>
          <div className="block lg:hidden">
            <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
              <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
            </button>
          </div>
          <AuthBox></AuthBox>
        </nav>
        <div className="container">
          <p>
            Go to <Link className="text-tahiti underline" href={'/doctor'}>Doctor&apos;s Page</Link>
          </p>
          <p>
            Go to <Link className="text-tahiti underline" href={'/nurse'}>Nurse&apos;s Page</Link>
          </p>
          <p>
            Go to <Link className="text-tahiti underline" href={'/request-notify'}>Subscribe to notification service</Link>
          </p>
        </div>
    </main>
  );
}
