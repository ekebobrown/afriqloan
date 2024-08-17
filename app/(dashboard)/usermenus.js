"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function User() {
    const pathname = usePathname().split('/')
    const path = pathname[pathname.length-1]

    return (
        <>
            <li className={`${path==='dashboard'?'active':''}`}><Link href="/dashboard" className="link d-inline-flex align-items-center"><span className="fa-brands fa-microsoft fa-fw me-2"></span>Dashboard</Link></li>
            <li className={`${path==='loan'?'active':''}`}><Link href="/account/loan" className="link d-inline-flex align-items-center"><span className="fa-solid fa-landmark fa-fw me-2"></span>Loans</Link></li>
            <li className={`${path==='savings'?'active':''}`}><Link href="/account/savings" className="link d-inline-flex align-items-center"><span className="fa-solid fa-vault fa-fw me-2"></span>Savings</Link></li>
            <li className={`${path==='listings'?'active':''}`}><Link href="/listings" className="link d-inline-flex align-items-center"><span className="fa-solid fa-elevator fa-fw me-2"></span>Listings</Link></li>
            <li className={`${path==='inbox'?'active':''}`}><Link href="/account/inbox" className="link d-inline-flex align-items-center"><span className="fa-solid fa-envelope fa-fw me-2"></span>Inbox</Link></li>
        </>
    )
}

export function Info() {
    const pathname = usePathname().split('/')
    const path = pathname[pathname.length-1]

    return (
        <>
            <li className={`${path==='settings'?'active':''}`}><Link href="/dashboard/settings" className="link d-inline-flex align-items-center"><span className="fa-solid fa-gear fa-fw me-2"></span>Setting</Link></li>
            <li className={`${path==='information'?'active':''}`}><Link href="/dashboard/information" className="link d-inline-flex align-items-center"><span className="fa-solid fa-circle-info fa-fw me-2"></span>Information</Link></li>
            <li className={`${path==='terms'?'active':''}`}><Link href="/dashboard/terms" className="link d-inline-flex align-items-center"><span className="fa-solid fa-shield-halved fa-fw me-2"></span>Security Terms</Link></li>
            <li className={`${path==='#'?'active':''}`}><span className="fa-solid fa-phone fa-fw me-2"></span>+234-800-300-333</li>
        </>
    )
}