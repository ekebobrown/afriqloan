import { NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { revalidatePath } from "next/cache"

import Connection from "@/app/lib/db"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';

export async function POST(request){
    const credentials = await request.json()

    try{
        //Check for database connectivity
        const users = await Connection('afriqloan', 'users')
        if(!users.s){
            const response = await users.json()
            throw new Error(response.error, {cause: {status: response.status}})
        }
        //Query database for user supplied email
        const user = await users.findOne({email:credentials.email},{projection: {names:1, email: 1, password:1, status: 1}})

        //Check if user exist in the database
        if(!user){
            throw new Error('User does not exist, check email and try again', {cause: {status: 404}})
        }

        //Confirm user status
        if(user.status!="activated"){
            throw new Error('Email address not activated', {cause: {status: 403}})
        }
        //Verify user password
        const password = await bcrypt.compare(credentials.password, user.password)
        if(!password ) {
            throw new Error('Invalid password, please try again', {cause: {status: 401}})
        }
        //Create a token to be used for user session authentication
        const payload = {
            id: user._id,
            names: user.names,
            email: user.email,
            status: user.status
        }
        const session_token = jwt.sign(payload, process.env.JWT_SECRET_KEY)

        cookies().set({
            name: 'session_token',
            value: session_token,
            httpOnly: true,
            path: '/',
            maxAge: 60*60*24
          })

        revalidatePath("/", "layout")
        return NextResponse.json({message: "Sign in successful. Redirecting..."}, {status: 200})
    }catch(error){
        return NextResponse.json({error:error.message||"Error logging in, please try again."}, {status:error.cause?.status||500})
    }
}