import Image from 'next/image'
import Link from 'next/link'
import { ObjectId } from 'mongodb'

import Connection from '@/app/lib/db'
import Auth from '@/app/lib/auth'
import { logout } from '@/app/lib/auth'

import logo from "@/public/logo.png"

export default async function Header() {
  const { data } = await Auth()
  const connection = await Connection()
  const [ user ] = await connection.db("afriqloan").collection("users").aggregate([
                                    {$match: {_id: new ObjectId(data?._id)}},
                                    {$lookup: {from:"notifications", localField:"_id", foreignField:"receiver", as:"notifications"}},
                                    {$project: {_id:0, names:1, avatar:1, notifications:{$size: {$filter: {input:"$notifications", cond:{$eq: [{$ifNull: ["$$this.status","read"]}, "unread"]}}}}}}
                                  ]).toArray()
  if(!user){
    throw new Error("An error occured trying to retrieve user information")
  }

  return (
    <header className="bg-light sticky-md-top d-flex align-items-center" style={{height:'10vh', minHeight:'50px'}}>
        <nav className="flex-fill d-flex align-items-center">
          <div className="d-flex col-5 col-md-2" style={{paddingLeft:'1.0rem'}}>
            <div className="d-flex">
              <button className={`navbar-toggler border-2 border-primary p-1 me-2`} data-bs-toggle="offcanvas" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                <i className="fa-solid fa-bars text-primary"></i>
              </button>
              <Link className="navbar-brand-dark col-4 col-md-3 fs-3 fw-bolder text-primary" href="/dashboard">
                AfriqLoan
              </Link>
            </div>
          </div>
          <div className="d-flex col-7 col-lg-10 align-items-center justify-content-end flex-fill pe-4 py-2">
              <div className="d-flex flex-column align-items-end align-items-lg-start position-relative flex-fill align-self-md-start">
                <button type="button" className="border-0 bg-light d-inline-flex align-items-center gap-2 order-1 order-lg-0" data-bs-toggle="collapse" data-bs-target="#dropdown" aria-controls="dropdown" aria-expanded="false">
                  <Image src={user?.avatar||"/assets/picture-placeholder.jpeg"} className="order-1 order-lg-0" width={40} height={40} style={{borderRadius:"5px"}} alt="avatar"/>
                  <span className="d-none d-md-block fs-5 fw-bold order-0 order-lg-1 text-truncate">{user?.names}</span>
                  <i className="fa-solid fa-angle-down"></i>
                </button>
                <div className="d-flex position-absolute bg-white rounded-3 z-3 mt-3 ms-md-1 mt-md-3 shadow" style={{top: "40px", left: "0px", width: "220px"}}>
                  <ul className="collapse dropdown flex-fill p-2 mb-0" id="dropdown">
                    <li className="dropdown-item px-4 py-2"><Link href="/profile" className="link">Profile</Link></li>
                    <li className="dropdown-item px-4 py-2"><Link href="/settings" className="link">Settings</Link></li>
                    <li className="dropdown-item px-4 py-2"><form action={logout}><button type="submit" className="dropdown-item link">Logout</button></form></li>
                  </ul>
                </div>
              </div>
              <span className="d-none d-lg-block position-relative order-0 order-md-1 ms-auto" role="button">
                <i className="fa-regular fa-bell fa-xl"></i>
                {user?.notifications>0&&<div className="position-absolute top-0 end-0 d-flex align-items-center justify-content-center translate-middle-y rounded-circle bg-warning" style={{width:'15px', height:'15px'}}><small>{user.notifications}</small></div>}
              </span>
          </div>
        </nav>
    </header>
  )
}
