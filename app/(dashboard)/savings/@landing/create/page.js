import { ObjectId } from "mongodb"

import Auth from "@/app/lib/auth"
import Connection from "@/app/lib/db"
import { AccountOpening } from "@/app/components/forms"

export default async function CreateAccount({searchParams}) {
    const { data } = await Auth()
    const user = await Connection("afriqloan","users")
                        .then((users)=>users.findOne(
                            {_id:new ObjectId(data._id)},
                            {projection: {_id:0, password:0, status:0, testimony:0, role:0}}
                        ))
    return (
        <section id="create" className="bg-white p-4 p-md-5 m-2 m-md-5 p-lg rounded-4">
            <h2>{searchParams.type==="personal"?"Personal":"Joint"} Account Form</h2>
            <p>Basic Information</p>
            <hr />
            <AccountOpening user={user} type={searchParams.type} />
        </section>
    )
}
