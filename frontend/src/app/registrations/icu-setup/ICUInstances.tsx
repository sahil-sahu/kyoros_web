import PieChart from "@/components/custom/pieChart";
import { ICU } from "@/types/ICU";
import Link from "next/link";

const ICUInstance = ({icu}:{icu:ICU}) =>{
    const percent = Math.floor((icu.filled * 100) / icu.total)
    return(
        <>
            <div className="flex aspect-square h-36 flex-col justify-evenly border border-darkblue rounded items-center text-center">
            <h4 className="text-lg">
                {icu.name}
            </h4>
            <p>{icu.total} Beds</p>
            </div>
        </>
    )
}

export default ICUInstance;