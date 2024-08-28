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
    const query = searchParams

    if(!(query.hasOwnProperty("token")||query.hasOwnProperty("resendtoken"))){
        notFound()
    }

    return (
        <>
            <section id="form" className={`${styles.fh} d-flex justify-content-center mx-auto text-primary px-4`}>
                <div className={`container-md d-flex flex-column justify-content-center align-items-center bg-white rounded-4 p-5`} style={{maxWidth:"600px"}}>
                    <h4>Account Activation</h4>
                    {query?.token === "" &&
                        <>
                           <div className="d-flex p-2 align-items-center justify-content-center bg-danger-subtle rounded-2 w-100 mb-5">
                                <i className="fa-solid fa-circle-xmark me-2 text-danger"></i>
                                <span>Account Activation Failed</span>
                                <small>&nbsp;(Invalid or expired token)</small>
                            </div>
                            <div className="d-flex flex-row column-gap-3">
                                <Link href="/" className="btn btn-primary rounded-pill align-self-center shadow-sm"><i className="fa-solid fa-house me-2"></i>Go to home</Link>
                                <Link href="/account/activation?resendtoken=true" className="btn btn-outline-primary rounded-pill border border-2 border-primary shadow-sm" ><i className="fa-solid fa-link me-2"></i>Resend activation link</Link>
                            </div>
                        </>}
                        {query?.resendtoken &&
                            <>
                                <em>(Kindly supply your registered e-mail address)</em>
                                <form action={accountActivationInstruction} className="align-self-stretch d-flex flex-column row-gap-4">
                                    <input type="email" name="email" placeholder="E-mail Address" className="rounded-2" required/>
                                    <Submit><i className="fa-solid fa-link me-2"></i>Submit</Submit>
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
