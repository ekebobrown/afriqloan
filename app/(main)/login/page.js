import Link from 'next/link';
import { headers } from 'next/headers';

import styles from "@/app/page.module.css";

import { LoginForm } from '@/app/components/forms'
import {CopyrightSocial} from "@/app/(main)/footer";

export const metadata = {
  title: "AfriqLoan - Login"
};

export default function Login() {
  const activation = headers().get("x-account-activation")
  return (
    <>
        <section id="form" className={`${styles.section} d-flex justify-content-center mx-auto text-primary`}>
            <div className={`container-md d-flex flex-column justify-content-around bg-white rounded-5 p-5 row-gap-3`} style={{maxWidth:"600px"}}>
                <div className="d-flex flex-column align-items-center">
                  <h1 className="fw-bold">{activation?'Account successfully activated':'Welcome to AfriqLoan'}</h1>
                  <em>Login to continue</em>
                </div>
                <LoginForm />
                {!activation &&
                  <div className="d-flex justify-content-between">
                    <Link href="/recoverpassword" className="link">Forgot Password?</Link>
                    <Link href="/register" className="link">Don&apos;t Have Account?</Link>
                  </div>
                }
                <em id="alert" className="text-center"></em>
            </div>
        </section>
        <CopyrightSocial />
    </>
  )
}
