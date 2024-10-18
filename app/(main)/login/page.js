import Link from 'next/link';

import styles from "@/app/page.module.css";

import { LoginForm } from '@/app/components/forms'
import {CopyrightSocial} from "@/app/(main)/footer";

export const metadata = {
  title: "AfriqLoan - Login"
};

export default async function Login({searchParams}) {
  const {activation, email, redirect} = await searchParams

  return (
    <>
        <section id="form" className={`${styles.fh1} d-flex justify-content-center mx-auto text-primary px-4`}>
          <div className={`container-md d-flex flex-column justify-content-around bg-white rounded-3 p-4 p-md-5 my-5 row-gap-3 align-self-center`} style={{maxWidth:"600px"}}>
            <div className="d-flex flex-column align-items-center">
              <h4 className="fw-bold text-center">Welcome to AfriqLoan</h4>
              <span>Login to continue</span>
            </div>
            <LoginForm email={email} redirect={redirect} />
            <small id="info" className="flex-fill text-center overflow-hidden fst-italic lh-1" style={{height:activation||redirect?'50px':'0px', transition:'height 0.5s ease-in-out'}}>
              {(activation||redirect) && <div className={`d-flex p-1 ${activation?'bg-success-subtle':'bg-warning-subtle'} rounded-2 justify-content-center align-items-center w-100`}><i className="fa-solid fa-circle-info me-2 p-1"></i>{activation?"Account successfully activated":"Invalid or expired session information"}</div>}
            </small>
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
