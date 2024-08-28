"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <div id="sidebar" className="h-100 d-md-flex flex-column justify-content-start align-items-center fs-5 bg-light">
        <div id="navbar" className={`collapse navbar-collapse d-md-flex flex-column w-100 align-items-start p-4 p-md-0`}>
          <ul className="navbar-nav d-flex flex-column mb-auto align-self-stretch">
            <li className={`${pathname.includes('personal')?'active':''}`}><Link href="/settings/profile" className="link d-inline-flex align-items-start lh-1 fs-6">Profile</Link></li>
            <li className={`${pathname.includes('security')?'active':''}`}><Link href="/settings/financials" className="link d-inline-flex align-items-start lh-1 fs-6">Financials</Link></li>
            <li className={`${pathname.includes('security')?'active':''}`}><Link href="/settings/security" className="link d-inline-flex align-items-start lh-1 fs-6">Security</Link></li>
          </ul>
        </div>
    </div>
  )
}
