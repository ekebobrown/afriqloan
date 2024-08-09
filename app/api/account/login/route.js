import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

import Connection from "@/app/lib/db"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';

export async function POST(request){
    const formData = await request.json()

    try{
        //Check for database connectivity
        const connection = await Connection('afriqloan', 'users')
        if(!connection.s){
            const response = await connection.json()
            throw new Error(response.error, {cause: {status: response.status}})
        }
        //Query database for user supplied email
        const user = await connection.findOne({email:formData.email},{projection: {email:1, password: 1, status: 1}})

        //Check if user exist in the database
        if(!user){
            throw new Error('User does not exist, check email and try again', {cause: {status: 404}})
        }

        //Confirm user status
        if(user.status!="activated"){
            throw new Error('Email address not activated', {cause: {status: 403}})
        }
        //Verify user password
        const password = await bcrypt.compare(formData.password, user.password)
        if(!password ) {
            throw new Error('Invalid password, please try again', {cause: {status: 401}})
        }
        //Create a token to be used for user session authentication
        const payload = {
            names: user._id,
            email: user.email,
            names: user.status
        }

        const session_token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
        cookies().set({
            name: 'session_token',
            value: session_token,
            httpOnly: true,
            path: '/',
            maxAge: 60*60*24
          })

        return NextResponse.json({message: "Sign in successful. Redirecting..."}, {status: 200})
    }catch(error){
        return NextResponse.json({error:error.message||"Error logging in, please try again."}, {status:error.cause?.status||500})
    }
}