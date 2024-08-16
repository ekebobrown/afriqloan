import Link from 'next/link'
import { cookies } from 'next/headers'
import { Suspense } from 'react'


import { PrimaryLinkButtonIcon } from '@/app/components/buttons'
import Transactions from '@/app/(dashboard)/account/loan/transactions'
import { Transaction } from '@/app/components/fallbacks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Dashboard() {
  const session_token = cookies().get("session_token")?.value
  const currencyFormat = new Intl.NumberFormat('en-US', {style:'currency', currency:'NGN'})

  /*
  const [balances] = await fetch(`${process.env.SITE_URL}/api/account/balances`, {
    headers: {
      Authorization: `Bearer ${session_token}`
    }
  }).then((response) => response.json())
  */

  return (
    <>
      <section className="d-flex flex-column bg-primary p-5 gap-5">
        <div className="d-flex flex-column">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
            <h4 className="text-white">Hello Welcome!</h4>
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between row-gap-2">
            <PrimaryLinkButtonIcon href="/loan/application">
              <i className="fa-solid fa-money-bill-1 me-2"></i>
              <span>New Loan</span>
            </PrimaryLinkButtonIcon>
            <PrimaryLinkButtonIcon href="/loan/repayment">
              <i className="fa-solid fa-money-bill-transfer me-2"></i>
              <span>Repay Loan</span>
            </PrimaryLinkButtonIcon>
            <PrimaryLinkButtonIcon href="/loan/calculator">
              <i className="fa-solid fa-calculator me-2"></i>
              <span>Calculator</span>
            </PrimaryLinkButtonIcon>
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row gap-5">
          <div className="flex-fill d-flex flex-column p-5 justify-content-center align-items-center gap-3 rounded-4 bg-white">
            <h5>Active Loan</h5>
            <p className="display-6 fw-semibold">=N= 0.00</p>
          </div>
          <div className="flex-fill d-flex flex-column p-5 justify-content-center align-items-center gap-3 rounded-4 bg-white">
            <h5>Repayment Balance</h5>
            <p className="display-6 fw-semibold">=N= 0.00</p>
          </div>
        </div>
      </section>
      <section id="transaction" className="bg-white d-flex flex-column row-gap-3 px-3 py-5 p-md-5">
        <Suspense fallback={<Transaction />}>
          <Transactions />
        </Suspense>
      </section>
    </>
  )
}
