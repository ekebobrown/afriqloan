'use server'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function submitForm(state, formData) {
    const details = Object.fromEntries(formData)
    Object.keys(details).forEach(key => {if(key.startsWith('$ACTION_')){delete details[key]}})
    var updatedDetails
    
    if(Object.keys(state).length > 3){
        updatedDetails = {...details, status: state.status, date: state.date}
    }else{
        updatedDetails = details
    }

    const response = await fetch(`${process.env.SITE_URL}/${state.api}`, {
        method: "POST",
        body: JSON.stringify(updatedDetails)
    })
    const data = await response.json()

    if (response.ok) {
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

export async function logout(formData){
    cookies().delete('session_token')
    NextResponse.redirect(new URL("/", process.env.SITE_URL))
}