import { NextResponse } from "next/server"

import Connection from "@/app/lib/db"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';
import Mailer from "@/app/lib/mailer";

export const revalidate = 3600

export async function POST(request) {
    const formData = await request.json()
    try{
        //Check for database connection establishment
        const users = await Connection('afriqloan', 'users')
        const activation = await Connection('afriqloan', 'pending_activations')

        if(!users.s || !activation.s){
            const response = await users.json()
            throw new Error(response.error, {cause: {code: 500}})
        }
        //Check if e-mail is already registered
        const user = await users.findOne({email:formData.email})
        if(user){
            throw new Error("E-mail already registered on this application", {cause: {code: 403}})
        }
        //Encrypt user password
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(formData.password, salt);
        formData.password = hashpassword
        const newUser = await users.insertOne(formData)
        if(newUser.acknowledged){
            const payload = {
                email:formData.email,
                role:formData.role,
                status:formData.status,
                user:formData._id
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
            await activation.insertOne({token:token, user:formData._id, createdAt: new Date()})
            Mailer(token, "Email Activation", formData.email)
        }

        //Return response
        return NextResponse.json({message:"Account created successfully. Redirecting shortly..."},{status:200})
    }catch(error){
        return NextResponse.json({error:error.message||"An error occured trying to create an account. Try again!"},{status:error.cause.code||500, ok: false})
    }
}