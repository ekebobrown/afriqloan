import Link from 'next/link'

import Brand from '@/app/components/brand'
import Auth, { logout } from '@/app/lib/auth'

export async function Main() {
    const { data, isAuthenticated } = await Auth()

    return (
        <nav className="navbar navbar-expand-md bg-primary">
            <div className="container-md gap-3">
                <Brand />
                <div className="order-1 order-md-2 d-flex align-items-center gap-3">
                    <button className="order-1 navbar-toggler border-2 border-white" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fa-solid fa-bars text-white"></i>
                    </button>
                    {isAuthenticated && data.type!=="merchant" && <div className="position-relative"><i className="order-0 fa-solid fa-cart-shopping fa-2x text-white"></i><div className="d-flex justify-content-center align-items-center bg-warning rounded-circle position-absolute top-0 start-100 translate-middle" style={{width:'20px', height:'20px'}}>1</div></div>}
                </div>
                <div className="order-2 order-md-1 collapse navbar-collapse pb-4 pb-md-0 justify-content-md-end" id="navbar">
                    <ul className="navbar-nav col-12 col-md-10 mb-2 justify-content-center align-items-md-center mb-lg-0">
                        <li className="nav-item px-2">
                            <Link className="nav-link" href="/aboutus">About Us</Link>
                        </li>
                        <li className="nav-item dropdown px-2">
                            <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Services
                            </Link>
                                <ul className="dropdown-menu bg-primary p-3 gap-2">
                                    <Services />
                                </ul>
                        </li>
                        <li className="nav-item px-2 me-auto">
                            <Link className="nav-link" href="/faq">FAQ</Link>
                        </li>
                        {isAuthenticated?
                            <li className="nav-item dropdown d-flex">
                                <button className="flex-fill btn btn-outline-secondary rounded-pill nav-link dropdown-toggle px-4 my-4 my-md-0 mx-md-3" data-bs-target=".dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    {data.names?.split(' ')[0]}
                                </button>
                                <ul className="dropdown-menu w-100">
                                    <li><Link href="/dashboard" className="dropdown-item"><span className="fa-solid fa-chalkboard me-2"></span>Dashboard</Link></li>
                                    <li><form action={logout}><button type="submit" className="dropdown-item d-inline-flex align-items-center"><span className="fa-solid fa-gear me-2"></span>Logout</button></form></li>
                                </ul>
                            </li>:
                            <Link href="/login" className="btn btn-outline-secondary px-5 mb-4 mb-md-0 mx-md-3 rounded-pill" role="button">login</Link>
                            }
                        <Link href="/contact" className="btn btn-secondary rounded-pill px-5" role="button">Contact Us</Link>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export function Services() {
    return (
        <>
            <li><Link href="/services/loanrecovery" className="link text-white">Loan Recovery</Link></li>
            <li><Link href="/services/listings/coworking" className="link text-white">Co-working</Link></li>
            <li><Link href="/services/savings" className="link text-white">Joint Savings</Link></li>
        </>
    )
}