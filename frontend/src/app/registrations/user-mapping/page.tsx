"use client"
import NavBox from "@/components/custom/header/header";
import { Button } from "@/components/ui/button";
import { DataTable } from "./table";
import { useQuery } from "@tanstack/react-query";
import { getUserMap } from "./query/getusers";
import { AddUser } from "./user";
import { UserRefreshContext } from "./context";

const UserMapping = () =>{
    const {data, refetch, isError} = useQuery({queryKey:["usermapping"], queryFn:getUserMap})
    return (
        <main className="relative">
            <NavBox title={"User Setup"}></NavBox>
            <UserRefreshContext.Provider value={refetch}>
            <section className=" w-full py-4">
                <div className="w-full ">
                    <AddUser />
                </div>
                {
                    isError && (
                        <div className="text-center">
                            Error fetching data, please try again later.
                        </div>
                    )
                    }
                {
                    !data && (
                        <div className="text-center">
                            Loading...
                        </div>
                    )
                }
                {!!data && <DataTable refetch={refetch} data={data} />}
            </section>
            </UserRefreshContext.Provider>
        </main>
    )
}

export default UserMapping;