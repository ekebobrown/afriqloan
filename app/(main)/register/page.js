import styles from "@/app/page.module.css";

import { Registration } from '@/app/components/forms'
import {CopyrightSocial} from "@/app/(main)/footer";


export default function Register() {

  return (
    <>
        <section id="form" className={`d-flex justify-content-center p-4 mx-auto`}>
            <div className="container-sm d-flex flex-column align-items-center bg-white rounded-4 px-4 py-5 p-md-5 mt-5">
              <h2 className="text-primary">Welcome to AfriqLoan</h2>
              <h3 className="fs-5 text-primary mt-2 mb-5">New to Afriqloan? Create account to Get started </h3>
              <Registration />
            </div>
        </section>
        <CopyrightSocial />
    </>
  )
}
