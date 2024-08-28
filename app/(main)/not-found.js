import styles from "@/app/page.module.css"

import { CopyrightSocial } from '@/app/(main)/footer'

export default function notFound() {
  return (
    <>
      <section className={`bg-white`}>
        <div className={`${styles.fh1} container-md d-flex flex-column flex-md-row justify-content-center align-items-center gap-2`}>
          <h3 className="border-end border-2 pe-2 align-self-center">404</h3>
          Page Not Found
        </div>
      </section>
      <div className="bg-primary">
        <CopyrightSocial />
      </div>
    </>
  )
}