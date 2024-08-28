import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import Connection from "@/app/lib/db";
import Auth from "@/app/lib/auth";

export async function GET(request){
    const { isAuthenticated, data } = await Auth()
    const id = request.nextUrl.searchParams.get('id')
    try{
        if(!isAuthenticated) throw new Error("Not authorized! Invalid session information.")
        const collection = await Connection("afriqloan","orders")
        const order = await collection.aggregate([
                                {$match: {_id:new ObjectId(id)}},
                                {$lookup: {
                                    from:"listings",
                                    localField:"items",
                                    foreignField:"_id",
                                    pipeline: [{$match: {$expr: {$eq: [new ObjectId(data?._id), "$merchant"]}}}],
                                    as:"items"
                                }},
                                {$unwind:"$items"},
                                {$project: {"_id":0, "status":1, "items.title":1, "items.image":1, "items.description":1, "items.pricing":1}}
                            ]).toArray()
        return NextResponse.json({success:true, message:"Operation successful.", order})
    }catch(error){
        return NextResponse.json({success:false, message:error.message||"Error retrieving order."}, {status:500})
    }
}