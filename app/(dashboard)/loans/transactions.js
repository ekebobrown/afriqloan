"use client"

import { useState, useEffect } from "react"
import Skeleton from "react-loading-skeleton"

export default function Transactions({ id }) {
    const [transactions, setTransactions] = useState()
    const [tab, setTab] = useState("all")
    const currencyFormat = new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'})
    let content

    useEffect(()=>{
            fetch(`/api/loans?q=${tab}`, {
                headers: {
                    "x-authorization-id": id
                }
            })
            .then((response) => response.json())
            .then((data) => setTransactions(data))
            .catch(error => setTransactions(error.message))
    },[id, tab])


    if(!transactions){
        content =
        <>
            <div className="d-flex flex-column flex-md-row">
                <div className="d-flex flex-column me-auto">
                    <h4><Skeleton width={100} /></h4>
                    <span><Skeleton width={240} /></span>
                </div>
                <div className="d-flex gap-3 border border-1 rounded-3 p-1 align-items-center fs-5">
                    <Skeleton height={50} width={40} />
                    <Skeleton width={100} />
                    <Skeleton width={100} />
                </div>
            </div>
            <div className=" overflow-x-scroll" style={{scrollbarWidth:'none'}}>
                <table className="table table-hover flex-fill border border-1 rounded-4 fs-5 text-nowrap">
                    <thead className="">
                        <tr className="table-light">
                            <th style={{width:'5%'}}><Skeleton /></th>
                            <th style={{width:'15%'}}><Skeleton /></th>
                            <th style={{width:'15%'}}><Skeleton /></th>
                            <th style={{width:'15%'}}><Skeleton /></th>
                            <th style={{width:'10%'}}><Skeleton /></th>
                            <th style={{width:'10%'}}><Skeleton /></th>
                            <th style={{width:'30%'}}><Skeleton /></th>
                        </tr>
                    </thead>
                    <tbody>
                    {[1].map((datum, i)=>(
                        <tr key={i}>
                            <td><Skeleton /></td>
                            <td><Skeleton /></td>
                            <td><Skeleton /></td>
                            <td><div className="d-flex flex-column"><Skeleton /><small className="text-primary" style={{fontSize: "0.8rem"}}><Skeleton width={50} /></small></div></td>
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
                            <span>Your Recent {tab==="applications"&&'Application'}{tab==="repayments"&&'Repayment'}{tab==="all"&&''} History</span>
                        </div>
                        <div className="d-flex gap-1 border border-1 rounded-3 p-1 align-items-center fs-5 shadow-sm">
                            <button onClick={()=>setTab("all")} className={`flex-fill btn ${tab==="all"?'bg-primary border border-2 border-primary text-white shadow-sm':'link p-2'}`}>All</button>
                            <button onClick={()=>setTab("applications")}  className={`btn ${tab==="applications"?'bg-primary border border-2 border-primary text-white shadow-sm':'link p-2'}`}>Applications</button>
                            <button onClick={()=>setTab("repayments")}  className={`btn ${tab==="repayments"?'bg-primary border border-2 border-primary text-white shadow-sm':'link p-2'}`}>Repayments</button>
                        </div>
                    </div>
                    <div className=" overflow-x-scroll" style={{scrollbarWidth:'none'}}>
                        <table className="table table-hover flex-fill border border-1 rounded-4 fs-6 text-nowrap">
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
                                    <td><div className="d-flex flex-column">{new Date(datum.requested).toDateString()}<small className="text-primary" style={{fontSize: "0.8rem"}}>{new Date(datum.requested).toLocaleTimeString()}</small></div></td>
                                    <td>{datum.tenure}</td>
                                    <td>{datum.status}</td>
                                    <td>Ref-{datum.ref}</td>
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
