'use server'

import { v7 as uuidv7 } from 'uuid';
import jwt from 'jsonwebtoken'

import { NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import Connection from "@/app/lib/db"
import { redirect } from 'next/dist/server/api-utils';

export async function getTestimonies(){
    "use server"
    const connection = await Connection("afriqloan","users")
    const testimonies = await connection.find({testimony:{$exists: true}}, {projection: {_id:0, names:1, avatar:1, testimony:1}}).toArray()
    return testimonies
  }

export async function submitForm(state, formData) {
    const details = Object.fromEntries(formData)
    Object.keys(details).forEach(key => {if(key.startsWith('$ACTION_')){delete details[key]}})
    var updatedDetails

    if(Object.keys(state).length > 3){
        updatedDetails = {...details, status: state.status}
    }else{
        updatedDetails = details
    }

    const response = await fetch(`${process.env.SITE_URL}/${state.api}`, {
        method: "POST",
        body: JSON.stringify(updatedDetails)
    })
    const data = await response.json()

    if (response.ok) {
        if(data?.session_token) {
            cookies().set({
                name: 'session_token',
                value: data.session_token,
                httpOnly: true,
                path: '/',
                maxAge: 60*60*24
            })
            NextResponse.redirect("/dashboard")
        }
        return ({...state,
            success: true,
            message: data.message,
        });
    }else{
        return ({...state,
            success: false,
            message: data.error,
        });
    }
}

export async function logout(){
    cookies().delete('session_token')
    revalidatePath("/", "layout")
    NextResponse.redirect(new URL("/", process.env.SITE_URL))
}

export async function recoverPassword(state, formData) {
    const email = formData.get("email")
    try {
        const collection = await Connection("afriqloan", "users")
        const user = await collection.findOne({email: email}, {projection: {_id:0, email:1}})
        if(!user){
            throw new Error("Email does not exist in our database", {cause: {status: 404}})
        }

        //Send password reset link to user email address
        return {...state, success: true, message:`A password reset link has been sent to ${user.email}`}
    }catch(error){
        revalidatePath("/recoverpassword")
        return{...state, success:false, message:error.message}
    }
}

export async function emailActivation(email){
    try{
        const token = jwt.sign({data:email}, process.env.JWT_SECRET_KEY)
        const link = new URL(`/account/activation/${token}`, process.env.SITE_URL)
        return {
            success: true,
            message: "E-mail sent successfully"
        }
    }catch(error){
        return {
            success: false,
            message: error.message
        }
    }
}