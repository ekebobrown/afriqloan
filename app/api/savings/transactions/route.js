import { NextResponse } from "next/server"
import { ObjectId } from 'mongodb'

import Connection from "@/app/lib/db"
import Auth from "@/app/lib/auth"

export async function GET() {
    try{
        //Check for validity of session information
        const { data } = await Auth()
        const collections = await Connection("afriqloan", "transactions")
        const transactions = await collections
                                .find({'beneficiary': new ObjectId(data._id)})
                                .sort({_id:-1})
                                .project({_id:0, amount:1, source:1, destination:1, timestamp:1, reference:1})
                                .toArray()
        return NextResponse.json(transactions)
    }catch(error){
        return NextResponse.json({message:"There was an error retrieving your tansaction log."}, {status:error?.status||500})
    }
}
