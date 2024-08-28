"use client"
import Skeleton from "react-loading-skeleton"

import { TestimonialsFallbackCard } from "./cards"

export function FinancialsFallback() {
    return (
        <section className="d-flex flex-column bg-primary px-3 py-4 p-md-5 gap-4">
            <div>
                <Skeleton width={200} height={20} className="bg-body rounded-pill mb-2"/>
                <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                    <Skeleton style={{minWidth:"200px"}} height={50} className="bg-body rounded-pill"/>
                    <Skeleton style={{minWidth:"200px"}} height={50} className="bg-body rounded-pill" />
                    <Skeleton style={{minWidth:"200px"}} height={50} className="bg-body rounded-pill" />
                </div>
            </div>
            <div className="d-flex flex-column flex-md-row row-gap-3 text-primary">
                {[1,2,3].map((card)=>(
                    <div key={card} className="flex-fill col-12 col-md-4 d-flex flex-column gap-3 justify-content-center align-items-center p-4 rounded-4 bg-light border border-4 border-primary shadow-sm">
                        <Skeleton width={180} className="fs-5 rounded-pill"/>
                        <Skeleton width={120} className="fs-3 rounded-pill"/>
                        <Skeleton width={250} className="fs-3 rounded-pill"/>
                    </div>
                ))}
            </div>
        </section>
  )
}

export function TestimonialsFallback() {
    return (
        <div className="d-flex flex-column">
            <div className="d-flex flex-column flex-md-row gap-4">
                <div className="d-flex flex-column col-12 col-md-4">
                    <TestimonialsFallbackCard layout={1} />
                </div>
                <div className="d-flex flex-column col-12 col-md-4">
                    <TestimonialsFallbackCard layout={2} />
                    <TestimonialsFallbackCard layout={2} />
                </div>
                <div className="d-flex flex-column col-12 col-md-4">
                    <TestimonialsFallbackCard layout={1} />
                </div>
            </div>
            <div className="align-self-end"><Skeleton width={160} height={50} className="rounded-pill"/></div>
        </div>
    )
}

export function ListingsFallback() {
    return(
        <div className="container-md row px-0 justify-content-center">
            {Array(3).fill(0).map((elem, i)=>(
                <div key={i} className="col-12 col-md-6 col-xl-4 px-1 d-flex flex-column rounded-4">
                    <Skeleton height={250}  className="rounded-top-4"/>
                    <div className="d-flex flex-column gap-4 bg-light-subtle p-3 rounded-bottom-4">
                        <h3 className="fw-bold"><Skeleton /></h3>
                        <Skeleton count={4} />
                        <h5><Skeleton /></h5>
                        <div className="d-flex flex-column flex-md-row justify-content-between">
                            <Skeleton width={150} height={50} className="px-5 py-3 border-0 rounded-pill mb-2" />
                            <Skeleton width={150} height={50} className="px-5 py-3 border-0 rounded-pill mb-2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

