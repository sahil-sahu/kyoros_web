import PieChart from "@/components/custom/pieChart";
import { ICU } from "@/types/ICU";
import Link from "next/link";

const ICUInstance = ({icu}:{icu:ICU}) =>{
    const percent = Math.floor((icu.filled * 100) / icu.total)
    return(
        <Link href={'/registrations/patient-mapping'}>
            <div className="flex flex-col justify-evenly items-center text-center">
            <h4 className="text-lg">
                {icu.name}
            </h4>
            <PieChart rad={50} perct={percent}  />
            <p>
                {`${icu.filled} / ${icu.total}`}
                <br />
                occupied
            </p>
            </div>
        </Link>
    )
}

export default ICUInstance;