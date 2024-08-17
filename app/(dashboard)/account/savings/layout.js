import { cookies } from "next/headers"

import Auth from "@/app/lib/auth"

export default async function SavingsLayout({subscriber, landing}) {
    const session_token = cookies().get("session_token")?.value
    const {user} = await Auth(session_token).then((response)=>response.json())
    
    return (
        <>
            {user.priviledge!=="Super Administrator"?subscriber:landing}
        </>
  )
}
