import { ObjectId } from "mongodb"

import { Order } from "@/app/components/cards"
import Recent from "@/app/(dashboard)/listings/orders/recent"
import Auth from "@/app/lib/auth"
import { notFound } from "next/navigation"
import Connection from "@/app/lib/db"
import Preview from "@/app/(dashboard)/listings/orders/preview"

export const revalidate = 300

export const metadata = {
    title: "AfriqLoan - Orders",
  };

export default async function Orders(){
    const { data } = await Auth()
    let aggregate

    if(data.type!=='merchant') notFound()
    try{
        const collection = await Connection("afriqloan","orders")
        aggregate = await collection.aggregate([
                                    {$lookup: {
                                        from:"listings",
                                        localField:"items",
                                        foreignField:"_id",
                                        pipeline: [{$match: {$expr: {$eq: [new ObjectId(data?._id), "$merchant"]}}}],
                                        as:"items"
                                    }},
                                    {$unwind:"$items"},
                                    {$group: {_id:null, totalvalue:{$sum:"$items.pricing"}, customers:{$addToSet:"$customer"}}},
                                    {$project: {_id:0, totalvalue:1, customers:{$size:"$customers"}}}
                                ]).toArray()
    }catch(error){
        console.log(error)
    }

    return(
        <section className="d-flex flex-column p-4 p-md-5 gap-4">
            <h4 className="mb-0">Welcome Back!</h4>
            <div id="summary" className="d-flex flex-nowrap gap-4 overflow-scroll" style={{scrollbarWidth:'none'}}>
                <Order type="Orders" value={aggregate[0]?.totalvalue} bg="/total-orders.png" color="#8946CF" />
                <Order type="Customers" value={aggregate[0]?.customers} bg="/total-customers.png" color="#334FFB" />
                <Order type="Subscriptions" value={0} bg="/total-subscriptions.png" color="#3EB2FB" />
            </div>
            <div className="flex-fill d-flex flex-column flex-md-row gap-4">
                <div id="recent" className="recent sort flex-fill col-12 col-md-8 rounded-3 bg-light overflow-hidden position-relative align-self-start shadow-sm">
                    <Recent />
                </div>
                <div className="preview d-none d-md-flex flex-column flex-fill p-3 col-md-4 rounded-3 bg-light shadow-sm position-relative transition overflow-scroll align-self-start" style={{maxHeight:'500px'}}>
                    <Preview />
                </div>
            </div>
        </section>
    )
}