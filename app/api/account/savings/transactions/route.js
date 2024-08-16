import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { ObjectId } from "bson"

import Connection from "@/app/lib/db"
import Auth from "@/app/lib/auth"

export async function GET(request) {
    const session_token = request.headers.get('authorization')?.split(" ")[1]

    try{
        //Check for validity of session information
        const { user } = await Auth(session_token)
        const collections = await Connection("afriqloan", "transactions")
        const transactions = await collections
                                .find({'beneficiary': new ObjectId(user._id)})
                                .project({amount:1, source:1, destination:1, timestamp:1})
                                .toArray()
        return NextResponse.json(transactions)
    }catch(error){
        return NextResponse.json({message:error.message||"There was an error retrieving your tansaction log."}, {status:error.cause?.status||500})
    }
}
