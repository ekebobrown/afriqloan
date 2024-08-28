import { NextResponse } from "next/server"
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb"

import Connection from "@/app/lib/db"
import Auth from "@/app/lib/auth"

export async function GET(request){
    const { isAuthenticated, data, session_token } = await Auth()
    const path = request.nextUrl.pathname
    const searchParams = request.nextUrl.searchParams

    if(!isAuthenticated) redirect(`/login?redirect=${encodeURIComponent(path)}${searchParams}`)
    try{
        const messages = await Connection("afriqloan", "messages")
                            .then((messages)=>messages.aggregate([{$match: {$and: [{recipient: {$in: [new ObjectId(data?._id), "all"]}, "flags.status":{$ne: "deleted"}}]}},
                                {$lookup: {from:"users", localField:"sender", foreignField:"_id", as:"sender"}},
                                {$sort: {_id: -1}},
                                {$project: {subject:1, body:1, timestamp:1, status:1, flags:1, names: {$arrayElemAt: ["$sender.names", 0]}, avatar: {$arrayElemAt: ["$sender.avatar", 0]}}}])
                            .toArray())
        return NextResponse.json(JSON.parse(JSON.stringify(messages)),
                                    {status:200, headers: {'Set-Cookie':`session_token=${session_token}; Path=/; Expires=${new Date(Date.now() + 60*30*1000).toUTCString()}; Secure; HttpOnly`}}
                                )
    }catch(error){
        return NextResponse.json(null)
    }
}

export async function PATCH(request){
    const { isAuthenticated } = await Auth()
    const path = request.nextUrl.pathname
    const searchParams = request.nextUrl.searchParams
    const {_id, property, value} = await request.json()

    if(!isAuthenticated) redirect(`/login?redirect=${encodeURIComponent(path)}${searchParams}`)
    try{
        const message = await Connection("afriqloan", "messages")
                                .then((messages)=>messages.findOneAndUpdate({_id:new ObjectId(_id)}, {$set: {[`flags.${property}`]:value}}, {projection: {_id:0, flags:1}, returnDocument: "after"}))
        if(!message){
            throw new Error("Unable to update message status")
        }
        return NextResponse.json({success:true, value:message.flags[property]})
     }catch(error){
        return NextResponse.json({success:false}, {status:500})
     }
}

export async function DELETE(request){
    const { isAuthenticated } = await Auth()
    const path = request.nextUrl.pathname
    const searchParams = request.nextUrl.searchParams
    const {_id} = await request.json()

    if(!isAuthenticated) redirect(`/login?redirect=${encodeURIComponent(path)}${searchParams}`)
    try{
        const deleted = await Connection("afriqloan", "messages")
                                .then((messages)=>messages.findOneAndDelete({_id:new ObjectId(_id)}))
        console.log(deleted)
        if(!deleted) throw new Error("Error deleting message.")
        return NextResponse.json({success:true, value:"deleted"})
    }catch(error){
        return NextResponse.json({success:false}, {status:500})
    }
}