import Image from "next/image";
import Link from "next/link";

import styles from "@/app/page.module.css";

import { ServiceCard, Testimonial } from "@/app/components/cards";
import { Newsletter } from "@/app/components/forms";
import Clients from "@/app/components/clients";
import Footer from "@/app/(main)/footer";

export default function Home() {
  return (
    <>
      <main>
        <section id="hero" className={`${styles.hero} bg-primary mt-5 mt-md-0`}>
          <div className="container-md flex-fill d-flex flex-column flex-md-row row-cols-1 row-cols-md-2">
            <div className="col d-flex flex-column text-white align-items-start justify-content-center pe-0 pe-md-4 py-5 py-md-0">
              <h1 className="display-3 fw-semibold lh-1">Quick And Easy <span className="d-inline-flex flex-column text-secondary">Loans<Image src="/assets/underline.png" width={150} height={20} alt="underline"/></span> For Your Financial Needs.</h1>
              <p className="fs-5">Our loan services offer a hassle-free and streamlined borrowing experience, providing you with the funds you need in a timely manner to meet your financial requirements.</p>
              <Link href="register" className="btn btn-secondary rounded-pill fs-4" role="button">Get Started</Link>
            </div>
            <div className="col flex-fill" style={{backgroundImage:"url('/hero-image-3.png')", backgroundPosition:"bottom center", backgroundSize:"115%", backgroundRepeat:"no-repeat"}}>
            </div>
          </div>
        </section>
        <section id="services-card" className={`${styles.section} bg-white`}>
          <div className="container-md d-flex flex-column flex-md-row row-cols-1 row-cols-md-3 justify-content-around gap-4">
            <ServiceCard image="/icons/loan-recovery.png" title="Loan Recovery" layout={1}>
              <p>
                Our team of expert adopt an ethical approach in our  collection strategy and ensure we surpass our expected result while maintaining the requirement of applicable regulation
              </p>
            </ServiceCard>
            <ServiceCard image="/icons/joint-savings.png" title="Joint Savings" layout={1}>
              <p>
                Couples can synchronise their budgets and expenditure to achieve financial chemistry 
              </p>
            </ServiceCard>
            <ServiceCard image="/icons/co-working-living.png" title="Co-working & Co-living" layout={1}>
              <p>
                Drop in and hot-desk in an open-plan workspace, or reserve your own dedicated desk in a shared office.
              </p>
            </ServiceCard>
          </div>
        </section>
        <section id="clients" className={`${styles.section} bg-tertiary`}>
          <div className={`container-md d-flex`}>
            <Clients />
          </div>
        </section>
        <section id="services" className={`${styles.section} bg-white`}>
          <div className="container-md">
            <h1 className="display-4 text-primary mt-5">Our Services</h1>
            <div className="service d-flex flex-column flex-md-row mb-5">
              <div className="d-flex flex-column bg-tertiary justify-content-center align-items-start col-12 col-md-6 p-3 p-md-5" style={{minHeight:"450px"}}>
                <h2>Debt Recovery</h2>
                <p className="fs-5 pe-md-4">When we handle your debt recovery, we integrate into your business to create effective, ethical strategies, delivering tangible and timely results.</p>
                <Link href="/loans/recovery" className="btn btn-primary rounded-pill" role="button">Let&apos;s Help You</Link>
              </div>
              <div className="col-12 col-md-6" style={{backgroundImage:"url('/loan-recovery.png')", backgroundPosition:"center", backgroundRepeat:"no-repeat", backgroundSize:"100%"}}>
              </div>
            </div>
            <div className="service d-flex flex-column flex-md-row my-5">
              <div className="d-flex flex-column bg-tertiary justify-content-center align-items-start col-12 col-md-6 p-3 p-md-5" style={{minHeight:"450px"}}>
                <h3><strong>Joint Savings</strong> (Contribution)</h3>
                <p className="fs-5 pe-md-4">Take your partnership to the next level and manage a united financial vision with one account that’s twice as nice.</p>
                <Link href="/account" className="btn btn-primary rounded-pill">Open Joint Account</Link>
              </div>
              <div className="col-12 col-md-6" style={{backgroundImage:"url('/joint-savings-1.png')", backgroundPosition:"center", backgroundRepeat:"no-repeat", backgroundSize:"100%"}}>
              &nbsp;
              </div>
            </div>
            <div className="service d-flex flex-column flex-md-row my-5">
              <div className="d-flex flex-column bg-tertiary justify-content-center align-items-start col-12 col-md-6 p-3 p-md-5" style={{minHeight:"450px"}}>
                <h3>Co-working & Co-living</h3>
                <p className="fs-5 pe-md-4">Work along like-minded professionals in our vibrant coworking spaces in Lagos, with break out areas and networking events to foster collaboration and growth.</p>
                <div className="d-flex flex-column flex-md-row">
                  <Link href="/register" className="btn btn-primary rounded-pill me-3 mb-3" role="button">Register As Landlord</Link>
                  <Link href="/spaces/coworking" className="btn btn-outline-primary rounded-pill mb-3" role="button">Explore</Link>
                </div>
              </div>
              <div className="col-12 col-md-6" style={{backgroundImage:"url('/office-space.png')", backgroundPosition:"center", backgroundRepeat:"no-repeat", backgroundSize:"100%"}}>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className={`${styles.section} bg-light bg-gradient`}>
          <div className="container-md">
            <div className="d-flex flex-column flex-md-row align-items-center py-5">
              <h1 className="col-12 col-md-6 text-primary pe-md-5">
                Hear! What Our Customers Have To Say
              </h1>
              <div className="d-flex flex-column col-12 col-md-6 align-items-start ps-md-5">
                <p>Echoes of satisfaction: Delivering into the story of Afriqloan’s satisfied customers; each testimonial is a testament</p>
                <button className="btn btn-primary rounded-pill">See More Reviews</button>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row row-cols-3 gap-4">
              <div className="d-flex flex-column col-12 col-md-4">
                <Testimonial layout={1} author="John Doe">
                  <p>Echoes of satisfaction: Delivering into the story of Afriqloan’s satisfied customers; each testimonial is a testament</p>
                </Testimonial>
              </div>
              <div className="d-flex flex-column col-12 col-md-4">
                <Testimonial layout={2} author="John Doe">
                  <p>Echoes of satisfaction: Delivering into the story of Afriqloan’s satisfied customers; each testimonial is a testament</p>
                </Testimonial>
                <Testimonial layout={2} author="John Doe">
                  <p>Echoes of satisfaction: Delivering into the story of Afriqloan’s satisfied customers; each testimonial is a testament</p>
                </Testimonial>
              </div>
              <div className="d-flex flex-column col-12 col-md-4">
                <Testimonial layout={1} author="John Doe">
                  <p>Echoes of satisfaction: Delivering into the story of Afriqloan’s satisfied customers; each testimonial is a testament</p>
                </Testimonial>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className={`${styles.section} bg-tertiary`}>
          <div className="container-md d-flex flex-column flex-md-row">
            <div className="d-flex flex-column col-12 col-md-7 mb-5 mb-md-0">
              <h1 className="mb-4 text-primary">Who We Are</h1>
              <Image
                src="/assets/who-we-are.png"
                width={350}
                height={350}
                alt="Who We Are"
              />
              <p className="mt-4 w-75">Afriqloan- Your trusted financial partner for loans. Quick approvals, competitive rates, and personalized solutions to meet your unique needs. Empowering you to achieve your financial goals. Apply online today!</p>
            </div>
            <div className="d-flex flex-column col-12 col-md-5 justify-content-center">
              <h3 className="mb-4 text-primary fw-semibold text-center">Sign Up For Our Newsletter</h3>
              <Newsletter />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
