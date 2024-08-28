import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import Connection from "@/app/lib/db"
import Auth from "@/app/lib/auth"

export async function GET(request) {
    try{
        //Validate session information
        const { data } = await Auth()

        //Establish database connection and retrieve account balances
        const collections = await Connection("afriqloan", "users")
        const savings = await collections
                                .find({_id: new ObjectId(data?._id)})
                                .project({names:1, phone:1, savings:1})
                                .toArray()
        return NextResponse.json({user: savings})
    }catch(error){
        return NextResponse.json({error: error.message||"There was an error retrieving your balance!"}, {status:error?.status||500, ok:false})
    }
}
