import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className='text-xl'>
          Kyoros
        </h1>
        <p>
          Go to <Link href={'/doctor'}>Doctor&apos;s Page</Link>
        </p>
        <p>
          Go to <Link href={'/nurse'}>Nurse&apos;s Page</Link>
        </p>
    </main>
  );
}
