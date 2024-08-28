import { cookies } from 'next/headers'
import { jwtVerify } from "jose"

export async function decrypt(session_token){
    try{
        const { payload } = await jwtVerify(session_token, new TextEncoder().encode(process.env.JWT_SECRET_KEY))
        return payload
    }catch(error){
        return null
    }
}

export async function deleteSession() {
    cookies().delete('session_token')
}