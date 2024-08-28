import Link from 'next/link';

import styles from "@/app/page.module.css";

import { LoginForm } from '@/app/components/forms'
import {CopyrightSocial} from "@/app/(main)/footer";

export const metadata = {
  title: "AfriqLoan - Login"
};

export default function Login({searchParams}) {
  const {activation, email, redirect} = searchParams

  return (
    <>
        <section id="form" className={`${styles.fh1} d-flex justify-content-center mx-auto text-primary px-4`}>
          <div className={`container-md d-flex flex-column justify-content-around bg-white rounded-3 p-4 p-md-5 my-5 row-gap-3 align-self-center`} style={{maxWidth:"600px"}}>
            <div className="d-flex flex-column align-items-center">
              <h4 className="fw-bold text-center">Welcome to AfriqLoan</h4>
              {(activation||redirect) && <div className={`d-flex p-2 ${activation?'bg-success-subtle':'bg-warning-subtle'} rounded-2 justify-content-center align-items-center w-100`}><i className="fa-solid fa-circle-info me-2"></i>{activation?"Account Successfully Activated":"Session Expired"}</div>}
              <span>Login to continue</span>
            </div>
            <LoginForm email={email} redirect={redirect} />
            {!activation &&
              <div className="d-flex flex-column flex-md-row justify-content-between">
                <Link href={`/account/password?reset=request${email?`&email=${email}`:''}`} className="link">Forgot Password?</Link>
                <Link href="/register" className="link align-self-end">Don&apos;t Have Account?</Link>
              </div>
            }
          </div>
        </section>
        <CopyrightSocial />
    </>
  )
}
