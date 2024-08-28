"use client"

import styles from "@/app/page.module.css"

export default function Error({error, reset}) {
  return (
    <div className={`d-flex flex-column p-5 bg-tertiary gap-2 ${styles.fh}`}>
        <div>
          <h5 className="mb-0">An error occured</h5>
          <small className="text-danger">({error?.message})</small>
        </div>
        <button className="btn btn-primary rounded-pill px-5 align-self-start" onClick={reset}>Retry</button>
    </div>
  )
}
