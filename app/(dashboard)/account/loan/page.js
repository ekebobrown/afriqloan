import { cookies } from 'next/headers'
import { Suspense } from 'react'


import Transactions from '@/app/(dashboard)/account/loan/transactions'
import Status from '@/app/(dashboard)/account/loan/status'
import { LoanStatusFallback } from '@/app/components/fallbacks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Loan() {
  const session_token = cookies().get("session_token")?.value

  return (
    <>
      <section className="d-flex flex-column bg-primary p-5 gap-5">
      <Suspense fallback={<LoanStatusFallback />}>
        <Status token={session_token} />
      </Suspense>
      </section>
      <section id="transaction" className="bg-tertiary d-flex flex-column row-gap-3 px-3 py-5 p-md-5">
        <Transactions token={session_token} />
      </section>
    </>
  )
}
