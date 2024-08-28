import { Registration } from '@/app/components/forms'
import {CopyrightSocial} from "@/app/(main)/footer";

export const metadata = {
  title: "AfriqLoan - Register"
};

export default function Register() {
  return (
    <>
        <section id="form" className={`d-flex justify-content-center p-4 mx-auto px-4`}>
            <div className="container-sm d-flex flex-column align-items-center bg-white rounded-4 p-4 p-md-5 my-5" style={{transition:'all 2s ease-in-out'}}>
              <h2 className="text-primary">Welcome to AfriqLoan</h2>
              <h3 className="fs-5 text-primary mt-2 mb-5 text-center">New to Afriqloan? Create account to Get started </h3>
              <Registration />
            </div>
        </section>
        <CopyrightSocial />
    </>
  )
}
