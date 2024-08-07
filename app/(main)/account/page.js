import Image from "next/image";
import Link from "next/link";

import styles from "@/app/page.module.css";

import { AccountOpening } from "@/app/components/forms";
import Footer from "@/app/(main)/footer";

export default function Recovery() {
  return (
    <>
      <main>
        <section id="hero" className={`d-flex bg-primary mt-5 mt-md-0`} style={{minHeight:"600px"}}>
          <div className="container-md flex-fill d-flex flex-column flex-md-row row-cols-1 row-cols-md-2">
            <div className="col d-flex flex-column text-white align-items-start justify-content-center pe-0 pe-md-4 py-5 py-md-0">
              <h1 className="display-3 fw-semibold lh-1">Grow Stronger Together With <span className="d-inline-flex flex-column text-secondary">Joint<Image src="/assets/underline.png" width={150} height={20} alt="underline"/></span> Account.</h1>
            </div>
            <div className="col flex-fill" style={{backgroundImage:"url('/joint-savings.png')", backgroundPosition:"bottom left", backgroundSize:"115%", backgroundRepeat:"no-repeat"}}>
            </div>
          </div>
        </section>
        <section className={`${styles.section} bg-white`}>
            <div className="container-md d-flex flex-column flex-md-row">
                <div className="d-flex flex-column col-5 pe-md-5">
                    <h2 className="fw-bold">How To Create A Joint Account</h2>
                    <p className="fs-4">Please fill out the form to open your account with AfriqLoan.</p>
                    <ul className="d-flex flex-column fa-ul fs-4 row-gap-3">
                        <li><span className="fa-li"><span className="fa-solid fa-square-phone"></span></span>+234 810 607 9172</li>
                        <li><span className="fa-li"><span className="fa-solid fa-at"></span></span>info@afriqloan.com</li>
                        <li><span className="fa-li"><span className="fa-brands fa-square-whatsapp"></span></span>Chat with Nora on Whatsapp</li>
                    </ul>
                </div>
                <div className="bg-light p-5 rounded-5 col-7">
                    <AccountOpening />
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
