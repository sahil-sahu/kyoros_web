import NavBox from "@/components/custom/header/header";
import Image from "next/image";
import Link from "next/link";

import icu_i from './imgs/icu.webp';
import cro_i from './imgs/cro.png'
import bed_i from './imgs/bed.png'
import user_i from './imgs/user.webp'
import patient_i from './imgs/patient.png'

const AdminPanel = () => {
    return(
        <main className="relative">
            <NavBox title={"Admin Panel"}></NavBox>
            <section className='p-2 absolute w-full m-auto text-center h-[80vh] flex flex-col items-center justify-center'>
                <div className="grid grid-cols-3 gap-4 max-w-3xl container h-max m-auto">
                    {/* <Link href={'/registrations/bed-setup'} className="border-bluecustom rounded flex flex-col justify-evenly items-center">
                        <Image src={bed_i} alt="" />
                        <h2>
                        Bed Setup
                        </h2>
                        </Link> */}
                    <Link href={'/registrations/new-patient'} className="border-bluecustom rounded flex flex-col justify-evenly items-center">
                        <Image src={patient_i} alt="" />
                        <h2>
                            Add Patient
                        </h2>
                    </Link>
                    <Link href={'/registrations/patient-mapping'} className="border-bluecustom rounded flex flex-col justify-evenly items-center">
                        <Image src={bed_i} alt="" />
                        <h2>
                            Bed Transfer/ Discharge
                        </h2>
                    </Link>
                    <Link href={'/registrations/user-mapping'} className="border-bluecustom rounded flex flex-col justify-evenly items-center">
                        <Image className="aspect-square p-4" src={user_i} alt="" />
                        <h2>
                            User Setup
                        </h2>
                    </Link>
                    <Link href={'/registrations/device-mapping'} className="border-bluecustom rounded flex flex-col justify-evenly items-center">
                        <Image src={cro_i} alt="" />
                        <h2>
                            Device Mapping
                        </h2>
                    </Link>
                    <Link href={'/registrations/icu-setup'} className="border-bluecustom rounded flex flex-col justify-evenly items-center">
                        <Image className="aspect-square p-6" src={icu_i} alt="" />
                        <h2>
                            ICU Setup
                        </h2>
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default AdminPanel;