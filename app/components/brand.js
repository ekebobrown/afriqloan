import Image from 'next/image'
import Link from 'next/link'

import logo from "@/public/logo-yellow.png"

export default function Brand() {
  return (
    <Link className="order-0 navbar-brand fs-3 fw-bold" href="/">
      <h3>Afriq<span className="text-secondary">Loan</span></h3>
    </Link>
  )
}
