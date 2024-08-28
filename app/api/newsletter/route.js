import { NextResponse } from "next/server";

import Connection from "@/app/lib/db"

export async function GET(){
    try{
        const connection = await Connection()
        const subscribers = await connection
                            .db('afriqloan')
                            .collection('newsletter_subscriptions')
                            .find({})
                            .toArray()
        return NextResponse.json(subscribers)
    }catch(error){
        return NextResponse.json({error:"There was an error"}, {status:500})
    }
}

export async function POST(request) {
    const data = await request.json()
    try{
        const subscribers = await Connection('afriqloan','newsletter_subscriptions')
        const email = await subscribers.findOne({email:data.email})
        if(email){
            throw new Error("Email already exist in our database.", {status:403})
        }

        await subscribers.insertOne(data)
        return NextResponse.json({message:"Successful, thank you for subscribing."}, {status: 200})
    }catch(error){
        return NextResponse.json({error:error.message||"Error submitting form, please try again."}, {status:error.status||500})
    }
}