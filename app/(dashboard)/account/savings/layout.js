import { cookies } from "next/headers"
import { Suspense } from "react"

import Auth from "@/app/lib/auth"
import SavingsFalback from "@/app/components/fallbacks"

export default async function Savings({holder, landing}){
    const session_token = cookies().get("session_token")?.value
    const { isAuthenticated } = await Auth(session_token)
    return(
        <>
            {isAuthenticated?
                <Suspense fallback={<SavingsFalback />}>
                    {holder}
                </Suspense>:
                <>{landing}</>
            }
        </>
    )
}