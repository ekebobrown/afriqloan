import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import Connection from "@/app/lib/db";
import { headers } from "next/headers";

export async function PATCH(request) {
    const headerList = await headers()
    const id = headerList.get("x-user-id")
    try{
        await Connection("afriqloan","sessions")
                    .then((sessions)=>sessions.replaceOne({_id:new ObjectId(id)}, {expires:new Date()}, {upsert:true}))
        return NextResponse.json("Session updated.", {status:200})
    }catch(error){
        return NextResponse.json("Failed to update session.", {status:500})
    }
}