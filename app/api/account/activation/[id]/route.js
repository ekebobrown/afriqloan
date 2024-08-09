import { NextResponse } from "next/server"

import Connection from "@/app/lib/db"

export async function GET(request, {params}){
    const activationId = params.id
    const userId = activationId.split("-")[0]

    try{
        //Check for database connectivity
        const collection = await Connection("afriqloan","pending_activations")
        if(!collection.s){
            const response = await collection.json()
            throw new Error(response.error, {cause: {status: response.status}})
        }
        //Query database for activation string status
        const activation = await collection.findOne({activationId: activationId})
        if(!activation){
            throw new Error('You have followed an expired or invalid activation link. Please check the link and try again.', {cause: {status: 404}})
        }
        //Check for user activation status
        if(activation.user.status==="activated") {
            return NextResponse.json(
                {
                    message: "Account has already been activated. You will be redirected shortly to the login page"
                },
                {
                    status: 303,
                    headers: {
                        'x-redirected':true,
                        'x-redirected-to':'/login'
                    }
                }
            )
        }
        return NextResponse.json({message: "Account activation successful. Redirecting..."}, {status: 200})
    }catch(error){
        return NextResponse.json({error:error.message||"Error activating account."}, {status:error.cause?.status||500})
    }
}