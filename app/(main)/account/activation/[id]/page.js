import Link from "next/link";
import { redirect } from "next/navigation";

import styles from "@/app/page.module.css";

import {CopyrightSocial} from "@/app/(main)/footer";
import { emailActivation } from "@/app/lib/actions";

export const metadata = {
  title: "AfriqLoan - Activation"
};

export default async function Activation({params}) {
    const data = await fetch(`${process.env.SITE_URL}/api/account/activation/${params.id}`).then((response) => response.json())
    let message
    if(data.ok){
        message = data.message
        setTimeout(()=>{
            redirect("/login")
        }, 2000)
    }else{
        message = data.error
    }

    return (
        <>
            <section id="form" className={`${styles.fh} d-flex justify-content-center mx-auto text-primary p-lg`}>
                <div className={`container-md d-flex flex-column justify-content-center align-items-center bg-white rounded-5 p-5 row-gap-4`} style={{maxWidth:"600px"}}>
                    <h1 className="text-center fw-bold">Account Activation</h1>
                    {data &&
                        <>
                            <i className="fa-solid fa-person-falling-burst fa-2xl text-danger"></i>
                            <p className={`${data.error?'text-danger':'text-success'} text-center fst-italic`}>{message}</p>
                            <div className="d-flex flex-row column-gap-3">
                                <Link href="/" className="btn btn-primary rounded-pill align-self-center"><i className="fa-solid fa-house me-2"></i>Go to home</Link>
                                <Link href="/login" className="btn btn-outline-primary rounded-pill" ><i className="fa-solid fa-link me-2"></i>Resend link</Link>
                            </div>
                        </>
                    }
                </div>
            </section>
            <CopyrightSocial />
        </>
    )
}
