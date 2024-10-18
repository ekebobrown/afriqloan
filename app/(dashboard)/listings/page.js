import Link from "next/link"
import { redirect } from 'next/navigation'

import { ListingsFallback } from "@/app/components/fallbacks"
import Listings from "@/app/(main)/services/listings/[listing]/page"
import { Suspense } from "react"
import { ObjectId } from "mongodb"

import NotFound from "@/app/(dashboard)/not-found"
import Connection from "@/app/lib/db"
import Auth from "@/app/lib/auth"

export const metadata = {
    title: "AfriqLoan - User Listings",
  };

export default async function UserListings({searchParams}) {
    if(!Object.hasOwn(searchParams, 'type')) (
        redirect("/listings?type=coworking")
    )
    const params = await searchParams
    const { data } = await Auth()
    const user = await Connection("afriqloan","users")
                        .then((users)=>users.findOne({_id:new ObjectId(data._id)},{projection: {_id:0, type:1}}))

    if(user.type === "user"){
        return(
            <NotFound />
        )
    }

    return (
        <section id="listings" className="d-flex flex-column p-3 p-md-5 gap-4 position-relative">
            <h4 className="text-primary mb-0">Your Recent Listings</h4>
            <div className="d-flex flex-column flex-md-row justify-content-between">
                <div className="flex-fill d-flex flex-column flex-md-row justify-content-between gap-3">
                    <Link href="/listings/listing?mode=new" className="btn btn-outline-primary border border-2 border-primary rounded-pill fs-6 fw-semibold me-md-3 lh-1 px-3"><i className="fa-solid fa-square-plus me-2"></i>Add Listing</Link>
                    <Link href="/listings/orders" className="btn btn-outline-primary border border-2 border-primary rounded-pill fs-6 fw-semibold me-md-auto lh-1 px-3"><i className="fa-solid fa-gauge me-2"></i>Management Dashboard</Link>
                    <div className="d-flex">
                        {/*<div className="d-flex bg-primary rounded-start-2 text-white fw-semibold px-4 align-items-center fs-5">Filter</div>*/}
                        <input type="date" defaultValue="2024-08-30" className="d-flex flex-fill border border-2 border-primary rounded-pill px-4 py-2" />
                    </div>
                </div>
            </div>
            <div className="d-flex border border-2 bg-tertiary border-primary rounded-pill justify-content-between row-cols-2 p-1">
                <Link href="/listings?type=coworking" scroll={false} replace={true} className={`${params.type==='coworking'?'bg-primary rounded-pill text-white fw-semibold shadow':''} btn fs-4 fw-bold`}>Co-Working</Link>
                <Link href="/listings?type=officespace" scroll={false} replace={true} className={`${params.type==='officespace'?'bg-primary rounded-pill text-white fw-semibold shadow':''} btn fs-4 fw-bold`}>Office Space</Link>
            </div>
            <Suspense fallback={<ListingsFallback />}>
                <Listings params={params.type} />
            </Suspense>
        </section>
    )
}
