'use server'

import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import jwt from "jsonwebtoken"

import Connection from "@/app/lib/db"

export default async function Auth(session_token) {


  try{
    const connection = await Connection('afriqloan', 'users')

    //Confirm if database connection can be established
    if(!connection.s){
        const data = await connection.json()
        throw new Error(data.error, {cause: {status: 500}})
    }
    //Check for user session token in request header
    if(!session_token){
      throw new Error("You are not authorized to view this resource", {cause: {status: 401}})
    }
    //Verify user session token and respond
    const payload = jwt.verify(session_token, process.env.JWT_SECRET_KEY)
    const user = await connection.findOne({email: payload.email},{projection: {names:1, avatar:1}})

    if(!user){
        cookies.remove("session_token")
        throw new Error("Invalid session information", {cause: {status: 401}})
    }
        return NextResponse.json({data: user},{status:200})
  }catch(error){
      return NextResponse.json({error:error.message||"Error retrieving authentication information"},{status:error.cause.status||500})
  }
}