import { NextResponse } from "next/server"
import { headers } from "next/headers";

import Connection from "@/app/lib/db"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';

export async function POST(request){
    const credentials = await request.json()
    try{
        //Query database for user supplied email
        const user = await Connection('afriqloan', 'users')
                            .then((users)=>users.findOne(
                                {"contact.email":credentials?.email},
                                {projection: {names:1, type:1, role:1, status:1, password:1}}
                            ))
        //Check if user exist in the database
        if(!user){
            throw new Error('User does not exist, check email and try again', {status: 404})
        }
        //Confirm user email status
        if(user.status!="activated"){
            throw new Error('Email address not activated', {status: 403})
        }
        //Verify user password
        const password = await bcrypt.compare(credentials.password, user.password.current)
        if(!password ) {
            throw new Error('You have provided an incorrect password, please try again', {status: 401})
        }
        //Create a token to be used for user session authentication
        const payload = {
            _id: user._id,
            names: user.names,
            role: user.role,
            type: user.type,
            status: user.status
        }
        const session_token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
        await Connection("afriqloan","sessions")
                    .then((sessions)=>sessions.insertOne({user:user?._id, loggedin:new Date(), ip:request.headers.get("X-Forwarded-For"), browser:request.headers.get("user-agent")}))
        return NextResponse.json({message:"Sign in successful. Redirecting...", session_token:session_token})
    }catch(error){
        console.log(error)
        const errmsg = error.message.includes('ESERVFAIL')?"A network error occurred. Please check your connection and try again.":error.message
        return NextResponse.json({error:errmsg}, {status:error?.status||500})
    }
}