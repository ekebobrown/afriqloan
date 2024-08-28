import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import Connection from "@/app/lib/db"
import Auth from "@/app/lib/auth"

export async function GET(){
    try{
        const { data } = await Auth()
        const messages = await Connection("afriqloan", "messages")
                            .then((messages)=>messages.aggregate([{$match: {$and: [{recipient: {$in: [new ObjectId(data?._id), "all"]}, "flags.status":{$ne: "deleted"}}]}},
                                {$lookup: {from:"users", localField:"sender", foreignField:"_id", as:"sender"}},
                                {$sort: {_id: -1}},
                                {$project: {subject:1, body:1, timestamp:1, status:1, flags:1, names: {$arrayElemAt: ["$sender.names", 0]}, avatar: {$arrayElemAt: ["$sender.avatar", 0]}}}])
                            .toArray())
        return NextResponse.json(JSON.parse(JSON.stringify(messages)))
    }catch(error){
        return NextResponse.json(null)
    }
}

export async function PATCH(request){
    const {_id, property, value} = await request.json()
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
    const {_id} = await request.json()
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