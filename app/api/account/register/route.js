import { NextResponse } from "next/server"

import Connection from "@/app/lib/db"
import bcrypt from "bcryptjs"

export const revalidate = 3600

export async function POST(request) {
    const formData = await request.json()
    try{
        //Check for database connection establishment
        const collection = await Connection('afriqloan', 'users')

        if(!collection.s){
            const response = await collection.json()
            throw new Error(response.error, {cause: {code: 500}})
        }
        //Check if e-mail is already registered
        const user = await collection.findOne({email:formData.email})
        if(user){
            throw new Error("E-mail already registered on this application", {cause: {code: 403}})
        }
        //Encrypt user password
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(formData.password, salt);
        formData.password = hashpassword
        await collection.insertOne(formData)
        //Return response
        return NextResponse.json({message:"Account created successfully. Redirecting shortly..."},{status:200})
    }catch(error){
        return NextResponse.json({error:error.message||"An error occured trying to create an account. Try again!"},{status:error.cause.code||500, ok: false})
    }
}