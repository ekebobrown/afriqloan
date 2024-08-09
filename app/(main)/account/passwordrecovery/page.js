import styles from "@/app/page.module.css";

import { PasswordRecovery } from '@/app/components/forms'
import {CopyrightSocial} from "@/app/(main)/footer";

export const metadata = {
  title: "AfriqLoan - Password Recovery"
};

export default async function Recover() {
  return (
    <>
        <section id="form" className={`${styles.fh} d-flex justify-content-center mx-auto text-primary p-lg`}>
            <div className={`container-md d-flex flex-column justify-content-around bg-white rounded-5 p-5 row-gap-3`} style={{maxWidth:"600px"}}>
                <h1 className="text-center fw-bold">Password Recovery</h1>
                <PasswordRecovery />
            </div>
        </section>
        <CopyrightSocial />
    </>
  )
}
