import { cookies } from "next/headers"
import { Suspense } from "react"
import { ObjectId } from "mongodb"

import Connection from "@/app/lib/db"
import Auth from "@/app/lib/auth"
import { FinancialsFallback } from "@/app/components/fallbacks"

export default async function Savings({holder, landing}){
    const { data } = await Auth()
    const user = await Connection("afriqloan", "users")
                        .then((users)=>users.findOne(
                            {_id: new ObjectId(data?._id)},
                            {projection: {_id:0, savings:1}}
                        ))
    if(!user){
        throw new Error("An error occured trying to retrieve account information")
    }
    return(
        <>
            {user.savings?
                <Suspense fallback={<FinancialsFallback />}>
                    {holder}
                </Suspense>:
                <>{landing}</>
            }
        </>
    )
}