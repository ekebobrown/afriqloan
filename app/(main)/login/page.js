import Link from 'next/link';

import styles from "@/app/page.module.css";

import { LoginForm } from '@/app/components/forms'
import {CopyrightSocial} from "@/app/(main)/footer";
import { headers } from 'next/headers';

export default function Login() {

  return (
    <>
        <section id="form" className={`${styles.section} d-flex justify-content-center mx-auto text-primary`}>
            <div className={`container-md d-flex flex-column justify-content-around bg-white rounded-5 p-lg gap-5`}>
                <h1 className="text-center fw-bold">Welcome to AfriqLoan</h1>
                <div className="d-flex flex-column flex-md-row row-cols-1 row-cols-md-2">
                    <div className="border-right d-flex flex-column order-1 order-md-0 px-0 px-md-5 py-5 py-md-0 align-items-start">
                        <h3 className="fw-bold">Create Account</h3>
                        <p className="fs-4 text-primary mt-2 mb-5">New to Afriqloan? Create account to start applying for loans </p>
                        <Link href="/register" className="btn btn-primary rounded-pill" role="button">Create Account</Link>
                    </div>
                    <div className="d-flex flex-column px-0 px-md-5 order-0 order-md-1 border-bottom-sm gap-4">
                        <h2 className="text-primary">Login</h2>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </section>
        <CopyrightSocial />
    </>
  )
}
