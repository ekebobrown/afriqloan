"use client"
import { useState, useEffect } from "react"
import Skeleton from "react-loading-skeleton"

export default function Recents({session_token, joint_account}){
    const [tab, setTab] = useState("transactions")
    const [invites, setInvites] = useState()
    const [transactions, setTransactions] = useState()
    const currencyFormat = new Intl.NumberFormat('en-NG', {style:'currency', currency:'NGN'})

    useEffect(()=>{
        fetch(`/api/savings/${tab}`, {
            headers: {
            Authorization: `Bearer ${session_token}`
        }})
        .then((response)=>response.json())
        .then((data)=>{tab==="transactions"?setTransactions(data):setInvites(data)})
    }, [tab, session_token])

    return(
        <>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <h4 className="mb-0">Recent {tab?.charAt(0).toUpperCase()+tab?.slice(1,)}</h4>
          {joint_account &&
            <div className="d-flex gap-3 border border-1 rounded-3 p-1 align-items-center fs-5 shadow-sm">
                <button onClick={()=>{window.localStorage.setItem("savings_active_tab","transactions"); setTab("transactions")}} className={`btn px-3 ${tab==="transactions"?'bg-primary border border-2 border-primary text-white shadow-sm':'link p-2'}`}>Transactions</button>
                <button onClick={()=>{window.localStorage.setItem("savings_active_tab","invites"); setTab("invites")}}  className={`btn px-3 ${tab==="invites"?'bg-primary border border-2 border-primary text-white shadow-sm':'link p-2'}`}>Pending Invites</button>
            </div>
          }
        </div>
        <div className=" overflow-x-scroll" style={{scrollbarWidth:'none'}}>
            {tab==="transactions"?
            <table className="table table-hover flex-fill border border-1 rounded-4 fs-6 text-nowrap">
                <thead className="">
                    <tr className="table-light">
                    <th>Transaction Type</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Reference</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions?.map((transaction, i)=>(
                        <tr key={i}>
                            <td>{transaction.destination}</td>
                            <td><div className="d-flex flex-column">{new Date(transaction.timestamp).toDateString()}<small className="text-primary" style={{fontSize: "0.8rem"}}>{new Intl.DateTimeFormat("en-US", {hour12:true, hour:"2-digit", minute:"2-digit"}).format(new Date(transaction.timestamp))}</small></div></td>
                            <td>{currencyFormat.format(transaction.amount)}</td>
                            <td>{`${transaction.destination.includes("Wallet")?"wallet":"savings"}-${transaction.reference}`}</td>
                        </tr>
                    ))}
                    {!(transactions||Array.isArray(transactions)) &&
                        [1,2].map((elem)=>(
                            <tr key={elem}>
                                <td><Skeleton /></td>
                                <td><Skeleton /><Skeleton width={50} /></td>
                                <td><Skeleton /></td>
                                <td><Skeleton /></td>
                            </tr>
                        ))
                    }
                </tbody>
                </table>:
                        invites &&
                        invites?.length<=0?
                            <>You do not have any pending request.</>:
                            <table className="table table-hover flex-fill border border-1 rounded-4 fs-6 text-nowrap">
                            <thead className="">
                                <tr className="table-light">
                                    <th style={{width:'10%'}}>S/N</th>
                                    <th style={{width:'35%'}}>Email/Phone Number</th>
                                    <th style={{width:'30%'}}>Invited</th>
                                    <th style={{width:'25%'}}>Status</th>
                                    <th style={{width:'25%'}}>Invitation Code</th>
                                </tr>
                            </thead>
                            <tbody>
                            {invites?.map((invite, i)=>(
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{invite.user}</td>
                                <td>{new Date(invite.sent).toDateString()}</td>
                                <td>{invite.status}</td>
                                <td>{invite.code}</td>
                            </tr>
                        ))}
                        {!(invites||Array.isArray(invites)) && 
                            [1,2,3].map((elem)=>(
                                <tr key={elem}>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                }
            </div>
        </>
    )
}