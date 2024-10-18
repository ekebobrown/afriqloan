import { NextResponse } from "next/server";

import Connection from "@/app/lib/db"

export async function GET(){
    try{
        const subscribers = await Connection('afriqloan','newsletter_subscriptions')
                                    .then((subscribers)=>subscribers.find({}).toArray())
        return NextResponse.json(subscribers)
    }catch(error){
        console.log(error)
        return NextResponse.json({error:"There was an error"}, {cause:{status:500}})
    }
}

export async function POST(request) {
    const data = await request.json()
    try{
        const subscribers = await Connection('afriqloan','newsletter_subscriptions')
        const subscriber = await subscribers.findOne({email:data.email})
        if(subscriber){
            throw new Error("Email already has an active suscription, thank you.", {cause:{status:403}})
        }
        await subscribers.insertOne(data)
        return NextResponse.json({message:"Request successful! Thank you for subscribing to our newsletter."}, {status: 200})
    }catch(error){
        console.log(error.name)
        return NextResponse.json({error:error.message||"Error submitting form, please try again."}, {status:error.cause.status||500})
    }
}