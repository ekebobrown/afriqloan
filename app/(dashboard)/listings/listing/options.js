import Link from "next/link"
import Image from "next/image"

import coliving from "@/public/icons/coliving.png"
import space from "@/public/icons/space-alt.png"
import coworking from "@/public/icons/coworking.png"

export default function Add(){
    return(
        <section className="d-flex flex-column p-5 gap-4">
           <h4>Choose Listing Type</h4>
           <div className="d-flex flex-column row-cols-1 row-cols-md-3 flex-md-row">
                <Link href="/listings/add?type=coliving" className="d-flex flex-column bg-white justify-content-center align-items-center border border-1 p-lg link rounded-4 gap-4 shadow-sm">
                    <div className="bg-primary rounded-circle p-4">
                        <Image
                            src={coliving}
                            width={80}
                            height={80}
                            alt="icon"
                        />
                    </div>
                    <h3>Co living</h3>
                </Link>
           </div>
        </section>
    )
}