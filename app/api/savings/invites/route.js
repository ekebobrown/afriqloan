import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import Connection from "@/app/lib/db"
import Auth from "@/app/lib/auth"

export async function GET() {
    try{
        //Check for validity of session information
        const { data } = await Auth()
        const collections = await Connection("afriqloan", "joint_savings_invitations")
        const invites = await collections
                                .find({'inviter': new ObjectId(data._id)})
                                .project({_id:0, group:0})
                                .toArray()
        return NextResponse.json(invites)
    }catch(error){
        return NextResponse.json({message:error.message||"There was an error retrieving your invitees list."}, {status:error.cause?.status||500})
    }
}
