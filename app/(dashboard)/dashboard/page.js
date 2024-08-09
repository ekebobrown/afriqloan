import Link from 'next/link'
import { cookies } from 'next/headers'

import { ObjectId } from 'mongodb'

import { Token } from '@/app/components/cards'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Dashboard() {
  const session_token = cookies().get("session_token")?.value
  const currencyFormat = new Intl.NumberFormat('en-US', {style:'currency', currency:'NGN'})

  const [balances] = await fetch(`${process.env.SITE_URL}/api/account/balances`, {
    headers: {
      Authorization: `Bearer ${session_token}`
    }
  }).then((response) => response.json())

  const transactions = await fetch(`${process.env.SITE_URL}/api/account/transactions`, {
    headers: {
      Authorization: `Bearer ${session_token}`
    }
  }).then((response)=>response.json())
  

  return (
    <div className="">
      <section className="d-flex flex-column bg-primary p-5 gap-4">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <h4 className="text-white">Hello Welcome</h4>
          <div className="d-flex btn-primary border border-2 border-white align-items-center rounded-pill text-white px-4 py-2 fs-5" role="button">
            <i className="fa-solid fa-money-bill-transfer me-2"></i>
            <span>Withdraw</span>
          </div>
          <Link href="/dashboard/fund?q=wallet" className="link d-flex btn-primary border border-2 border-white rounded-pill text-white align-items-center px-4 py-2 fs-5" role="button">
            <i className="fa-regular fa-square-plus me-2"></i>
            <span>Fund Wallet</span>
          </Link>
        </div>
        <div className="d-flex flex-column flex-md-row gap-3 row-cols-1 row-cols-md-3">
          {balances.account?.map((account)=>(
              <Token  key={account.type} title={account.type} balance={account.balance} />
          ))}
        </div>
      </section>
      <section id="transaction" className="d-flex flex-column row-gap-3 px-3 py-5 p-md-5">
        <div className="d-flex flex-column flex-md-row">
          <div className="d-flex flex-column me-auto">
            <h4>Transactions</h4>
            <span>Your Recent Transaction History</span>
          </div>
          <div className="d-flex gap-3 border border-1 rounded-3 p-1 align-items-center fs-5">
            <Link href="#" className="btn btn-primary">All</Link>
            <Link href="#" className="link">Contributions</Link>
            <Link href="#" className="link">Savings</Link>
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
      </section>
    </div>
  )
}
