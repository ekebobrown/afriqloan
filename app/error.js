"use client"
import Link from "next/link"

import Brand from "@/app/components/brand"
import { Services } from "@/app/(main)/navigations"
import { CopyrightSocial } from "@/app/(main)/footer"
import styles from "@/app/page.module.css"

export default function Error({error, reset}) {
  return (
   <>
      <Navigation />
      <section className={`bg-tertiary p-5 ${styles.fh1}`}>
          <div className="container-md">
              <h5>An error occured</h5>
              <p className="text-danger">(See the browser console for more information)</p>
              <button className="btn btn-primary rounded-pill px-4" onClick={reset}>Retry</button>
          </div>
      </section>
      <CopyrightSocial />
    </>
  )
}

export function Navigation() {
  return (
      <nav className="navbar navbar-expand-md bg-primary">
          <div className="container-md">
              <Brand />
              <button className="navbar-toggler border-2 border-white" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                  <i className="fa-solid fa-bars text-white"></i>
              </button>
              <div className="collapse navbar-collapse pb-4 pb-md-0 justify-content-md-end" id="navbar">
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
                      <Link href="/contact" className="btn btn-secondary rounded-pill px-5" role="button">Contact Us</Link>
                  </ul>
              </div>
          </div>
      </nav>
  )
}
