import { NextResponse } from "next/server";

import { SpaceCard } from "@/app/components/cards";
import Connection from "@/app/lib/db";

export async function generateStaticParams() {
    "use server"
    const collection = await Connection("afriqloan", "spaces")
    const spaces = await collection.find({}, {type:1})
                                        .toArray()
    return spaces.map((space) => ({
            space: space.type,
            })) 
}

async function getSpaces(params){
    "use server"
    try{
        const connection = await Connection("afriqloan", "spaces")
        const spaces = await connection.find({type:params.space})
                                        .toArray()
        return NextResponse.json(spaces)
    }catch(error){
        return NextResponse.json({error: error.message||"Error retrieving spaces, please try again"},{status: error.status||500})
    }
}

export default async function Space({params}) {
    const spaces = await (await getSpaces(params)).json()
    var content

    if(spaces?.length>0){
        content =
            <div className="container-md row row-cols-1 row-cols-md-3 align-self-center">
                {spaces.map((space)=>(
                    <div key={space._id} className="pb-5">
                        <SpaceCard
                            image={space.image}
                            title={space.title}
                            description={space.description}
                            charge={parseInt(space.amount)}
                        />
                    </div>
                ))}
            </div>
    }else{
        content=<p className="text-danger">{spaces.error}</p>
    }

    return (
        <>
            {content}
        </>
    );
}
