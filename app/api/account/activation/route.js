import { NextResponse } from "next/server"

import Connection from "@/app/lib/db"

export async function GET(request){
    const token = request.nextUrl.searchParams.get("token")
    try{
        //Check for database connectivity
        const activations = await Connection("afriqloan","email_activations")
        //Query database for activation token status
        const activation = await activations.findOne({token: token})
        if(!activation){
            throw new Error('You have followed an expired or invalid activation link. Please check the link and try again.', {cause: {status: 404}})
        }
        //Check for associated user and activation status
        const users = await Connection("afriqloan","users")
        const user = await users.findOne({_id:activation._id})
        if(user.status==="activated") {
            return NextResponse.redirect(new URL(`/login?activation=used&email=${user.contact.email}`, request.url))
        }
        //Change user's status to "activated"
        const contact = await users.updateOne({_id:activation._id}, {$set: {status:"activated"}})
        if(!contact.acknowledged) throw new Error("An error occurred trying to activate account")
        //Remove activation document
        await activations.deleteOne({_id: activation._id})
        return NextResponse.redirect(new URL(`/login?activation=successful&email=${user.contact.email}`, request.url))
    }catch(error){
        return NextResponse.redirect(new URL(`/account/activation`, request.url))
    }
}