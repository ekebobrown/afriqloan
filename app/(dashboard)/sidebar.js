import React from 'react'
import Link from 'next/link'

import { User, Info } from '@/app/(main)/navigations'

export default function Sidebar() {
  return (
    <div id="sidebar" className="d-flex flex-column justify-content-start fs-5">
        <Link className="navbar-brand-dark col-4 col-md-3 fs-3 fw-bolder text-primary mb-3" href="/">AfriqLoan</Link>
        <ul className="d-flex flex-column gap-2 mb-auto">
            <User />
        </ul>
        <ul className="d-flex flex-column gap-2">
            <Info />
        </ul>
    </div>
  )
}
