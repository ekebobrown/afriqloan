"use client"
import { useState } from "react"

export function ComponentMount({children, className="btn-outline-primary rounded-pill align-self-center", props}){
    const [state, setState] = useState(false)
    return(
        <button className={`btn ${className}`} onClick={()=>setState(!state)}>
            {children}{!state && " link"}
        </button>
    )
}