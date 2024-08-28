import { ObjectId } from 'mongodb'

import Connection from "@/app/lib/db";
import Auth from "@/app/lib/auth"
import { Listing } from "@/app/components/cards";
import { getListings } from "@/app/lib/actions";

export const revalidate = 300

export async function generateStaticParams() {
    "use server"
    try{
        const listings = await Connection("afriqloan", "listings")
                                .then((listings)=>listings.find({}, {type:1}).toArray())
        return listings.map((listing) => ({
                    listing: listing.type
                }))
    }catch(error){
        console.log(error)
    }
}

export default async function Listings({params}) {
    const listings = await getListings(params)
    const { data } = await Auth()
    const user = await Connection("afriqloan", "users")
                        .then((users)=>users.findOne(
                            {_id:new ObjectId(data?._id)},
                            {projection: {type:1}}
                        ))
    if(!listings){
        throw new Error()
    }

    return (
        <>
            {listings?.length>0?
                <div id="spaces" className="container-md row align-self-center px-0">
                    {listings.map((listing)=>(
                        <div key={listing._id} className="position-relative col-12 col-md-6 col-xl-4 pb-5">
                            <Listing
                                _id={JSON.parse(JSON.stringify(listing._id))}
                                image={listing.image}
                                title={listing.title}
                                description={listing.description}
                                pricing={parseInt(listing.pricing)}
                                user={JSON.parse(JSON.stringify(user))}
                                status={listing.status}
                            />
                            {listing.status==="out of order" &&
                                <div className="d-flex position-absolute top-50 start-50 translate-middle px-4 py-2 bg-warning-subtle rounded-pill fw-semibold shadow-sm align-items-center text-primary">
                                    <i className="fa-solid fa-circle-exclamation me-2"></i>
                                    Out of Order
                                </div>
                            }
                        </div>
                    ))}
                </div>:
                <p className="text-danger">You do not have any listing under this category. Upload?</p>
            }
        </>
    );
}