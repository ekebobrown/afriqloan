import Link from "next/link";
import { notFound } from 'next/navigation'

import styles from "@/app/page.module.css";

import {CopyrightSocial} from "@/app/(main)/footer";
import { accountActivationInstruction } from "@/app/lib/actions";
import { Submit } from "@/app/components/buttons";

export const metadata = {
  title: "AfriqLoan - Email Activation"
};

export default async function Activation({searchParams}) {
    const {token, resendtoken} = await searchParams

    if(typeof resendtoken==='string' && resendtoken!=='true'){
        notFound()
    }

    return (
        <>
            <section id="form" className={`${styles.fh1} d-flex justify-content-center mx-auto text-primary px-4`}>
                <div className={`container-md d-flex flex-column justify-content-center align-items-center bg-white align-self-center rounded-4 p-5`} style={{maxWidth:"600px"}}>
                    <h4>Account Activation</h4>
                    {(typeof resendtoken!=="string" && (!token||token?.length >=0)) &&
                        <>
                           <div className="d-flex flex-column flex-md-row p-2 align-items-center justify-content-center bg-danger-subtle rounded-2 w-100 mb-5">
                                <div className="d-flex align-items-center">
                                    <i className="fa-solid fa-circle-xmark me-2 text-danger"></i>
                                    <span>Account Activation Failed</span>
                                </div>
                                <small>&nbsp;(Invalid or expired token)</small>
                            </div>
                            <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                                <Link href="/" className="btn btn-primary border border-2 border-primary rounded-pill shadow-sm px-4"><i className="fa-solid fa-house me-2"></i>Go to home</Link>
                                <Link href="/account/activation?resendtoken=true" className="btn btn-outline-primary rounded-pill border border-2 border-primary shadow-sm px-4" >Resend activation link</Link>
                            </div>
                        </>}
                        {!token && resendtoken &&
                            <>
                                <em className="text-center">(Kindly supply your registered e-mail address)</em>
                                <form action={accountActivationInstruction} className="align-self-stretch d-flex flex-column row-gap-4">
                                    <input type="email" name="email" placeholder="E-mail Address" className="rounded-2" required/>
                                    <Submit classNames="align-self-center px-5">Submit</Submit>
                                    <em className="text-danger text-center">{accountActivationInstruction?.message}</em>
                                </form>
                            </>
                        }
                </div>
            </section>
            <CopyrightSocial />
        </>
    )
}
