import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import space from "@/public/office-space.png"
import Footers from "@/app/(main)/footer";

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import styles from "@/app/page.module.css";

export default function SpaceLayout({children, params}) {
    const fallback =
        <div className="container-md row row-cols-1 row-cols-md-3 align-self-center">
            <div className="d-flex flex-column rounded-4">
                <Skeleton height={350} style={{borderTopLeftRadius: "15px", borderTopRightRadius: "15px"}}/>
                <div className="d-flex flex-column gap-4 bg-tertiary p-3 rounded-bottom-4">
                    <h3 className="fw-bold"><Skeleton /></h3>
                    <p><Skeleton count={4} /></p>
                    <h5><Skeleton /></h5>
                    <div className="d-flex flex-column flex-md-row justify-content-between">
                        <button className="px-5 py-3 border-0 rounded-pill mb-2"><Skeleton /></button>
                        <button className="px-5 py-3 border-0 rounded-pill mb-2"><Skeleton /></button>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column rounded-4">
                <Skeleton height={350} style={{borderTopLeftRadius: "15px", borderTopRightRadius: "15px"}}/>
                <div className="d-flex flex-column gap-4 bg-tertiary p-3 rounded-bottom-4">
                    <h3 className="fw-bold"><Skeleton /></h3>
                    <p><Skeleton count={4} /></p>
                    <h5><Skeleton /></h5>
                    <div className="d-flex flex-column flex-md-row justify-content-between">
                        <button className="px-5 py-3 border-0 rounded-pill mb-2"><Skeleton /></button>
                        <button className="px-5 py-3 border-0 rounded-pill mb-2"><Skeleton /></button>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column rounded-4">
                <Skeleton height={350} style={{borderTopLeftRadius: "15px", borderTopRightRadius: "15px"}}/>
                <div className="d-flex flex-column gap-4 bg-tertiary p-3 rounded-bottom-4">
                    <h3 className="fw-bold"><Skeleton /></h3>
                    <p><Skeleton count={4} /></p>
                    <h5><Skeleton /></h5>
                    <div className="d-flex flex-column flex-md-row justify-content-between">
                        <button className="px-5 py-3 border-0 rounded-pill mb-2"><Skeleton /></button>
                        <button className="px-5 py-3 border-0 rounded-pill mb-2"><Skeleton /></button>
                    </div>
                </div>
            </div>
        </div>

  return (
    <main>
        <section id="hero" className={`d-flex bg-primary mt-5 mt-md-0`} style={{minHeight:"600px"}}>
            <div className="container-md flex-fill d-flex flex-column flex-md-row row-cols-1 row-cols-md-2">
                <div className="col d-flex flex-column text-white align-items-start justify-content-center pe-0 pe-md-4 py-5 py-md-0 gap-4">
                    <h1 className="display-3 fw-semibold lh-1">Co-working <span className="d-inline-flex flex-column text-secondary">Services<Image src="/assets/underline.png" width={150} height={20} alt="underline"/></span></h1>
                    <p className="fs-5">Our loan services offer a hassle-free and streamlined borrowing experience, providing you with the funds you need in a timely manner to meet your financial requirements.</p>
                    <select className="fs-4 pe-5">
                    <option className="fw-bold">Select preferred location</option>
                    <option>Akwa Ibom</option>
                    </select>
                </div>
            <div className="d-flex align-items-center mt-md-5">
                <Image
                    src={space}
                    alt="space"
                    sizes="100vw"
                    style={{
                        width: '100%',
                        height: '75%',
                        objectFit: 'cover',
                        borderRadius: '20px'
                    }}
                />
            </div>
            </div>
        </section>
        <section className={`${styles.section} bg-white`}>
            <div className="container-md d-flex flex-column gap-4">
                <div className="d-flex border border-2 bg-tertiary border-primary rounded-pill justify-content-between row-cols-2 p-1">
                    <Link href="/spaces/coworking" scroll={false} className={`${params.space==='coworking'?'bg-primary rounded-pill text-white fw-semibold shadow':''} btn fs-3 fw-bold`}>Co-working</Link>
                    <Link href="/spaces/officespace" scroll={false} className={`${params.space==='officespace'?'bg-primary rounded-pill text-white fw-semibold shadow':''} btn fs-3 fw-bold`}>Office Space</Link>
                </div>
                <h3>Hot desk for the day, or reserve a dedicated desk pace across thousand of location</h3>
                <Suspense fallback={fallback}>
                    {children}
                </Suspense>
            </div>
        </section>
        <Footers />
    </main>
  );
}
