import { notFound } from 'next/navigation'
import { ObjectId } from 'mongodb'

import Transactions from '@/app/(dashboard)/loans/transactions'
import Status from '@/app/(dashboard)/loans/status'
import Connection from '@/app/lib/db'
import Auth from '@/app/lib/auth'

export const metadata = {
  title: "AfriqLoan - Loans",
};

export default async function Loan() {
  const { data } = await Auth()
  const user = await Connection("afriqloan","users")
                      .then((users)=>users.findOne(
                        {_id:new ObjectId(data._id), "loans.status":"active"},
                        {projection: {_id:0, loans: {$literal: true}}}
                      ))
  if(!user?.loans){
    notFound()
  }

  return (
    <>
      <Status id={data._id} />
      <section id="transaction" className="bg-tertiary d-flex flex-column row-gap-3 px-3 py-5 p-md-5">
        <Transactions id={data._id} />
      </section>
    </>
  )
}
