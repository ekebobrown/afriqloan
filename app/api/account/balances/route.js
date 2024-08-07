import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { ObjectId } from "bson"

import Connection from "@/app/lib/db"
import Auth from "@/app/lib/auth"

export async function GET(request) {
    const session_token = request.headers.get('authorization')?.split(" ")[1]

    try{
        //Validate session information
        const response = await Auth(session_token)
        if(!response.ok) {
            const data = await response.json()
            throw new Error(data.error, {cause: {status: data.status}})
        }
        //Establich database connection and retrieve account balances
        const collections = await Connection("afriqloan", "users")
        const balances = await collections
                                .find({_id: new ObjectId('66aec861f551ee571c81d0fa')})
                                .project({account:1})
                                .toArray()

        return NextResponse.json(balances)
    }catch(error){
        return NextResponse.json({error: error.message||"There was an error retrieving your balance!"}, {status:error.cause.status||500, ok:false})
    }
}
