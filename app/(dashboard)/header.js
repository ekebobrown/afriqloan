import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'

import Auth from '@/app/lib/auth'
import { logout } from '@/app/lib/actions'

export const dynamic = "force-static"

export default async function Header() {
  const session_token = cookies().get("session_token")?.value
  const {user} = await Auth(session_token)

  return (
    <header id="dashboard-nav" className="bg-light">
        <div className="d-flex align-items-center">
          <div className="d-flex col-5 col-md-2" style={{paddingLeft:'1.0rem'}}>
            <div className="d-flex">
              <button className={`navbar-toggler border-2 border-primary p-1 me-2`} data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                <i className="fa-solid fa-bars text-primary"></i>
              </button>
              <Link className="navbar-brand-dark col-4 col-md-3 fs-3 fw-bolder text-primary" href="/">AfriqLoan</Link>
            </div>
          </div>
          <div className="d-flex col-7 col-md-10 align-items-center justify-content-end flex-fill pe-4 py-4">
              <div className="d-flex flex-column align-items-end align-items-md-start position-relative flex-fill align-self-md-start">
                <button type="button" className="border-0 bg-light d-inline-flex align-items-center gap-2 order-1 order-md-0" data-bs-toggle="collapse" data-bs-target="#dropdown" aria-controls="dropdown" aria-expanded="false">
                  <Image src={user?.avatar||"/assets/picture-placeholder.jpeg"} className="order-1 order-md-0" width={40} height={40} style={{borderRadius:"5px"}} alt="avatar"/>
                  <span className="d-none d-md-block fs-5 fw-bold order-0 order-md-1 text-truncate">{user?.names}</span>
                  <i className="fa-solid fa-angle-down"></i>
                </button>
                <div className="d-flex position-absolute bg-tertiary rounded-3" style={{top: "40px", left: "5px", width: "250px"}}>
                  <ul className="collapse dropdown flex-fill mb-0" id="dropdown" style={{paddingLeft: "0 !important", marginBottom: "0 !important"}}>
                    <li className="dropdown-item px-4 py-2">Profile</li>
                    <li className="dropdown-item px-4 py-2">Settings</li>
                    <li className="dropdown-item px-4 py-2"><form action={logout}><button type="submit" className="dropdown-item d-inline-flex align-items-center">Logout</button></form></li>
                  </ul>
                </div>
              </div>
              <span className="d-none d-md-block position-relative order-0 order-md-1 ms-auto">
                <i className="fa-regular fa-bell fa-xl"></i>
                <div className="position-absolute top-0 end-0 d-flex align-items-center justify-content-center translate-middle-y rounded-circle bg-warning" style={{width:'15px', height:'15px'}}><small>6</small></div>
              </span>
          </div>
        </div>
    </header>
  )
}
