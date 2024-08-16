import Link from 'next/link'

export default async function Dashboard() {
  return (
    <div className="bg-primary h-100">
      <section id="services" className="d-flex flex-column p-5 gap-4">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <h4 className="text-white">Hello Welcome!</h4>
        </div>
        <div className="row gap-4 text-primary">
          <div className="col-12 col-md-5 d-flex flex-column rounded-4 justify-content-between bg-white p-5 gap-4">
            <h4>Co-working Mechant</h4>
            <div className="d-flex flex-row align-items-center">
              <div className="d-flex flex-column flex-xl-row me-auto gap-2">
                {/*<button className="btn btn-outline-primary rounded-pill fw-bold">Login</button>*/}
                <Link href="/register?asa=landlord" className="btn btn-primary border border-2 border-primary rounded-pill fw-bold">Register As Landlord</Link>
              </div>
              <span className="d-flex justify-content-center align-items-center p-2 rounded-circle" style={{backgroundColor: '#8AF0FF', width: '45px', height: '45px'}}>
                <i className="fa-solid fa-network-wired fa-fw fa-xl"></i>
              </span>
            </div>
          </div>
          <div className="col-12 col-md-5 d-flex flex-column rounded-4 justify-content-between bg-white p-5 gap-4">
            <h4>Loan Recovery</h4>
            <div className="d-flex flex-row align-items-center">
              <div className="d-flex flex-column flex-xl-row me-auto gap-2">
                <button className="btn btn-primary border border-2 border-primary rounded-pill fw-bold">Apply</button>
              </div>
              <span className="d-flex justify-content-center align-items-center p-2 rounded-circle" style={{backgroundColor: '#8AF0FF', width: '45px', height: '45px'}}>
                <i className="fa-solid fa-money-bill-transfer fa-fw fa-xl"></i>
              </span>
            </div>
          </div>
          <div className="col-12 col-md-5 d-flex flex-column rounded-4 justify-content-between bg-white p-5 gap-4">
            <h4>Loan</h4>
            <div className="d-flex flex-row align-items-center">
              <div className="d-flex flex-column flex-xl-row me-auto gap-2">
                {/*<button className="btn btn-outline-primary rounded-pill fw-bold">Login</button>*/}
                <button className="btn btn-primary border border-2 border-primary rounded-pill fw-bold">Apply</button>
              </div>
              <span className="d-flex justify-content-center align-items-center p-2 rounded-circle" style={{backgroundColor: '#8AF0FF', width: '45px', height: '45px'}}>
                <i className="fa-solid fa-hand-holding-dollar fa-fw fa-xl"></i>
              </span>
            </div>
          </div>
          <div className="col-12 col-md-5 d-flex flex-column rounded-4 justify-content-between bg-white p-5 gap-4">
            <h4>Savings/Joint Account</h4>
            <div className="d-flex flex-row align-items-center">
              <div className="d-flex flex-column flex-xl-row me-auto gap-2">
                {/*<button className="btn btn-outline-primary rounded-pill fw-bold">Login</button>*/}
                <Link href="/account/savings/create?type=personal" className="btn btn-primary border border-2 border-primary rounded-pill fw-bold">Create Account(s)</Link>
              </div>
              <span className="d-flex justify-content-center align-items-center p-2 rounded-circle" style={{backgroundColor: '#8AF0FF', width: '45px', height: '45px'}}>
                <i className="fa-solid fa-piggy-bank fa-fw fa-xl"></i>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
