import PieChart from "@/components/custom/pieChart";
import { ICU } from "@/types/ICU";
import Link from "next/link";

const ICUInstance = ({icu}:{icu:ICU}) =>{
    const percent = Math.floor((icu.filled * 100) / icu.total)
    return(
        <Link href={'/registrations/patient-mapping?icu='+icu?.id}>
            <div className="flex flex-col justify-evenly items-center text-center">
            <h4 className="text-lg">
                {icu.name}
            </h4>
            <div style={{
              background:`linear-gradient(to bottom right, #303778 ${percent}%, #7CA7EB)`
            }} className="flex m-auto lg:mt-4 justify-center items-center rounded-full w-[6rem] h-[6rem] lg:w-[8rem] lg:h-[8rem]">
              <h4 className="bg-white flex justify-center items-center text-2xl rounded-full text-center w-[4rem] h-[4rem] lg:w-[6rem] lg:h-[6rem]">
                {percent}%
              </h4>
            </div>
            <p className="leading-8">
                {`${icu.filled} / ${icu.total}`}
                <br />
                occupied
            </p>
            </div>
        </Link>
    )
}

export default ICUInstance;