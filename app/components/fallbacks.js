"use client"
import Skeleton from "react-loading-skeleton"
import { useId } from "react"

import { TestimonialsFallbackCard } from "./cards"

export function TransactionsFallback() {
    const transactionId = useId()
  return (
    <div>
        <div className="d-flex flex-column flex-md-row mb-2">
            <div>
                <Skeleton width="150px" height="20px" className="bg-secondary-subtle rounded-pill" />
                <Skeleton width="300px" height="10px" className="bg-secondary-subtle rounded-pill" />
            </div>
            <div className="d-flex gap-3 border border-1 rounded-3 p-1 align-items-center fs-5 ms-auto" style={{lineHeight:0}}>
                <Skeleton width="80px" height="50px" className="bg-dark-subtle rounded-3" />
                <Skeleton width="150px" height="20px" className="bg-dark-subtle rounded-pill align-self-center" />
                <Skeleton width="80px" height="20px" className="bg-dark-subtle rounded-pill align-self-center" />
            </div>
        </div>
        <div className=" overflow-x-scroll" style={{scrollbarWidth:'none'}}>
            <table className="table table-hover flex-fill border border-1 rounded-4 fs-6 text-nowrap">
                <thead>
                    <tr className="table-light">
                        <th><Skeleton width="60px" height="20px" className="bg-tertiary rounded-pill"/></th>
                        <th><Skeleton width="50px" height="20px" className="bg-tertiary rounded-pill"/></th>
                        <th><Skeleton width="100px" height="20px" className="bg-tertiary rounded-pill"/></th>
                        <th><Skeleton width="60px" height="20px" className="bg-tertiary rounded-pill"/></th>
                        <th><Skeleton width="90px" height="20px" className="bg-tertiary rounded-pill"/></th>
                    </tr>
                </thead>
                <tbody>
                    {Array(3).fill(0).map((elem, i)=>(
                    <tr key={`${transactionId}-${i}`}>
                        <td><Skeleton width="80%" height="20px" className="bg-tertiary rounded-pill"/></td>
                        <td><Skeleton width="90%" height="20px" className="bg-tertiary rounded-pill"/></td>
                        <td>
                            <Skeleton width="80%" height="20px" className="bg-tertiary rounded-pill"/>
                            <Skeleton width="40%" height="10px" className="bg-tertiary rounded-pill" style={{fontSize: "0.8rem"}}/>
                        </td>
                        <td><Skeleton width="80%" height="20px" className="bg-tertiary rounded-pill"/></td>
                        <td><Skeleton width="100%" height="20px" className="bg-tertiary rounded-pill"/></td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export function LoanStatusFallback() {
    return (
        <div className="d-flex flex-column gap-5">
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
        </div>
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

export function SpacesFallback() {
    const spaceId = useId
    return(
        <div className="container-md row row-cols-1 row-cols-md-3">
            {Array(3).fill(0).map((elem, i)=>(
                <div key={`${spaceId}-${i}`} className="d-flex flex-column rounded-4">
                    <Skeleton height={350}  className="rounded-top-4"/>
                    <div className="d-flex flex-column gap-4 bg-tertiary p-3 rounded-bottom-4">
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

export default function SavingsFalback() {
    return (
      <>
        <section className="d-flex flex-column bg-primary p-5 gap-5">
          <LoanStatusFallback />
        </section>
        <section id="transaction" className="bg-tertiary d-flex flex-column row-gap-3 px-3 py-5 p-md-5">
          <TransactionsFallback />
        </section>
      </>
    )
  }
  

