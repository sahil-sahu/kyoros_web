import NavBox from "@/components/custom/header/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const ICUSetup = () => {
    return (
        <main className="relative min-h-dvh">
            <NavBox title={`ICU Setup`}/>
            <section className='p-2 py-5'>
                <div className="my-2 grid gap-2 grid-cols-3">
                    <div className="flex-[3] col-span-2">
                        <Input className="w-full border p-2" placeholder="ICU Name"/>
                    </div>
                    <div className="relative border rounded">
                        <div className="top-[-25%] left-2 absolute text-xs bg-white p-1">
                            Beds
                        </div>
                        <div className="flex gap-2 p-2 justify-center items-center">
                            <span>-</span>
                            <input className="w-10 outline-none text-center" defaultValue={1} type="number" />
                            <span>+</span>
                        </div>
                    </div>
                </div>
                <Button className="m-auto bg-bluecustom px-4 w-full py-2">Add ICU</Button>
            </section>

            <Button className="bottom-2 absolute max-w-md right-1/2 translate-x-1/2 bg-bluecustom px-4 w-[95%] py-2">Save</Button>
        </main>
    )
}

export default ICUSetup;