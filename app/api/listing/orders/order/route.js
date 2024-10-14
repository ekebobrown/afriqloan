import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import Connection from "@/app/lib/db";
import Auth from "@/app/lib/auth";

export async function GET(request){
    const { data, session_token } = await Auth()
    const id = request.nextUrl.searchParams.get('id')
    const merchant = request.headers.get('x-authorization-id')||data?._id
    const token = request.headers.get('x-authorization-token')||session_token
    const path = request.nextUrl.pathname
    const searchParams = request.nextUrl.searchParams

    if(!merchant) redirect(`/login?redirect=${encodeURIComponent(path)}${searchParams}`)
    try{
        const collection = await Connection("afriqloan","orders")
        const [order] = await collection.aggregate([
                                {$match: {_id:new ObjectId(id)}},
                                {$lookup: {
                                    from:"listings",
                                    localField:"items",
                                    foreignField:"_id",
                                    pipeline: [{$match: {$expr: {$eq: [new ObjectId(merchant), "$merchant"]}}}],
                                    as:"items"
                                }},
                                {$project: {"status":1, "items.title":1, "items.image":1, "items.description":1, "items.pricing":1}},
                            ]).toArray()
        return NextResponse.json(
                            {success:true, message:"Operation successful.", order},
                            {status:200, headers: {'Set-Cookie':`session_token=${token}; Path=/; Expires=${new Date(Date.now() + 60*30*1000).toUTCString()}; Secure; HttpOnly`}}
                        )
    }catch(error){
        console.log(error)
        return NextResponse.json({success:false, message:error.message||"Error retrieving order."}, {status:500})
    }
}