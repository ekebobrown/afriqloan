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
    <div id="sidebar" className="col-lg-2 fs-6 position-fixed bg-light h-100 overflow-scroll z-1" style={{paddingBottom:'16vh'}}>
        <nav id="navbar" className={`offcanvas offcanvas-start flex-column w-100 align-items-start overflow-scroll bg-light`} style={{height:"100%", maxWidth:"70vw"}}>
          <div className="w-100 offcanvas-header d-lg-none justify-content-between align-items-center text-primary" tabIndex="-1" aria-labelledby="offcanvastitle">
            <h5 className="offcanvas-title" id="offcanvastitle">Navigation</h5>
            <i className="fa-regular fa-circle-xmark" data-bs-dismiss="offcanvas" aria-label="Close"></i>
          </div>
          <div className="d-flex flex-column w-100 offcanvas-body p-0">
            <ul className="navbar-nav d-lg-flex flex-column mb-auto align-self-stretch">
                <User user={user}/>
            </ul>
            <ul className="d-lg-flex flex-column mb-0">
                <Info />
            </ul>
          </div>
        </nav>
    </div>
  )
}
