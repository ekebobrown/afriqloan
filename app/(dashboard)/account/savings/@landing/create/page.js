import { cookies } from "next/headers"
import { AccountOpening } from "@/app/components/forms"

import Auth from "@/app/lib/auth"

export default async function CreateAccount({searchParams}) {
    const session_token = cookies().get("session_token")?.value
    const { user } = await Auth(session_token)

    return (
        <section className="bg-white p-2 p-md-5 m-2 m-md-5 p-lg rounded-4">
            <h2>{searchParams.type==="personal"?"Personal":"Joint"} Account Form</h2>
            <p>Basic Information</p>
            <hr />
            <AccountOpening user={user} type={searchParams.type} />
        </section>
    )
}
