import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import Connection from "@/app/lib/db"
import { decrypt } from "@/app/lib/session"
import { revalidatePath } from "next/cache"

export async function GET(request){
    const _id = request.nextUrl.searchParams.get("_id")
    try{
        //Establish database connection and fetch listing
        const listing = await Connection("afriqloan", "listings")
                                    .then((listings)=>listings.findOne({_id:new ObjectId(_id)}, {projection: {_id:0}}))
        if(!listing) throw new Error("Artificial Error")
        return NextResponse.json({success:true, message:"listing fetched successfully", listing: listing})
    }catch(error){
        return NextResponse.json({success:false, message:error.message||"Error fetching listing", listing:null}, {status:500})
    }
}

export async function POST(request) {
    const session_token = request.cookies.get('session_token')?.value
    const listing = await request.json()
    try{
        //Verify session token and extract session information
        const user = await decrypt(session_token)
        //Confirm authorization
        if((!user||user.type!=='merchant')) throw new Error("You are not authorized to carrry out this action")
        //Update listing information
        listing.merchant = new ObjectId(user?._id)
        //Check for database connection establishment and insert listing
        const listings = await Connection('afriqloan', 'listings')
                            .then((listings)=>listings.insertOne(JSON.parse(listing)))
        //Check if document has been inserted and return response
        if(!listings) throw new Error("Error inserting listing")
        return NextResponse.json({success:true, message:"Listing added successfully."},{status:200})
    }catch(error){
        return NextResponse.json({success:false, message:error.message||"An error occured trying to create new listings. Please try again!"},{status:error?.code||500})
    }
}

export async function PUT(request){
    const session_token = request.cookies.get('session_token')?.value
    const listing = await request.json()
    const _id = request.nextUrl.searchParams.get("_id")
    try{
        //Verify session token and extract session information
        const user = await decrypt(session_token)
        //Confirm authorization
        if((!user||user.type!=='merchant')) throw new Error("You are not authorized to carrry out this action")
        //Update listing information
        listing.merchant = new ObjectId(user?._id)
        listing.updated = new Date()
        //Establish database connection and commit changes
        const update = await Connection("afriqloan", "listings")
                .then((listings)=>listings.replaceOne({_id:new ObjectId(_id)}, listing))
        return NextResponse.json({success:true, message:"Listing successfully updated"})
    }catch(error){
        console.log(error)
        return NextResponse.json({success:false, message:error.message||"Error updating listing"}, {status:500})
    }
}

export async function PATCH(request){
    const session_token = request.cookies.get('session_token')?.value
    const _id = request.nextUrl.searchParams.get("_id")
    const action = request.nextUrl.searchParams.get("action")
    try{
        //Verify session token and extract session information
        const user = await decrypt(session_token)
        //Confirm authorization
        if((!user||user.type!=='merchant')) throw new Error("You are not authorized to carrry out this action")
        //Establish database connection and update listing
        await Connection("afriqloan", "listings")
                .then((listings)=>listings.updateOne({_id:new ObjectId(_id)}, {$set: {status:action}}))
        revalidatePath("(dashboard)/listings")
        return NextResponse.json({success:true, message:"Listing status successfully updated"})
    }catch(error){
        return NextResponse.json({success:false, message:error.message||"Error updating listing"}, {status:500})
    }
}

export async function DELETE(request){
    const _id = request.nextUrl.searchParams.get("_id")
    try{
        //Verify session token and extract session information
        const user = await decrypt(session_token)
        //Confirm authorization
        if((!user||user.type!=='merchant')) throw new Error("You are not authorized to carrry out this action")
        //Establish database connection and delete listing
        await Connection("afriqloan", "listings")
                .then((listings)=>listings.deleteOne({_id:new ObjectId(_id)}))
        return NextResponse.json({success:true, message:"Listing successfully deleted"})
    }catch(error){
        return NextResponse.json({success:false, message:error.message||"Error deleting listing"}, {status:500})
    }
}