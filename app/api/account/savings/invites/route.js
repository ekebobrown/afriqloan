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
        const collections = await Connection("afriqloan", "account_invitations")
        const invites = await collections
                                .find({'invitedBy': new ObjectId(user._id)})
                                .project({_id:0, invitedBy:0})
                                .toArray()
        return NextResponse.json(invites)
    }catch(error){
        return NextResponse.json({message:error.message||"There was an error retrieving your invitees list."}, {status:error.cause?.status||500})
    }
}
