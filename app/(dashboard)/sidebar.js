import { ObjectId } from 'mongodb'

import Connection from '@/app/lib/db'
import Auth from '@/app/lib/auth'
import { User, Info } from '@/app/(dashboard)/navigations'

export default async function Sidebar() {
  const { data } = await Auth()
  const [ user ] = await Connection("afriqloan", "users")
                    .then((users)=>users.aggregate([
                      {$match: {_id:new ObjectId(data?._id)}},
                      {$project: {_id:0, role:1, type:1, savings:{$cond:[{$lte: [{$size: {$ifNull:["$savings",[]]}}, 0]}, false,  true]}, loans: {$cond: [{$gt: [{$size: {$ifNull: [{$filter: {input: "$loans", cond: {$eq: ["$$this.status", "active"]}}},[]]}}, 0]}, true,  false]}}}]
                    ).toArray())

  if(!user){
    throw new Error("An error occured trying to retrieve user information")
  }

  return (
    <div id="sidebar" className="d-md-flex flex-column justify-content-start align-items-center fs-5 bg-light overflow-scroll">
        <div id="navbar" className={`collapse navbar-collapse d-md-flex flex-column w-100 align-items-start p-4 p-md-0`} style={{maxHeight:"90vh"}}>
          <ul className="navbar-nav d-flex flex-column mb-auto align-self-stretch">
              <User user={user}/>
          </ul>
          <ul className="d-flex flex-column">
              <Info />
          </ul>
        </div>
    </div>
  )
}
