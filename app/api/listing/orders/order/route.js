import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import Connection from "@/app/lib/db";
import Auth from "@/app/lib/auth";

export async function GET(request){
    const { isAuthenticated, data, session_token } = await Auth()
    const id = request.nextUrl.searchParams.get('id')
    const path = request.nextUrl.pathname
    const searchParams = request.nextUrl.searchParams

    if(!isAuthenticated) redirect(`/login?redirect=${encodeURIComponent(path)}${searchParams}`)
    try{
        const collection = await Connection("afriqloan","orders")
        const [order] = await collection.aggregate([
                                {$match: {_id:new ObjectId(id)}},
                                {$lookup: {
                                    from:"listings",
                                    localField:"items",
                                    foreignField:"_id",
                                    pipeline: [{$match: {$expr: {$eq: [new ObjectId(data?._id), "$merchant"]}}}],
                                    as:"item"
                                }},
                                {$unwind:"$item"},
                                {$project: {"status":1, "item.title":1, "item.image":1, "item.description":1, "item.pricing":1}},
                                {$group: {_id:"$_id", "value": {$sum: "$item.pricing"}, "items": {$push: "$$ROOT"} }},
                            ]).toArray()
        return NextResponse.json(
                            {success:true, message:"Operation successful.", value:order?.value, items:order?.items},
                            {status:200, headers: {'Set-Cookie':`session_token=${session_token}; Path=/; Expires=${new Date(Date.now() + 60*30*1000).toUTCString()}; Secure; HttpOnly`}}
                        )
    }catch(error){
        return NextResponse.json({success:false, message:error.message||"Error retrieving order."}, {status:500})
    }
}