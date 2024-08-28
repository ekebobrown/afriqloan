import Link from 'next/link'
import Image from 'next/image'

import { ActivateSavings, PrimaryLinkButtonIcon } from '@/app/components/buttons'
import SavImg from "@/public/savings-jar.png"

export default async function Landing() {
  return (
    <div id="savings"className="">
      <section className="d-flex flex-column bg-primary px-4 py-5 p-md-5 column-gap-5 row-gap-4">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
          <h4 className="text-white">Hello Welcome!</h4>
        </div>
        <div className="d-inline-flex flex-column flex-md-row gap-5">
          <PrimaryLinkButtonIcon href="/savings/create?type=personal">
            <i className="fa-solid fa-money-bill-1 me-2"></i>
            <span className="lh-1">Create A Personal Account</span>
          </PrimaryLinkButtonIcon>
          <ActivateSavings type="joint" holder={false} classNames="px-4">
            <i className="fa-solid fa-money-bill-transfer me-2"></i>
            <span className="lh-1">Activate A Joint Account</span>
          </ActivateSavings>
        </div>
      </section>
      <section className="bg-tertiary p-3 p-md-5">
        <div className="d-flex flex-column flex-md-row">
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center p-5 bg-light order-1 order-md-0">
            <h2>Savings</h2>
            <p className="fs-3">Take your partnership to the next level and manage a united financial vision with one account that’s twice as nice.</p>
          </div>
          <Image
            src={SavImg}
            alt="Savings"
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{objectFit:'contain', objectPosition:'center', width:'100%', height:'100%'}}
           />
        </div>
      </section>
    </div>
  )
}
