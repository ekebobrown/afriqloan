import { Registration } from '@/app/components/forms'
import {CopyrightSocial} from "@/app/(main)/footer";

export const metadata = {
  title: "AfriqLoan - Register"
};

export default function Register() {
  return (
    <>
        <section id="form" className={`d-flex justify-content-center p-4 mx-auto px-4`}>
            <div className="container-xsm d-flex flex-column align-items-center bg-white rounded-3 p-4 p-md-5 my-5" style={{transition:'all 2s ease-in-out'}}>
              <h2 className="text-primary mb-0">Welcome to AfriqLoan</h2>
              <h4 className="fs-5 text-primary mt-2 mb-4 text-center fw-normal">New to Afriqloan? Create account to Get started </h4>
              <Registration />
            </div>
        </section>
        <CopyrightSocial />
    </>
  )
}
