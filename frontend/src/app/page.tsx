import NavBox from "@/components/custom/header/header";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
        <NavBox></NavBox>
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
