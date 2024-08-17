"use client"
import { useState } from "react"
import Link from "next/link"

export function ComponentMount({children, className="btn-outline-primary rounded-pill align-self-center", props}){
    const [state, setState] = useState(false)
    return(
        <button className={`btn ${className}`} onClick={()=>setState(!state)}>
            {children}{!state && " link"}
        </button>
    )
}

export function PrimaryLinkButtonIcon({children, href}) {
    return(
        <Link href={href} className="d-flex link btn-primary border border-2 border-white align-items-center rounded-pill text-white px-4 py-2 fs-5" role="button">
            {children}
        </Link>
    )
}