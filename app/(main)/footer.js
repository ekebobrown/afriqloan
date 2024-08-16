import Link from 'next/link'

import Brand from '@/app/components/brand'
import { Services } from '@/app/(main)/sitemenus'

export function Footer() {
  return (
    <footer className="py-5 text-white">
      <div className="container-md d-flex flex-column flex-md-row py-5 px-4">
        <div className="col-12 col-md-6 mb-5 mb-md-0 pe-md-5">
          <div className="d-flex flex-column pe-md-5">
            <Brand />
            <p className="fs-5 fw-normal pe-md-5">Our mission is to empower individuals and businesses by providing them with the financial resources they need to achieve their goals.</p>
            <div className="d-flex flex-row">
              <i className="fa-brands fa-facebook fs-4 me-3"></i>
              <i className="fa-brands fa-whatsapp fs-4 me-3"></i>
              <i className="fa-brands fa-linkedin fs-4 me-3"></i>
              <i className="fa-brands fa-instagram fs-4"></i>
            </div>
          </div>
       </div>
       <div className="col-12 col-md-3 mb-5 mb-md-0">
          <div className="d-flex flex-column">
            <h3>Our Services</h3>
            <hr className="w-25 mt-0 opacity-100" style={{border:"2px solid"}}/>
            <ul className="d-flex flex-column fs-5 ps-0" style={{listStyleType:"none"}}>
              <Services />
            </ul>
          </div>
       </div>
       <div className="col-12 col-md-3">
          <div className="d-flex flex-column">
            <h3>Contact Us</h3>
            <hr className="w-25 mt-0 opacity-100" style={{border:"2px solid"}}/>
            <div className="d-flex flex-column fs-5 ps-0 fw-light">
              <div className="d-flex flex-row align-items-start mb-2"><li className="fa-solid fa-phone-volume me-3 py-2"></li>+234-801-234-5678</div>
              <div className="d-flex flex-row align-items-start mb-2"><li className="fa-solid fa-envelope me-3 py-2"></li>info@afriqloan.com</div>
              <div className="d-flex flex-row align-items-start"><li className="fa-solid fa-location-dot me-3 py-2"></li>Address line-1<br />Address line-2,<br />city, state-pin code.</div>
            </div>
          </div>
       </div>
      </div>
    </footer>
  )
}

export function Copyright() {
  return (
    <div className="border-1 border-top py-5 text-white text-center fs-5">
        <p className="mb-0">Copyright &copy; 2024 AfriLoan. All Rights Reserved</p>
    </div>
  )
}

export function CopyrightSocial() {
  return (
    <div className="border-1 border-top py-5 text-white text-center fs-5">
      <div className="container-md d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="d-flex flex-column">
          <Brand />
          <div className="d-flex flex-row">
            <Link href="#" className="link-primary text-white"><i className="fa-brands fa-facebook fs-4 me-3"></i></Link>
            <Link href="#" className="link-primary text-white"><i className="fa-brands fa-whatsapp fs-4 me-3"></i></Link>
            <Link href="#" className="link-primary text-white"><i className="fa-brands fa-linkedin fs-4 me-3"></i></Link>
            <Link href="#" className="link-primary text-white"><i className="fa-brands fa-instagram fs-4"></i></Link>
          </div>
        </div>
        <p className="mb-0">Copyright &copy; 2024 AfriLoan. All Rights Reserved</p>
      </div>
    </div>
  )
}

export default function Footers() {
  return (
    <>
      <Footer />
      <Copyright />
    </>
  )
}
