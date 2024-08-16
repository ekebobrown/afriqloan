"use client"

import { useState, useEffect } from "react"

export default function Tab({user}){
    const [tab, setTab] = useState("transactions")

    return (
        <div className="d-flex flex-column"> 
            <div className="d-flex flex-column flex-md-row align-items-end">
                <h4 className="mb-0">{tab==="transactions"?'Transactions History':'Recent Invites'}</h4>
                {user[0]?.accounts[2]?.type==="Joint Savings" &&
                    <div className="d-flex gap-3 border border-1 rounded-3 p-1 align-items-center fs-5 ms-auto">
                        <button className={`btn ${tab==="transactions"?'btn-primary border border-2 border-primary':'link'}`} onClick={()=>setTab("transactions")}>Transactions</button>
                        <button className={`btn ${tab==="invites"?'btn-primary border border-2 border-primary':'link'}`} onClick={()=>setTab("invites")}>Recent Invites</button>
                    </div>
                }
            </div>
            {tab==="transactions"?<></>:<></>}
        </div>
    )
}