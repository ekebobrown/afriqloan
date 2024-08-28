
import Link from "next/link";

import Connection from "@/app/lib/db";
import {  Testimonial } from "@/app/components/cards";

export default async function Testimonials() {
    try{
        const connection = await Connection()
        const testimonies = await connection.db("afriqloan").collection("users").aggregate([
                                    {$match: {testimony: {$exists: true}}},
                                    {$sample: {size:4}},
                                    {$project: {_id:0, attester:"$names", avatar:1, content:"$testimony.content"}}]
                                ).toArray()
        if(testimonies){
            return (
                <div className="d-flex flex-column gap-4">
                    {testimonies.length>=1?
                            <div className="row row-cols-1 row-cols-md-3">
                                {testimonies.map((testimony, i)=>(
                                    <div key={i} className="py-3">
                                        <Testimonial layout={i===0||i===3?1:2} author={testimony.attester} avatar={testimony.avatar}>
                                            <p>{testimony.content}</p>
                                        </Testimonial>
                                    </div>
                                ))}
                        </div>:
                        <p className="text-info">No Testimonials</p>
                    }
                    <Link href="#testimonials" className="btn btn-primary rounded-pill border border-2 px-4 border-primary align-self-end">Write A Review</Link>
                </div>
            )

        }
    }catch(error){
        return (
            <p className="text-danger">Error fetching testimonials. Kindly refresh to try again</p>
        )

    }
}