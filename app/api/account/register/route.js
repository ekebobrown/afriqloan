import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs"

import Connection from "@/app/lib/db"
import { Activation } from "@/app/lib/mailer";

export async function POST(request) {
    const data = await request.json()
    try{
        //Check for database connection establishment
        const users = await Connection('afriqloan', 'users')
        const activation = await Connection('afriqloan', 'email_activations')
        //Check if phone number is already registered
        const number = await users.findOne({"contact.phone":data.phone})
        if(number){
            throw new Error("A user already exist with this phone number.", {code: 403})
        }
        //Check if e-mail is already registered
        const email = await users.findOne({"contact.email":data.email})
        if(email){
            throw new Error("E-mail already registered on this application", {code: 403})
        }
        //Encrypt user password
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(data.password, salt)
        data.contact = {email:data.email, phone:data.phone}
        data.password = {current: hashpassword}
        delete data.email
        delete data.phone
        //Insert user into the database and confirm
        const user = await users.insertOne(data)
        if(!user.acknowledged){
            throw new Error("Error creating user account")
        }
        //Create an activation token and send to user's supplied email for activation
        const payload = {
            user:user._id,
            email:user.email,
            role:user.role,
            status:user.status
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
        await activation.insertOne({token:token, user:data._id, timestamp: new Date()})
        //Send activation email to user and return response
        const response = await Activation(token, "Email Account Activation", "activation", data.contact.email)
        return NextResponse.json({message:"Account created successfully. Redirecting shortly..."}, {status:201})
    }catch(error){
        return NextResponse.json({error:error.message||"An error occured trying to create your account. Please try again!"}, {status:error?.code||500})
    }
}