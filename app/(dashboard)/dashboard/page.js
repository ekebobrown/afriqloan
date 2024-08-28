import Link from 'next/link'
import { ObjectId } from 'mongodb'

import Auth from '@/app/lib/auth'
import Connection from '@/app/lib/db'
import { DashboardCard } from '@/app/components/cards'

export default async function Dashboard() {
  const { data } = await Auth()
  const [ user ] = await Connection("afriqloan", "users")
                    .then((users)=>users.aggregate([
                      {$match: {_id: new ObjectId(data?._id)}},
                      {$project: {role:1, savings:{$cond:[{$lte: [{$size: {$ifNull:["$savings",[]]}}, 0]}, false,  true]}, loans:{$cond: [{$lte: [{$size: {$ifNull:["$loans",[]]}}, 0]}, false,  true]}, type:1}}]
                    ).toArray())

  if(!user){
    throw new Error("An error occured trying to retrieve user information")
  }

  return (
    <section id="dashboard" className="bg-primary h-100">
      <div className="d-flex flex-column p-5 gap-3 position-relative">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <h4 className="text-white">Hello Welcome!</h4>
        </div>
        <div className="row gap-4 text-primary">
          <DashboardCard user={JSON.parse(JSON.stringify(user))} title="Co-working Mechant" service="space"/>
          <div className="card col-12 col-md-5 d-flex flex-column rounded-4 justify-content-between bg-white p-4 p-md-5 gap-4">
            <h4>Loan Recovery</h4>
            <div className="d-flex flex-row align-items-center">
              <div className="d-flex flex-column flex-xl-row me-auto gap-2">
                <Link href="/loans/recovery" className="btn btn-primary border border-2 border-primary rounded-pill fw-bold px-4">Apply</Link>
              </div>
              <span className="d-flex justify-content-center align-items-center p-2 rounded-circle" style={{backgroundColor: '#8AF0FF', width: '45px', height: '45px'}}>
                <i className="fa-solid fa-money-bill-transfer fa-fw fa-xl"></i>
              </span>
            </div>
          </div>
          <DashboardCard user={JSON.parse(JSON.stringify(user))} title="Loan" service="loan"/>
          <div className="card col-12 col-md-5 d-flex flex-column rounded-4 justify-content-between bg-white p-4 p-md-5 gap-4">
            <h4>Personal/Joint Savings</h4>
            <div className="d-flex flex-row align-items-center">
              <div className="d-flex flex-column flex-xl-row me-auto gap-2">
                <Link href={`/savings`} className="btn btn-primary border border-2 border-primary rounded-pill fw-bold px-4">{user.savings?"View Savings":"Create or Join Savings"}</Link>
              </div>
              <span className="d-flex justify-content-center align-items-center p-2 rounded-circle" style={{backgroundColor: '#8AF0FF', width: '45px', height: '45px'}}>
                <i className="fa-solid fa-piggy-bank fa-fw fa-xl"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
