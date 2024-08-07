import Link from 'next/link'
import { cookies } from 'next/headers'

import Brand from '@/app/components/brand'
import { logout } from '@/app/lib/actions'

export function MainNav() {
    const session_token = cookies().get('session_token')?.value

    return (
        <nav className="navbar navbar-expand-md bg-primary sticky-top">
            <div className="container-md">
                <Brand />
                <button className="navbar-toggler border-2 border-white" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="fa-solid fa-bars text-white"></i>
                </button>
                <div className="collapse navbar-collapse pb-4 pb-md-0 justify-content-md-end" id="navbar">
                    <ul className="navbar-nav col-12 col-md-10 mb-2 justify-content-center align-items-md-center mb-lg-0">
                        <li className="nav-item px-2">
                            <Link className="nav-link active" aria-current="page" href="/aboutus">About Us</Link>
                        </li>
                        <li className="nav-item dropdown px-2">
                            <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Services
                            </Link>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" href="/loans/recovery">Debt Recovery</Link></li>
                                    <li><Link className="dropdown-item" href="/loans/collection">Loans</Link></li>
                                    <li><Link className="dropdown-item" href="/spaces/coworking">Working Space</Link></li>
                                </ul>
                        </li>
                        <li className="nav-item px-2 me-auto">
                            <Link className="nav-link" href="/faq">FAQ</Link>
                        </li>
                        {session_token?
                            <li className="nav-item dropdown">
                                <button className="btn btn-outline-secondary rounded-pill nav-link dropdown-toggle mb-4 mb-md-0 mx-md-3" data-bs-target=".dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    User Menu
                                </button>
                                <ul className="dropdown-menu w-100">
                                    <li><Link href="/dashboard" className="dropdown-item"><span className="fa-solid fa-chalkboard me-2"></span>Dashboard</Link></li>
                                    <li><form action={logout}><button type="submit" className="dropdown-item d-inline-flex align-items-center"><span className="fa-solid fa-gear me-2"></span>Logout</button></form></li>
                                </ul>
                            </li>:
                            <Link href="/login" className="btn btn-outline-secondary mb-4 mb-md-0 mx-md-3 rounded-pill" role="button">login</Link>
                            }
                        <Link href="/contact" className="btn btn-secondary rounded-pill" role="button">Contact Us</Link>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export function Services() {
    return (
        <>
            <li><Link href="/loans/recovery" className="link text-white">Loan Recovery</Link></li>
            <li><Link href="/spaces/coworking" className="link text-white">Co-working</Link></li>
            <li><Link href="/spaces/coliving" className="link text-white">Co-living</Link></li>
            <li><Link href="/accounts/jointsavings" className="link text-white">Joint Savings</Link></li>
        </>
    )
}

export function User() {
    return (
        <>
            <li><Link href="/dashboard" className="link d-inline-flex align-items-center"><span className="fa-solid fa-chalkboard me-2"></span>Dashboard</Link></li>
            <li><Link href="/dashboard/loan" className="link d-inline-flex align-items-center"><span className="fa-solid fa-receipt me-2"></span>Loan</Link></li>
            <li><Link href="/dashboard/account" className="link d-inline-flex align-items-center"><span className="fa-solid fa-circle-user me-2"></span>Account</Link></li>
            <li><Link href="/dashboard/inbox" className="link d-inline-flex align-items-center"><span className="fa-solid fa-envelope me-2"></span>Inbox</Link></li>
            <li><Link href="/dashboard/settings" className="link d-inline-flex align-items-center"><span className="fa-solid fa-gear me-2"></span>Setting</Link></li>
        </>
    )
}

export function Info() {
    return (
        <>
            <li><Link href="/dashboard/information" className="link d-inline-flex align-items-center"><span className="fa-solid fa-circle-info me-2"></span>Information</Link></li>
            <li><Link href="/dashboard/terms" className="link d-inline-flex align-items-center"><span className="fa-solid fa-shield-halved me-2"></span>Security Terms</Link></li>
            <li><span className="fa-solid fa-phone me-2"></span>+234-800-300-333</li>
        </>
    )
}