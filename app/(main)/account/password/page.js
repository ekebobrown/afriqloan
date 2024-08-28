import { notFound } from 'next/navigation'
import Link from 'next/link';

import styles from "@/app/page.module.css";

import { PasswordResetRequest, PasswordReset } from '@/app/components/forms'
import {CopyrightSocial} from "@/app/(main)/footer";
import Connection from "@/app/lib/db"

export const metadata = {
  title: "AfriqLoan - Password Reset"
};

export default async function ResetPassword({searchParams}) {
  const {reset, email, token} = searchParams

  if(Object.keys(searchParams).length === 0 || (Object.keys(searchParams).length === 1 && reset!=='request')){
      notFound()
  }

  if(Object.hasOwn(searchParams, "token")){
    const reset = await Connection("afriqloan", "password_resets")
                          .then((resets)=>resets.findOne({email:email, token:token}))
    if(!reset){
      return (
        <>
          <section id="form" className={`${styles.fh1} d-flex justify-content-center mx-auto text-primary px-4`}>
            <div className={`container-md d-flex flex-column justify-content-around bg-white rounded-3 p-4 p-md-5 my-5 row-gap-3 align-self-center`} style={{maxWidth:"600px"}}>
              <div className="d-flex flex-column align-items-center">
                <h4 className="fw-bold text-center">Reset Password</h4>
                <p className="text-danger text-center">You have followed an invalid or expired link. Kindly retry the reset process if you may or go back to homepage.</p>
                <div className="d-flex gap-2 justify-content-center">
                  <Link href="/" replace={true} className="btn btn-primary rounded-pill px-5 border border-2 border-primary">Home</Link>
                  <Link href="/account/password?reset=request" replace={true} className="btn btn-primary rounded-pill px-5 border border-2 border-primary">Retry</Link>
                </div>
              </div>
            </div>
          </section>
          <CopyrightSocial />
        </>
      )
    }
  }

  return (
    <>
        <section id="form" className={`${styles.fh1} d-flex justify-content-center mx-auto text-primary px-4`}>
            <div className={`container-md d-flex flex-column justify-content-around bg-white rounded-3 p-4 p-md-5 my-5 row-gap-3 align-self-center`} style={{maxWidth:"600px"}}>
                <h4 className="fw-bold text-center">Reset Password</h4>
                {reset==="request" &&
                  <>
                    <span className="text-center">Input registered e-mail to continue</span>
                    <PasswordResetRequest email={searchParams?.email} />
                  </>
                }
                {reset==="true" && <PasswordReset email={email} token={token} />}
            </div>
        </section>
        <CopyrightSocial />
    </>
  )
}
