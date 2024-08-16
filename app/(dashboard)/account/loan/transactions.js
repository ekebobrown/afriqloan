"use client"

import { useState, useEffect } from "react"
import Skeleton from "react-loading-skeleton"

export default function Transactions({ token }) {
    const [transactions, setTransactions] = useState()
    const [tab, setTab] = useState("all")
    const currencyFormat = new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'})
    let content

    useEffect(()=>{
            fetch(`/api/account/loans?q=${tab}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => response.json())
            .then((data) => setTransactions(data))
            .catch(error => setTransactions(error.message))
    },[token, tab])


    if(!transactions){
        content =
        <>
            <div className="d-flex flex-column flex-md-row">
                <div className="d-flex flex-column me-auto">
                    <h4><Skeleton width={100} /></h4>
                    <span><Skeleton width={240} /></span>
                </div>
                <div className="d-flex gap-3 border border-1 rounded-3 p-1 align-items-center fs-5">
                    <Skeleton height={50} width={80} className="bg-dark-subtle" />
                    <Skeleton width={140} className="bg-dark-subtle" />
                    <Skeleton width={140} className="bg-dark-subtle" />
                </div>
            </div>
            <div className=" overflow-x-scroll" style={{scrollbarWidth:'none'}}>
                <table className="table table-hover flex-fill border border-1 rounded-4 fs-5 text-nowrap">
                    <thead className="">
                        <tr className="table-light">
                            <th><Skeleton /></th>
                            <th><Skeleton /></th>
                            <th><Skeleton /></th>
                            <th><Skeleton /></th>
                            <th><Skeleton /></th>
                            <th><Skeleton /></th>
                            <th><Skeleton /></th>
                        </tr>
                    </thead>
                    <tbody>
                    {[1,2,3].map((datum)=>(
                        <tr key={datum}>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><div className="d-flex flex-column"><Skeleton /><small className="text-primary" style={{fontSize: "0.8rem"}}><Skeleton /></small></div></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        <td><Skeleton /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    }else if(transactions){
        if(typeof transactions === "String"){
            console.log(transactions)
            content =
                <div className="d-flex flex-column me-auto">
                    <h4>History</h4>
                    <span className="text-danger">There was an error retrieving your record</span>
                </div>
        }else if(transactions.length<=0){
            content =
                <div className="d-flex flex-column me-auto">
                    <h4>History</h4>
                    <span className="text-info">No record found</span>
                </div>
        }else{
            content =
                <>
                <div className="d-flex flex-column flex-md-row">
                    <div className="d-flex flex-column me-auto">
                        <h4>History</h4>
                        <span>Your Recent {tab==="applications"?'Application':'Transaction'} History</span>
                    </div>
                    <div className="d-flex gap-3 border border-1 rounded-3 p-1 align-items-center fs-5">
                        <button onClick={()=>setTab("all")} className={`btn ${tab==="all"?'bg-primary border border-2 border-primary text-white':'link p-2'}`}>All</button>
                        <button onClick={()=>setTab("applications")}  className={`btn ${tab==="applications"?'bg-primary border border-2 border-primary text-white':'link p-2'}`}>Applications</button>
                        <button onClick={()=>setTab("repayments")}  className={`btn ${tab==="repayments"?'bg-primary border border-2 border-primary text-white':'link p-2'}`}>Repayments</button>
                    </div>
                </div>
                <div className=" overflow-x-scroll" style={{scrollbarWidth:'none'}}>
                    <table className="table table-hover flex-fill border border-1 rounded-4 fs-5 text-nowrap">
                        <thead className="">
                            <tr className="table-light">
                                <th>S/N</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Tenure</th>
                                <th>Status</th>
                                <th>Transaction Reference</th>
                            </tr>
                        </thead>
                        <tbody>
                        {transactions?.map((datum, i)=>(
                            <tr key={datum._id}>
                            <td>{i+1}</td>
                            <td>{datum.purpose}</td>
                            <td>{currencyFormat.format(datum.amount)}</td>
                            <td><div className="d-flex flex-column">{new Date(datum.requestedAt).toDateString()}<small className="text-primary" style={{fontSize: "0.8rem"}}>{new Date(datum.requestedAt).toLocaleTimeString()}</small></div></td>
                            <td>{datum.tenure}</td>
                            <td>{datum.status}</td>
                            <td>Ref-{datum._id}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </>
        }
    }

    return (
        <>
            {content}
        </>
    )
}
