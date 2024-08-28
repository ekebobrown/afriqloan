import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { ObjectId } from "mongodb";

import Connection from "@/app/lib/db";
import Auth from "@/app/lib/auth";

export async function GET(request){
    const { isAuthenticated, data, session_token } = await Auth()
    const path = request.nextUrl.pathname
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit'))
    const skip = parseInt(searchParams.get('skip'))
    const sort = searchParams.get('sort')
    const order = parseInt(searchParams.get('order'))
    const from = new Date(searchParams.get('orderdate')||"1970-01-01")
    const to = new Date((new Date(searchParams.get('orderdate')).valueOf() + 86400000)||Date.now())

    if(!isAuthenticated) redirect(`/login?redirect=${encodeURIComponent(path)}${searchParams}`)

    try{
        const collection = await Connection("afriqloan", "orders")
        const orders = await collection.aggregate([
                                    {$lookup: {
                                        from:"listings",
                                        localField:"items",
                                        foreignField:"_id",
                                        pipeline: [{$match: {$expr: {$eq: [new ObjectId(data?._id), "$merchant"]}}}],
                                        as:"items"
                                    }},
                                    {$lookup: {
                                        from:"users",
                                        localField:"customer",
                                        foreignField:"_id",
                                        as:"customer"
                                    }},
                                    {$match: {$expr: {$and: [{$gt: [{$size:"$items"}, 0]}, {$gte: ["$orderdate", from]}, {$lte: ["$orderdate", to]}]}}},
                                    {$project: {"status":1, "orderdate":1, "value":{$sum: "$items.pricing"}, "item":{$first:"$items"}, "quantity":{$size: "$items"}, "customer.names":1, "customer.contact.email":1}},
                                    {$replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$customer", 0]}, "$$ROOT"]}}},
                                    {$unset: ["customer", "item._id", "item.type", "item.description", "item.subtitle", "item.updated"]},
                                    {$sort: {[sort]:order}},
                                    {$group: {_id:null, count:{$count: {}}, lists:{$push: "$$ROOT"}}},
                                    {$project: {_id:0, count:1, lists:{$slice: ["$lists", skip, limit]}}}
                                ]).toArray()
        if(!orders) throw new Error()
        return NextResponse.json(
                            {success:true, message:"Operation successful.", count:orders[0]?.count||0, lists:orders[0]?.lists||[]},
                            {status:200, headers: {'Set-Cookie':`session_token=${session_token}; Path=/; Expires=${new Date(Date.now() + 60*30*1000).toUTCString()}; Secure; HttpOnly`}}
                        )
    }catch(error){
        return NextResponse.json({success:false, message:error.message||"Error retrieving orders."}, {status:500})
    }
}