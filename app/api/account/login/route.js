import { NextResponse } from "next/server"
import { headers } from "next/headers";

import Connection from "@/app/lib/db"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';

export async function POST(request){
    const credentials = await request.json()
    try{
        //Query database for user supplied email
        const users = await Connection('afriqloan', 'users')
        const user = await users.findOne(
                                {"contact.email":credentials?.email},
                                {projection: {names:1, type:1, role:1, status:1, password:1}}
                            )
        //Check if user exist in the database
        if(!user) throw new Error('User does not exist! Please confirm email and try again.', {status: 404})

        //Confirm user email status
        if(user.status!="activated")throw new Error('Email address not activated. Kindly follow activation instruction sent to the email address used during registration.', {status: 403})

        //Check for active session
        const sessions = await Connection('afriqloan', 'sessions')
        const session = await sessions.findOne({_id:user._id})
        if(session) throw new Error("User currently have an active session on another device! Kindly terminate the session if you wish to continue here.", {cause: {status:403}})

        //Verify user password
        const password = await bcrypt.compare(credentials.password, user.password.current)
        if(!password ) throw new Error('You have provided an incorrect password! Please try again.', {status: 401})

        //Create a token to be used for user session authentication
        const payload = {
            _id: user._id,
            names: user.names,
            role: user.role,
            type: user.type,
            status: user.status
        }
        const session_token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
        await users.updateOne({_id:user?._id}, {$set: {lastlogin: {timestamp:new Date(), ip:request.headers.get("X-Forwarded-For"), browser:request.headers.get("user-agent")}}})
        await sessions.replaceOne({_id:user?._id}, {expires:new Date()}, {upsert:true})
        return NextResponse.json({message:"Sign in successful. Redirecting..."},{
                                    status:200,
                                    headers: {'Set-Cookie':`session_token=${session_token}; Path=/; Expires=${new Date(Date.now() + 60*30*1000).toUTCString()}; Secure; HttpOnly`}
                                })
    }catch(error){
        const errmsg = error.message.includes('ESERVFAIL')||error.message.includes('ETIMEOUT')?"A network error occurred. Please check your connection and try again.":error.message
        return NextResponse.json({error:errmsg}, {status:error?.status||500})
    }
}