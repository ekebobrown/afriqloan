"use client"
import { useState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"

export function ComponentMount({children, className="btn-outline-primary rounded-pill align-self-center", props}){
    const [state, setState] = useState(false)
    return(
        <button className={`btn ${className}`} onClick={()=>setState(!state)}>
            {children}{!state && " link"}
        </button>
    )
}

export function PrimaryLinkButtonIcon({children, href, disabled}) {
    const {pending} = useFormStatus()
    return(
        <>
        {disabled?
            <button type="button" className="d-flex border border-2 border-white align-items-center rounded-pill text-white px-4 py-2 fs-5" title="You have an active loan" disabled>{children}</button>:
            <Link href={href} className="d-flex link btn-primary border border-2 border-white align-items-center rounded-pill text-white px-4 py-2 fs-5" >
                {children}
            </Link>
        }
        </>
    )
}

export function Submit({children}) {
    const { pending } = useFormStatus();
    return (
      <button type="submit" className="btn btn-primary rounded-pill border border-2 border-white" disabled={pending}>
        {pending ?
        <><i className="fa-solid fa-circle-notch fa-spin fa-spin-pulse me-2"></i>Please Wait...</>:children}
      </button>
    );
  }