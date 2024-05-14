import NavBox from "@/components/custom/header/header"
import { dummyData } from "./dummy";
import GlanceBox from "./glanceBox";

const AtGlance = () =>{
    return(
        <main>
            <NavBox title={"At a Glance"} />
            <section className="grid md:grid-cols-3 grid-cols-2">
                {
                    dummyData.map(cell => <GlanceBox key={cell.timestamp} data={cell}/>)
                }
            </section>
        </main>
    )
}

export default AtGlance;