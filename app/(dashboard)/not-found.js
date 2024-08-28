import styles from "@/app/page.module.css"

export default function NotFound() {
  return (
    <>
      <section className={``}>
        <div className={`${styles.fh} container-md d-flex flex-column flex-md-row justify-content-center align-items-center gap-2`}>
          <h3 className="border-end border-2 pe-2 align-self-center">404</h3>
          Page Not Found!
        </div>
      </section>
      <div className="position-absolute bottom-0 start-0 w-100 bg-primary">
      </div>
    </>
  )
}