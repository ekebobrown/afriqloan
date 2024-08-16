import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import { ObjectId } from "mongodb"

import Connection from "@/app/lib/db"
import Auth from "@/app/lib/auth"

export async function GET(request){
    const session_token = headers().get("Authorization").split(" ")[1]

    try{
        //Check for validity of session information
        const { user } = await Auth(session_token)

        //Connect to database and pull loan information for user
        const loans = await Connection('afriqloan', 'loans')
        const query = {user:new ObjectId(user._id)}
        const loanDetails = await loans.findOne(query)

        return NextResponse.json([loanDetails])
    }catch(error){
        return NextResponse.json({message:error.message||"Error occured trying to retrieve your loan details"}, {status:error.cause?.status||500})
    }
}