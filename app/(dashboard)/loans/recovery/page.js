import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation';

import { PrimaryLinkButtonIcon } from '@/app/components/buttons'
import recoveryimage from "@/public/loan-recovery.png"
import { LoanRecovery } from '@/app/components/forms';

export const metadata = {
  title: "AfriqLoan - Loan Recovery",
};

export default async function Landing({searchParams}) {
  const { source } = await searchParams
  if(source){
    if(source === "internal"){
      return <LoanRecovery />
    }else if(source==="external"){
      return <LoanRecovery />
    }else{
      notFound()
    }
  }else{
    return (
      <div className="">
        <section className="d-flex flex-column bg-primary px-4 py-5 p-md-5 column-gap-5 row-gap-4">
          <div className="d-flex flex-column">
            <h3 className="text-white">Hello Welcome!</h3>
            <p className="text-white fs-5">Loan Recovery Section</p>
          </div>
          <div className="d-inline-flex flex-column flex-md-row gap-5">
            <PrimaryLinkButtonIcon href="/loans/recovery/?source=internal">
              <i className="fa-solid fa-money-bill-1 me-2"></i>
              <span className="lh-1">Pending Loan From Internal Source</span>
            </PrimaryLinkButtonIcon>
            <PrimaryLinkButtonIcon href="/loans/recovery?source=external">
              <i className="fa-solid fa-money-bill-transfer me-2"></i>
              <span className="lh-1">Pending Loan From External Source</span>
            </PrimaryLinkButtonIcon>
          </div>
        </section>
        <section className="bg-tertiary p-3 p-md-5">
          <div className="d-flex flex-column flex-md-row">
            <div className="col-12 col-md-6 d-flex flex-column justify-content-center p-5 bg-light order-1 order-md-0">
              <h2>Debt Recovery</h2>
              <p className="fs-3">When we handle your debt recovery, we integrate into your business to create effective, ethical strategies, delivering tangible and timely results.</p>
            </div>
            <div className="col-12 col-md-6 d-flex flex-column justify-content-center order-1 order-md-0">
              <Image
                src={recoveryimage}
                alt="Savings"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{objectFit:'contain', objectPosition:'center', width:'100%', height:'100%'}}
              />
            </div>
          </div>
        </section>
      </div>
    )
  }
}
