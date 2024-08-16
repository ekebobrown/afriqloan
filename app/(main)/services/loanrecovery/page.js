import Image from "next/image";
import Link from "next/link";

import styles from "@/app/page.module.css";

import { LoanRecovery } from "@/app/components/forms";
import Footer from "@/app/(main)/footer";

export default function Recovery() {
  return (
    <>
      <main>
        <section id="hero" className={`d-flex bg-primary mt-5 mt-md-0`} style={{minHeight:"600px"}}>
          <div className="container-md flex-fill d-flex flex-column flex-md-row row-cols-1 row-cols-md-2">
            <div className="col d-flex flex-column text-white align-items-start justify-content-center pe-0 pe-md-4 py-5 py-md-0">
              <h1 className="display-3 fw-semibold lh-1">Easy Way To Your <span className="d-inline-flex flex-column text-secondary">Loan<Image src="/assets/underline.png" width={150} height={20} alt="underline"/></span> Recovery.</h1>
            </div>
            <div className="col flex-fill" style={{backgroundImage:"url('/hero-image-1.png')", backgroundPosition:"bottom left", backgroundSize:"115%", backgroundRepeat:"no-repeat"}}>
            </div>
          </div>
        </section>
        <section className={`${styles.section} bg-white`}>
            <div className="container-md d-flex flex-column flex-md-row">
                <div className="d-flex flex-column col-12 col-md-5 pe-md-5">
                    <h2 className="fw-bold">We Would Like To Hear from You</h2>
                    <p className="fs-5">Please complete the form to get in touch with us. You are assured of a swift response from us.</p>
                    <ul className="fa-ul fs-5">
                        <li><span className="fa-li"><span className="fa-solid fa-square-phone"></span></span>+234 810 607 9172</li>
                        <li><span className="fa-li"><span className="fa-solid fa-at"></span></span>info@afriqloan.com</li>
                        <li><span className="fa-li"><span className="fa-brands fa-square-whatsapp"></span></span>Chat with Nora on Whatsapp</li>
                    </ul>
                </div>
                <div className="bg-light p-5 rounded-5 col-12 col-md-7">
                    <LoanRecovery />
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
