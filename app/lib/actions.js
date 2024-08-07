'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function submitForm(state, formData) {
    const details = Object.fromEntries(formData)
    Object.keys(details).forEach(key => {if(key.startsWith('$ACTION_')){delete details[key]}})

    const response = await fetch(`http://localhost/${state.api}`, {
        method: state.method,
        body: JSON.stringify(details)
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
    redirect('/')
}