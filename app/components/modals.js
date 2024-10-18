"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function Modal({children, width=0, height=0, transform='translate(-50%, -50%)', setModal}){
    return(
        <>
            <section className="d-flex flex-column justify-content-center align-items-center position-fixed overflow-hidden transition" style={{top:'50%', left:'50%', width:width, height:height, transform:transform, zIndex:9999, backgroundColor:'rgba(0, 0, 0, 0.5)'}} onClick={(e)=>e.target.nodeName==="SECTION" && setModal({width:0, height:0, opacity:0})}>
                <div className="container-xsm d-flex flex-column align-items-center bg-white border border-3 border-white rounded-3 gap-3 shadow-sm position-relative" style={{minWidth:'300px', maxHeight:`calc(${height} - 100px)`}}>
                    {children}
                </div>
            </section>
        </>
    )
}

export function Overlay(){
    const id = useSearchParams().get("id")
    useEffect(()=>{
        const overlay = document.getElementsByClassName("overlay")[0]
        if(!id) overlay.classList.remove('slidein')
    }, [id])

    return (
        <section className="overlay transition">
            <div id="portal" className="portal container-xsm">
            </div>
        </section>
    )
}