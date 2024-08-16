import { NextResponse } from "next/server"
import { ObjectId } from "bson"

import Connection from "@/app/lib/db"
import Auth from "@/app/lib/auth"

export async function GET(request) {
    const session_token = request.headers.get('authorization')?.split(" ")[1]

    try{
        //Validate session information
        const { user } = await Auth(session_token)

        //Establich database connection and retrieve account balances
        const collections = await Connection("afriqloan", "users")
        const account = await collections
                                .find({_id: new ObjectId(user._id)})
                                .project({names:1, phone:1, accounts:1})
                                .toArray()

        return NextResponse.json({user: account})
    }catch(error){
        return NextResponse.json({error: error.message||"There was an error retrieving your balance!"}, {status:error.cause.status||500, ok:false})
    }
}
