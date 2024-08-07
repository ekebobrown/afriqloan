import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'

import Auth from '@/app/lib/auth'
import { logout } from '@/app/lib/actions'

export default async function Header() {
  const session_token = cookies().get("session_token")?.value
  const {data} = await Auth(session_token).then((res)=>res.json())

  return (
    <header className="bg-light">
        <div className="container-xl d-flex px-4 py-4 align-items-center">
        <div className="d-flex col-8 col-md-12 align-items-center">
            <div className="d-flex flex-column me-auto align-items-end">
              <button type="button" className="border-0 bg-light d-inline-flex me-auto align-items-center gap-2" data-bs-toggle="collapse" data-bs-target="#dropdown" aria-controls="dropdown" aria-expanded="false">
                <Image src={data?.avatar||"/assets/picture-placeholder.jpeg"} width={40} height={40} style={{borderRadius:"5px"}} alt="avatar"/>
                <span className="fs-5 fw-bold">{data.names}</span>
                <i className="fa-solid fa-angle-down"></i>
              </button>
              <div className="d-flex">
                <ul className="collapse dropdown" id="dropdown">
                  <li className="dropdown-item">Profile</li>
                  <li className="dropdown-item">Settings</li>
                  <li className="dropdown-item"><form action={logout}><button type="submit" className="dropdown-item d-inline-flex align-items-center">Logout</button></form></li>
                </ul>
              </div>
            </div>
            <span className="position-relative">
              <i className="fa-regular fa-bell fa-xl"></i>
              <div className="position-absolute top-0 end-0 d-flex align-items-center justify-content-center translate-middle-y rounded-circle bg-warning" style={{width:'15px', height:'15px'}}><small>6</small></div>
            </span>
        </div>
        </div>
    </header>
  )
}
