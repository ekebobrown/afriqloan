import Link from "next/link"
import { cookies } from "next/headers"
import { ObjectId } from 'mongodb'

import Error from "@/app/(dashboard)/error"

export default async function Transactions() {
    const session_token = cookies().get("session_token")?.value
    const currencyFormat = new Intl.NumberFormat('en-US', {style:'currency', currency:'NGN'})

    const transactions = await fetch(`${process.env.SITE_URL}/api/account/transactions`, {
      headers: {
        Authorization: `Bearer ${session_token}`
      }
    }).then((response)=>response.json())

  return (
    <>
    {transactions?<>
        <div className="d-flex flex-column flex-md-row">
            <div className="d-flex flex-column me-auto">
                <h4>Transactions</h4>
                <span>Your Recent Transaction History</span>
            </div>
            <div className="d-flex gap-3 border border-1 rounded-3 p-1 align-items-center fs-5">
                <Link href="#" className="btn btn-primary">All</Link>
                <Link href="#" className="link p-2">Contributions</Link>
                <Link href="#" className="link p-2">Savings</Link>
            </div>
        </div>
        <div className=" overflow-x-scroll" style={{scrollbarWidth:'none'}}>
            <table className="table table-hover flex-fill border border-1 rounded-4 fs-5 text-nowrap">
                <thead className="">
                    <tr className="table-light">
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Reference</th>
                    </tr>
                </thead>
                <tbody>
                {transactions.map((datum)=>(
                    <tr key={datum._id}>
                    <td>{datum.source}</td>
                    <td>{datum.destination}</td>
                    <td><div className="d-flex flex-column">{(new ObjectId(datum._id).getTimestamp()).toDateString()}<small className="text-primary" style={{fontSize: "0.8rem"}}>{(new ObjectId(datum._id).getTimestamp()).toLocaleTimeString()}</small></div></td>
                    <td>{currencyFormat.format(datum.amount)}</td>
                    <td>Ref-{datum._id}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </>:<Error />}
    </>
  )
}
