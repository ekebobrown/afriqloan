
"use client"
import { useState, useEffect, use } from "react"
import { notFound, useRouter, usePathname } from "next/navigation"
import { joinJointSavings } from "@/app/lib/actions"

export default function Join({searchParams}){
    const code = searchParams?.code
    const join = usePathname().includes("join")
    const [state, setState] = useState({code:code||"", pending:false})
    const router = useRouter()

    if(join && !code || code===""){
        notFound()
    }

    async function submit(){
        setState({...state, pending:true})
        const response = await joinJointSavings(state)
        setState(response)
    }

    if(state?.success){
        setTimeout(()=>{
            router.replace("/savings")
        }, 4000)
    }
    useEffect(()=>{
        if(join && code!==""){
            submit()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <div className={`w-100 d-flex flex-column gap-2 justify-content-center align-items-center ${join?'p-lg w-50 h-100':'p-4'}`}>
            <div className="text-center">
                <h4 className="text-primary mb-0">INVITATION CODE</h4>
                <p className="text-center text-primary mb-0">Kindly provide the invitation code you received.</p>
            </div>
            <form className={`${join?'col-12 col-md-6':'col-12'} d-flex flex-column gap-3`}>
                <input type="text" name="code" className="rounded-3 w-100" placeholder="Invitation Code" value={state?.code} onChange={(e)=>setState({...state, code:e.target.value})} disabled={state?.pending} required autoFocus/>
                <div className="w-100 d-flex flex-column flex-md-row gap-2 justify-content-center">
                    <button className="btn btn-primary border border-2 border-primary rounded-pill px-5" onClick={submit} disabled={state?.pending||state?.code.length!==10}>{state?.pending?<div className="d-flex align-items-center"><i className="fa-solid fa-circle-notch fa-spin me-2"></i>Please Wait...</div>:'Join'}</button>
                </div>
            </form>
            <em className={`text-center ${state?.success?"text-success":"text-danger"}`}>{state?.message}</em>
        </div>
    )
}