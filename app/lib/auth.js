'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { deleteSession, decrypt } from "@/app/lib/session"

export default async function Auth() {
  const cookieStores = await cookies()
  const session_token = cookieStores.get("session_token")?.value
  try{
    //Validate user session and information
    const data  = await decrypt(session_token)
      if(!data){
        if(session_token){
          deleteSession()
        }
        throw new Error()
      }
    //Return session token payload on successful validation
    return {isAuthenticated: true, message: "Authentication Successful", data, session_token}
  }catch(error){
      return {isAuthenticated:false, message:"Error validating session information"}
  }
}

export async function logout(){
  revalidatePath("/", 'layout')
  await deleteSession()
  redirect("/")
}