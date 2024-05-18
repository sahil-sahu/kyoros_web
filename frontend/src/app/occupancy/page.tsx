import NavBox from "@/components/custom/header/header"
import { icuData } from "@/types/ICU"
import ICUInstance from "./ICUInstance"

NavBox
const Occupancy = () => {
    return (
        <main>
            <NavBox title={"Occupancy"}></NavBox>
            <section className="grid grid-cols-2 gap-4 gap-y-10 md:grid-cols-4">
                {
                    icuData.map(e => <ICUInstance key={e.name} icu={e}/>)
                }
            </section>
        </main>
    )
}

export default Occupancy;