import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ObjectId } from 'mongodb'

import Connection from '@/app/lib/db'
import Auth from '@/app/lib/auth'
import { Loan } from '@/app/components/forms'

import styles from "@/app/page.module.css"

export const metadata = {
  title: "AfriqLoan - Loan Application",
};

export default async function LoanRequest({searchParams}) {
  const type = searchParams.type
  const { data } = await Auth()
  const user = await Connection("afriqloan", "users").then((users)=>users.findOne({_id:new ObjectId(data._id)},{projection: {_id:0, password:0, avatar:0, testimony:0, accounts:0, savings:0}}))
  let content

  if(!user||(type!="individual"&&type!="corporate")){
      notFound()
  }else if(user.loans?.length > 0 && type==="individual"){
    content =
        <>
          <p>You cannot access this form because you are currently running on loan</p>
          <div className="d-inline-flex flex-column flex-md-row gap-2">
            <Link href="/loans" className="btn btn-primary border border-2 rounded-pill px-4" replace>Check Loan Status</Link>
            <Link href={{query: { type: 'corporate' }}} className="btn btn-primary border border-2 rounded-pill px-4" replace>Apply As Corporate?</Link>
          </div>
        </>
  }else{
    content =  <Loan user={JSON.parse(JSON.stringify(user))} type={type} />
  }

  return (
    <section className="m-3 m-md-5 p-4 p-md-5 rounded-3 bg-light border border-1">
      {content}
    </section>
  )
}
