"use client"
import { useState, useEffect } from "react"
import Skeleton from "react-loading-skeleton"

export default function Recents({session_token, joint_account}){
    const [tab, setTab] = useState("transactions")
    const [invites, setInvites] = useState()
    const [transactions, setTransactions] = useState()
    const currencyFormat = new Intl.NumberFormat('en-NG', {style:'currency', currency:'NGN'})
    useEffect(()=>{
        fetch(`/api/account/savings/${tab}`, {
            headers: {
            Authorization: `Bearer ${session_token}`
        }})
        .then((response)=>response.json())
        .then((data)=>{tab==="transactions"?setTransactions(data):setInvites(data)})
    }, [tab, session_token])

    return(
        <>
        <div className="d-flex flex-column flex-md-row align-items-end">
          <h4 className="mb-0">Recent {tab.charAt(0).toUpperCase()+tab.slice(1,)}</h4>
          {joint_account &&
            <div className="d-flex gap-3 border border-1 rounded-3 p-1 align-items-center fs-5 ms-auto">
                <button onClick={()=>setTab("transactions")} className={`btn ${tab==="transactions"?'bg-primary border border-2 border-primary text-white':'link p-2'}`}>Transactions</button>
                <button onClick={()=>setTab("invites")}  className={`btn ${tab==="invites"?'bg-primary border border-2 border-primary text-white':'link p-2'}`}>Invites</button>
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
                    {transactions?.map((transaction)=>(
                        <tr key={transaction._id}>
                            <td>{transaction.destination||<Skeleton width={100} height={30} />}</td>
                            <td><div className="d-flex flex-column">{new Date(transaction.timestamp).toDateString()||<Skeleton />}<small className="text-primary" style={{fontSize: "0.8rem"}}>{new Date(transaction.timestamp).toLocaleTimeString()}</small></div></td>
                            <td>{currencyFormat.format(transaction.amount)||<Skeleton />}</td>
                            <td>{`Ref-${transaction._id}`||<Skeleton />}</td>
                        </tr>
                    ))}
                </tbody>
                </table>:
                <table className="table table-hover flex-fill border border-1 rounded-4 fs-6 text-nowrap">
                    <thead className="">
                        <tr className="table-light">
                            <th>S/N</th>
                            <th>Email</th>
                            <th>Invited</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invites &&
                        invites?.length<=0?
                            <>You haven&#39;t invited anybody just yet. Invite now?</>:
                            invites?.map((invite, i)=>(
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{invite.email}</td>
                                <td>{new Date(invite.invitedAt).toDateString()}</td>
                                <td>{invite.status}</td>
                            </tr>
                        ))}
                        {!invites && 
                            [1,2,3].map((elem)=>(
                                <tr key={elem}>
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