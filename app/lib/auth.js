'use server'
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
      throw new Error("User session information missing", {cause: {status: 401}})
    }

    //Verify user session token and respond
    let payload
    jwt.verify(session_token, process.env.JWT_SECRET_KEY, (decoded, err)=>{
        err?payload = err:payload = decoded
    })
    const user = await connection.findOne({email: payload.email},{projection: {names:1, avatar:1, status:1, role:1, phone:1}})
    if(!payload||!user||user.status!=="activated"){
      throw new Error("Invalid session information", {cause: {status:403}})
    }

    //Return user information on successful authentication and authorization
    return {isAuthenticated: true, message: "Authentication Successful", user: JSON.parse(JSON.stringify(user))}
  }catch(error){
      return {isAuthenticated:false, message:error.message||"Error verifying session information"}
  }
}