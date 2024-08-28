"use client"

export default function Modal({children}){
    return(
        <>
            <section className="d-flex flex-column align-items-center justify-content-center bg-primary opacity-75 position-fixed top-0 start-0 w-100 h-100" style={{top:'10vh', left:'16.66666666%'}}>
            </section>
            <div className="container-xsm d-flex flex-column align-items-center bg-white border border-3 border-white rounded-3 px-3 py-5 p-md-5 gap-3 position-fixed translate-middle z-2 shadow-sm" style={{top:'50%', left:'50%', minWidth:'300px', transition:'all 2s ease-in-out'}}>
                {children}
            </div>
        </>
    )
}