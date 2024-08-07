import styles from "@/app/page.module.css"

import { CopyrightSocial } from '@/app/(main)/footer'

export default function notFound() {
  return (
    <>
      <section className={`bg-white`}>
        <div className={`${styles.hero} container-md d-flex flex-column flex-md-row justify-content-center gap-2`}>
          <h3 className="border-end border-2 pe-2">404</h3>
          Page Not Found
        </div>
      </section>
      <div className="position-absolute bottom-0 start-0 w-100 bg-primary">
        <CopyrightSocial />
      </div>
    </>
  )
}