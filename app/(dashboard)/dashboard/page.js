import Link from 'next/link'
import { cookies } from 'next/headers'

import { ObjectId } from 'mongodb'

import { Token } from '@/app/components/cards'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Dashboard() {

  return (
    <div className="">
      <section id="services" className="d-flex flex-column bg-primary p-5 gap-4">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <h4 className="text-white">Hello Welcome</h4>
        </div>
        <div className="row gap-4">
          <div className="col-12 col-md-5 d-flex flex-column rounded-4 justify-content-evenly bg-white p-5 gap-5">
            <h4>Co-working & Living Mechant</h4>
            <div className="d-flex flex-row align-items-center">
              <div className="d-flex flex-column flex-md-row me-auto gap-2">
                <button className="btn btn-outline-primary rounded-pill fw-bold">Login</button>
                <Link href="/register?asa=landlord" className="btn btn-outline-primary rounded-pill fw-bold">Register</Link>
              </div>
              <span style={{display: 'inline-block', backgroundColor: '#8AF0FF', borderRadius: '50%', padding: '0.5em', width: '45px', height: '45px'}}>
                <i className="fa-solid fa-chalkboard-user fa-fw fa-xl text-primary"></i>
              </span>
            </div>
          </div>         
          <div className="col-12 col-md-5 d-flex flex-column rounded-4 justify-content-evenly bg-white p-5 gap-5">
            <h4>Loan Recovery</h4>
            <div className="d-flex flex-row align-items-center">
              <div className="d-flex flex-column flex-md-row me-auto gap-2">
                <button className="btn btn-outline-primary rounded-pill fw-bold">Apply</button>
              </div>
              <span style={{display: 'inline-block', backgroundColor: '#8AF0FF', borderRadius: '50%', padding: '0.5em', width: '45px', height: '45px'}}>
                <i className="fa-solid fa-chalkboard-user fa-fw fa-xl text-primary"></i>
              </span>
            </div>
          </div>
          <div className="col-12 col-md-5 d-flex flex-column rounded-4 justify-content-evenly bg-white p-5 gap-5">
            <h4>Loan</h4>
            <div className="d-flex flex-row align-items-center">
              <div className="d-flex flex-column flex-md-row me-auto gap-2">
                <button className="btn btn-outline-primary rounded-pill fw-bold">Login</button>
                <button className="btn btn-outline-primary rounded-pill fw-bold">Apply</button>
              </div>
              <span style={{display: 'inline-block', backgroundColor: '#8AF0FF', borderRadius: '50%', padding: '0.5em', width: '45px', height: '45px'}}>
                <i className="fa-solid fa-chalkboard-user fa-fw fa-xl text-primary"></i>
              </span>
            </div>
          </div>
          <div className="col-12 col-md-5 d-flex flex-column rounded-4 justify-content-evenly bg-white p-5 gap-5">
            <h4>Savings/Joint Account</h4>
            <div className="d-flex flex-row align-items-center">
              <div className="d-flex flex-column flex-md-row me-auto gap-2">
                <button className="btn btn-outline-primary rounded-pill fw-bold">Login</button>
                <button className="btn btn-outline-primary rounded-pill fw-bold">Create</button>
              </div>
              <span style={{display: 'inline-block', backgroundColor: '#8AF0FF', borderRadius: '50%', padding: '0.5em', width: '45px', height: '45px'}}>
                <i className="fa-solid fa-chalkboard-user fa-fw fa-xl text-primary"></i>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
