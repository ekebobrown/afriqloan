import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import Connection from "@/app/lib/db"
import { headers } from "next/headers"

export async function GET(){
    const id = headers().get("x-authorization-id")
    try{
        //Connect to database and pull loan information for user
        const loans = await Connection('afriqloan', 'users')
                            .then((users)=>users.aggregate([
                                {$match: {_id:new ObjectId(id)}},
                                {$project: {_id:0, loans: {$filter: {input: "$loans", cond: {$eq: ["$$this.status", "active"]}}}}},
                                {$unwind: "$loans"},
                                {$replaceRoot: {newRoot: "$loans"}}])
                            .toArray())
        return NextResponse.json(loans)
    }catch(error){
        console.log(error)
        return NextResponse.json({message:error.message||"Error occured trying to retrieve your loan details"}, {status:error?.status||500})
    }
}